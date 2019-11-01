import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import Navigation from './components/sections/Navigation.js';
import GameBoard from './components/sections/GameBoard.js';
import TileRack from './components/sections/TileRack.js';
import Cookies from 'universal-cookie';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import DataBrowser from './components/widgets/DataBrowser.js';
import {PIECES} from './components/Helpers.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.gameServer = 'http://localhost:8081/';
		const cookies = new Cookies();
		var userCookie = cookies.get('stratego-user');
		var currentUser = false;
		if (userCookie && userCookie.user_id) {
			currentUser = userCookie;
		}
		this.state = {
			currentUser: currentUser,
			activeGame: null,
			games: []
		};
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.logUserOut = this.logUserOut.bind(this);
		this.getGames = this.getGames.bind(this);
		this.newGame = this.newGame.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.getGames();
		this.gameStates = {};
		this.gameSpaces = [];
	}
	getGames() {
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'games', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var games = [];
				for (var i in gameData) {
					var game = gameData[i];
					var opponent = '';
					var opponent_id = null;
					if (parseInt(game.starter_uid) == parseInt(uid)) {
						opponent = game.opponent_name;
						opponent_id = game.opponent_uid;
					}
					else {
						opponent = game.starter_name;
						opponent_id = game.starter_uid;
					}
					var gameEntry = {
						id: game.id,
						name: game.title,
						opponent_name: opponent,
						opponent_id: opponent_id
					}
					if (gameEntry && gameEntry.id) {
						games.push(gameEntry);
					}
				}
				app.setState({games: games});
			});
		});
	}
	setCurrentUser(user) {
		if (user.hasOwnProperty('error')) {
			return;
		}
		const cookies = new Cookies();
		var d = new Date();
		d.setTime(d.getTime() + ((60*24*30)*60*1000));
		cookies.set("stratego-user", JSON.stringify(user), { path: "/", expires: d });
		this.setState({currentUser: user});
		this.getGames();
	}
	setActiveGame(game) {
		this.setState({activeGame: game});
	}
	newGame(){
		if (this.gameBoard) {
			this.gameBoard.setState({ spaces: []});
		}
		var uid = this.state.currentUser.user_id;
		var gm = (<Game app={this} starter={uid} />);
		this.setState({activeGame: gm});
	}
	loadGame(id){
		if (this.gameBoard) {
			this.gameBoard.setState({ spaces: []});
		}
		if (this.tileSpaces) {
			for (var rank in this.tileSpaces) {
				var space = this.tileSpaces[rank];
				var initCount = PIECES[rank].count;
				space.setState( { remaining: initCount } );
			}
		}
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('id',id);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		var spaces;
		window.fetch(this.gameServer+'game', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var starterUid = gameData.starter_uid;
				var opponentUid = gameData.opponent_uid;
				spaces = JSON.parse(gameData.spaces);
				var gm = <Game app={app} id={id} starter={starterUid} opponent={opponentUid} spaces={spaces} />;
				if (app.gameBoard) {
					for (var i in spaces) {
						var space = spaces[i];
						app.gameBoard.placePiece({ rank: space.rank, color: space.color, tileSpace: app.tileSpaces[space.rank] }, space.id, true);
					}
				}
				if (app.tileRack) {
					
					if (app.state.currentUser.user_id == gm.props.starter) {
						app.tileRack.playerColor = 'blue';
					}
					else {
						app.tileRack.playerColor = 'red';
					}
				}
				
				app.setState({activeGame: gm});
			});
		});
	}
	saveActiveGame(){
		if (!this.state.activeGame || !this.state.currentUser) {
			return false;
		}
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		var id = this.state.activeGame.props.id;
		if (!uid || !userKey || !id) {
			return false;
		}
		var captured = [];
		if (this.gameStates[id]) {
			captured = this.gameStates[id].captured;
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		formData.append('game_id',id);
		formData.append('captured',JSON.stringify(captured));
		var spaces = this.gameBoard.state.spaces;
		var saveSpaces = [];
		for (var i in spaces) {
			var space = {};
			if (spaces[i].props.occupied) {
				space.id = spaces[i].props.id;
				space.rank = spaces[i].props.children.props.rank;
				space.color = spaces[i].props.children.props.color;
				saveSpaces[i] = space;
			}
		}
		for (var i in saveSpaces) {
			var space = saveSpaces[i];
			if (!space) {
				delete saveSpaces[i];
			}
		}
		var filtered = saveSpaces.filter(function (el) {
		  return el != null;
		});
		formData.append('spaces',JSON.stringify(filtered));
		window.fetch(this.gameServer+'saveGame', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
			});
		});
	}
	logUserOut() {
		const cookies = new Cookies();
		cookies.remove("stratego-user");
		this.setState({currentUser: false, activeGame: null, games: []});
	}
	preLoginBody() {
		return (
			<div className="preLogin p-3">
				<h2>Welcome to Stratego!  Please register or login above.</h2>
			</div>
		);
	}
	userMenuBody() {
		var app = this;
		return (
			<div className="userMenu p-3">
				<DataBrowser label="Games:" items={app.state.games} view="list" callback={this.loadGame} id="userGameList" deleteEmpty={true} itemClick={this.gameChange} />
				<input type="button" value="New Game" onClick={this.newGame} />
			</div>
		);
	}
	gameBody(game) {
		var id = game.props.id || fase;
		return (
			<Game app={this} id={id} />
		);
	}
	getBody() {
		if (this.state.activeGame) {
			return this.state.activeGame;
		}
		else if (this.state.currentUser) {
			return this.userMenuBody();
		}
		else {
			return this.preLoginBody();
		}
	}
	render() {
		const body = this.getBody();
		return (
			<div className="app-wrapper p-0 m-0">
				<Navigation app={this} loginCallback={this.setCurrentUser} logoutCallback={this.logUserOut} />
				{body}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			id: props.id || false,
			players: {
				blue: null,
				red: null
			},
			captured: {
				
			},
			started: props.started || false
		};
	}
	render() {
		var app = this.props.app;
		if (this.props.id) {
			app.gameStates[this.props.id] = this.state;
		}
		var gameBoard = <GameBoard game={this} app={app} />;
		if (app.state.currentUser) {
			return (
				<div className="container-fluid mx-auto game-bg">
					<DndProvider backend={HTML5Backend}>
						<div className="row">
							<div className="col-12 col-md-8 col-lg-9 pr-0">
				{gameBoard}
							</div>
							<div className="col-12 col-md-4 col-lg-3 pr-0 tileRack-col">
								<TileRack game={this} app={app} />
							</div>
						</div>
					</DndProvider>
				</div>
			);
		}
		else {
			return (
				<div className="container-fluid mx-auto game-bg">
					<Navigation game={this} loginCallback={app.setCurrentUser} logoutCallback={app.logUserOut} />
					<div className="row">
						<div className="col-12 col-md-8 col-lg-9 pr-0">
							<h1>HI PLEASE LOG IN TO PLAY.</h1>
						</div>
						<div className="col-12 col-md-4 col-lg-3 pr-0 tileRack-col">

						</div>
					</div>
				</div>
			);
		}
	}
}

// ========================================

ReactDOM.render(
	<App />,
	document.getElementById('root')
);