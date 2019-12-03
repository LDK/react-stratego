import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import NewGameMenu from './components/menus/NewGame.js';
import Navigation from './components/sections/Navigation.js';
import Game from './game.js';
import Cookies from 'universal-cookie';
import HTML5Backend from 'react-dnd-html5-backend';
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
			newGameFormOpen: false,
			opponentSelectMode: 'past',
			userSearch: '',
			pastOpponents: [],
			games: [],
			requests: [],
			invites: []
		};
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.logUserOut = this.logUserOut.bind(this);
		this.acceptInvite = this.acceptInvite.bind(this);
		this.declineInvite = this.declineInvite.bind(this);
		this.cancelRequest = this.cancelRequest.bind(this);
		this.getGames = this.getGames.bind(this);
		this.getInvites = this.getInvites.bind(this);
		this.getRequests = this.getRequests.bind(this);
		this.pollGames = this.pollGames.bind(this);
		this.newGame = this.newGame.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.openNewGameMenu = this.openNewGameMenu.bind(this);
		this.pollOpponentStatus = this.pollOpponentStatus.bind(this);

		this.getGames();
		this.getInvites();
		this.getRequests();
		this.gameStates = {};
		this.gameSpaces = [];
		this.opponentPoll = setInterval( this.pollOpponentStatus, 3000 );
		this.gamesPoll = setInterval( this.pollGames, 15000 );
	}
	acceptInvite(id){
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('game_id',id);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'accept_invite', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var result = JSON.parse(text);
				if (result.accepted) {
					app.loadGame(result.accepted.id)
				}
			});
		});
	}
	declineInvite(id) {
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('game_id',id);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'decline_invite', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var result = JSON.parse(text);
				if (result.declined) {
					var invites = app.state.invites;
					for (var i in invites) {
						var req = invites[i];
						if (req.id) {
							invites.splice(i,1)
						}
					}
					app.setState({invites: invites});
				}
			});
		});
	}
	pollGames() {
		this.getGames();
		this.getInvites();
		this.getRequests();
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
					var started = 0;
					if (parseInt(game.starter_uid) == parseInt(uid)) {
						opponent = game.opponent_name;
						opponent_id = game.opponent_uid;
					}
					else {
						opponent = game.starter_name;
						opponent_id = game.starter_uid;
					}
					if (parseInt(game.started)) {
						started = 1;
					}
					var gameEntry = {
						id: game.id,
						name: game.title,
						opponent_name: opponent,
						opponent_id: opponent_id,
						started: started
					}
					if (gameEntry && gameEntry.id) {
						games.push(gameEntry);
					}
				}
				app.setState({games: games});
			});
		});
	}
	getRequests() {
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'outgoing_requests', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var requests = [];
				for (var i in gameData) {
					var game = gameData[i];
					var gameEntry = {
						id: game.game_id,
						name: game.title,
						opponent_name: game.opponent_name,
						opponent_id: game.opponent_id
					}
					if (gameEntry && gameEntry.id) {
						requests.push(gameEntry);
					}
				}
				app.setState({requests: requests});
			});
		});
	}
	getInvites() {
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'incoming_invites', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var invites = [];
				for (var i in gameData) {
					var game = gameData[i];
					var gameEntry = {
						id: game.game_id,
						name: game.title,
						opponent_name: game.opponent_name,
						opponent_id: game.opponent_id
					}
					if (gameEntry && gameEntry.id) {
						invites.push(gameEntry);
					}
				}
				app.setState({invites: invites});
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
		this.getRequests();
		this.getInvites();
	}
	setActiveGame(game) {
		this.setState({activeGame: game});
	}
	newGame(event){
	}
	openNewGameMenu(){
		this.getPastOpponents();
		this.newGameMenu.setState({ formOpen: true });
		return;
	}
	loadGame(id){
		if (isNaN(parseInt(id))) {
			this.tileSpaces = null;
			this.tileRack = null;
			this.gameBoard = null;
			this.setState({ activeGame: null });
			return;
		}
		if (this.gameBoard) {
			this.gameBoard.setState({ spaces: []});
		}
		if (this.tileSpaces) {
			for (var rank in this.tileSpaces) {
				var space = this.tileSpaces[rank];
				var initCount = PIECES[rank].count;
				space.remaining = initCount;
				space.setState({ remaining: space.remaining });
			}
		}
		if (this.tileRack) {
			this.tileRack.remaining = 40;
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
				var starterReady = gameData.starter_ready;
				var opponentReady = gameData.opponent_ready;
				var opponentName = gameData.opponent_name;
				var starterName = gameData.starter_name;
				var starterUid = gameData.starter_uid;
				var opponentUid = gameData.opponent_uid;
				var started = gameData.started;
				var turn = gameData.turn;
				spaces = JSON.parse(gameData.spaces);
				var gm = <Game app={app} id={id} starter={starterUid} opponent={opponentUid} starterName={starterName} opponentName={opponentName} spaces={spaces} starterReady={starterReady} opponentReady={opponentReady} turn={turn} started={started} />;
				if (app.gameRef) {
					app.gameRef.setState({
						id: id,
						started: started,
						turn: turn
					});
				}
				if (app.tileRack) {
					if (uid == starterUid) {
						app.tileRack.playerColor = 'blue';
					}
					else {
						app.tileRack.playerColor = 'red';
					}
				}
				if (app.gameBoard) {
					for (var i in spaces) {
						var space = spaces[i];
						var piece = { rank: space.rank, color: space.color, tileSpace: app.tileSpaces[space.rank] };
						app.gameBoard.placePiece(piece, space.id, true);
					}
				}
				app.setState({activeGame: gm});
				app.nav.setState({});
			});
		});
	}
	cancelRequest(id){
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		var app = this;
		formData.append('game_id',id);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'cancel_request', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var result = JSON.parse(text);
				if (result.cancelled) {
					var reqs = app.state.requests;
					for (var i in reqs) {
						var req = reqs[i];
						if (req.id) {
							reqs.splice(i,1)
						}
					}
					app.setState({requests: reqs});
				}
			});
		});
	}
	pollOpponentStatus(){
		if (!this.state.activeGame || !this.state.activeGame.props.id || !this.tileRack || !this.gameBoard || !this.tileSpaces) {
			return null;
		}
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return null;
		}
		var formData = new FormData();
		var app = this;
		var game = this.gameBoard.props.game;
		formData.append('game_id',app.state.activeGame.props.id);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		var spaces;
		window.fetch(this.gameServer+'opponent_status', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var opponentReady = gameData.opponent_ready;
				spaces = JSON.parse(gameData.opponent_spaces);
				var started = gameData.started;
				var turn = gameData.turn;
				var opponentColor;
				if (app.tileRack.playerColor == 'blue') {
					opponentColor = 'red';
				}
				else {
					opponentColor = 'blue';
				}
				if (opponentReady != game.state.players[opponentColor].ready) {
					var players = game.state.players;
					players[opponentColor].ready = opponentReady;
					game.setState({players: players});
				}
				if (started != game.state.started) {
					game.setState({started: started});
				}
				if (turn != game.state.turn) {
					game.setState({turn: turn});
				}
				var newSpaceIds = [];
				var oldSpaceIds = [];
				for (var i in spaces) {
					newSpaceIds.push(spaces[i].id);
				}
				for (var i in app.gameBoard.state.spaces) {
					if (!app.gameBoard.state.spaces[i].props.children) {
						continue;
					}
					if 
						(app.gameBoard.state.spaces[i].props.children.props.color == opponentColor) {
							oldSpaceIds.push(app.gameBoard.state.spaces[i].props.id);
						}
				}
				for (var i in newSpaceIds) {
					var id = newSpaceIds[i];
					if (!oldSpaceIds.includes(id)) {
						var piece = { rank: null, color: opponentColor, tileSpace: null };
						app.gameBoard.placePiece(piece, id, false);
					}
				}
				for (var i in oldSpaceIds) {
					var id = oldSpaceIds[i];
					if (!newSpaceIds.includes(id)) {
						app.gameBoard.emptySpace(id);
					}
				}
				return;
				if (app.gameBoard) {
					for (var i in spaces) {
						var space = spaces[i];
						var piece = { rank: space.rank, color: space.color, tileSpace: app.tileSpaces[space.rank] };
						app.gameBoard.placePiece(piece, space.id, true);
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
		var players = [];
		var started = 0;
		var turn = null;
		if (this.gameStates[id]) {
			captured = this.gameStates[id].captured;
			players = this.gameStates[id].players;
			started = this.gameStates[id].started ? 1 : 0;
			turn = this.gameStates[id].turn;
		}
		var formData = new FormData();
		var app = this;
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		formData.append('game_id',id);
		formData.append('started',started);
		if (turn) {
			formData.append('turn',turn);
		}
		formData.append('players',JSON.stringify(players));
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
	getPastOpponents() {
		if (!this.state.currentUser) {
			return false;
		}
		var app = this;
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'past_opponents', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var opps = JSON.parse(text);
				var opponents = [{ id: null, name: ' - Select Username - '}];
				for (var oppId in opps) {
					var oppName = opps[oppId];
					var oppEntry = {
						id: oppId,
						name: oppName
					}
					if (oppEntry && oppEntry.id) {
						opponents.push(oppEntry);
					}
				}
				app.setState({ pastOpponents: opponents });
			});
		});
	}
	userMenuBody() {
		var app = this;
		const newGameForm = <NewGameMenu app={app} />;
		return (
			<div className="userMenu p-3">
				{newGameForm}
				<DataBrowser label="Active Games:" items={app.state.games} view="list" callback={this.loadGame} id="userGameList" deleteEmpty={true} hideIfEmpty={true} />
				<DataBrowser label="Invites:" items={app.state.invites} view="list" id="userInviteList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'accept', action: app.acceptInvite},{label: 'decline', action: app.declineInvite}]} />
				<DataBrowser label="Outgoing Requests:" items={app.state.requests} view="list" id="userRequestList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'cancel', action: app.cancelRequest}]} />
				<input type="button" value="New Game" onClick={this.openNewGameMenu} />
			</div>
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

// ========================================

ReactDOM.render(
	<App />,
	document.getElementById('root')
);