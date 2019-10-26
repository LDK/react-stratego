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
		this.getGames();
	}
	getGames() {
		var uid = this.state.currentUser.user_id;
		if (!uid) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',this.state.currentUser.user_id);
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
					games.push({
						id: game.id,
						name: game.title
					});
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
		var gm = (<Game app={this} />);
		this.setState({activeGame: gm});
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
		return (
			<div className="userMenu p-3">
				<h2>No Game Started.</h2>
				<input type="button" value="New Game" onClick={this.newGame} />
			</div>
		);
	}
	gameBody() {
		return (
			<Game app={this} />
		);
	}
	getBody() {
		if (this.state.activeGame) {
			return this.gameBody();
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
			started: props.started || false
		};
		this.app = props.app;
		this.app.setActiveGame(this);
	}
	render() {
		var app = this.app;
		if (app.state.currentUser) {
			return (
				<div className="container-fluid mx-auto game-bg">
					<DndProvider backend={HTML5Backend}>
						<div className="row">
							<div className="col-12 col-md-8 col-lg-9 pr-0">
								<GameBoard game={this} />
							</div>
							<div className="col-12 col-md-4 col-lg-3 pr-0 tileRack-col">
								<TileRack game={this} />
							</div>
						</div>
					</DndProvider>
				</div>
			);
		}
		else {
			console.log('oh',this.state);
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