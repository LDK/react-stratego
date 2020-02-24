import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import NewGameMenu from './components/menus/NewGame.js';
import JoinGameMenu from './components/menus/JoinGame.js';
import UserOptionsMenu from './components/menus/UserOptions.js';
import Navigation from './components/sections/Navigation.js';
import Game from './game.js';
import Cookies from 'universal-cookie';
import HTML5Backend from 'react-dnd-html5-backend';
import DataBrowser from './components/widgets/DataBrowser.js';
import {PIECES} from './components/Helpers.js';
import {keyCodes} from './components/Helpers.js';

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
			opponentSelectMode: 'past',
			userSearch: '',
			games: [],
			requests: [],
			invites: []
		};
		this.pastOpponents = [];
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.acceptInvite = this.acceptInvite.bind(this);
		this.declineInvite = this.declineInvite.bind(this);
		this.cancelRequest = this.cancelRequest.bind(this);
		this.getGames = this.getGames.bind(this);
		this.getInvites = this.getInvites.bind(this);
		this.getRequests = this.getRequests.bind(this);
		this.getUsernames = this.getUsernames.bind(this);
		this.getOpenGames = this.getOpenGames.bind(this);
		this.getPastOpponents = this.getPastOpponents.bind(this);
		this.pollGames = this.pollGames.bind(this);
		this.newGame = this.newGame.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.openNewGameMenu = this.openNewGameMenu.bind(this);
		this.pollOpponentStatus = this.pollOpponentStatus.bind(this);

		this.onKeyDown = this.onKeyDown.bind(this);
		this.keyCodeLookup = {};
		for (var key in keyCodes) {
			this.keyCodeLookup[keyCodes[key]] = key;
		}

		this.usernames = {};
		this.usernameLookup = {};

		this.getGames();
		this.getInvites();
		this.getRequests();
		this.getPastOpponents();
		this.getUsernames();
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
					app.loadGame(result.accepted.id);
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
		this.getOpenGames();
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
				var attacks = gameData.attacks;
				var last_attack = JSON.parse(gameData.last_attack);
				var captured = JSON.parse(gameData.captured);
				spaces = JSON.parse(gameData.spaces);
				var gm = <Game app={app} id={id} starter={starterUid} opponent={opponentUid} starterName={starterName} opponentName={opponentName} spaces={spaces} starterReady={starterReady} opponentReady={opponentReady} turn={turn} started={started} attacks={attacks} last_attack={last_attack} captured={captured} />;
				if (app.gameRef) {
					app.gameRef.setState({
						id: id,
						started: started,
						turn: turn
					});
					app.gameRef.clearCaptured();
					for (var i in captured) {
						var pieceId = captured[i];
						var pieceColor = pieceId.split('-')[0];
						var pieceRank = pieceId.split('-')[1];
						app.gameRef.addCaptured({color: pieceColor, rank: pieceRank });
					}
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
				app.gameOpened = (new Date()).getTime() / 1000;
				app.setState({activeGame: gm});
				if (app.nav && app.nav.gameBrowser) {
					app.nav.gameBrowser.setState({value: id});
				}
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
		var gameId = app.state.activeGame.props.id;
		formData.append('game_id',gameId);
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
				if (gameData.game_id && gameData.game_id != gameId) {
					return;
				}
				var opponentReady = gameData.opponent_ready;
				spaces = JSON.parse(gameData.opponent_spaces);
				var started = gameData.started;
				var turn = gameData.turn;
				var attacks = gameData.attacks;
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
				var remaining = game.state.players[opponentColor].soldiers;
				if (!remaining || remaining != gameData['soldiers_remaining']) {
					var players = game.state.players;
					players[opponentColor].soldiers = gameData['soldiers_remaining'];
					game.setState({players: players});
				}
				var last_attack = null;
				if (attacks != game.state.attacks) {
					// Trigger battle modal and populate with last_attack data 
					last_attack = JSON.parse(gameData.last_attack);
					if (app.gameOpened && app.gameOpened < last_attack.time) {
						game.setState({attacks: attacks, last_attack: last_attack});
						app.gameBoard.openBattleModal();
						app.gameBoard.getBattleContent(last_attack);
					}
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
			});
		});
	}
	getCapturedList(captured) {
		var rList = [];
		for (var color in captured) {
			for (var rank in captured[color]) {
				if (captured[color][rank].props.count) {
					for (var i = 1;i <= captured[color][rank].props.count;i++) {
						rList.push(color+'-'+rank);
					}
				}
			}
		}
		return rList;
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
		var capturedList = this.getCapturedList(captured);
		formData.append('captured',JSON.stringify(capturedList));
		var spaces = this.gameBoard.state.spaces;
		var saveSpaces = {};
		for (var i in spaces) {
			var space = {};
			if (spaces[i].props.occupied) {
				space.id = spaces[i].props.id;
				space.rank = spaces[i].props.children.props.rank;
				space.color = spaces[i].props.children.props.color;
				saveSpaces[space.id] = space;
			}
		}
		for (var i in saveSpaces) {
			var space = saveSpaces[i];
			if (!space || !space.id || !space.rank) {
				delete saveSpaces[i];
			}
		}
		formData.append('spaces',JSON.stringify(saveSpaces));
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
				var opponents = [];
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
				// app.setState({ pastOpponents: opponents });
				app.pastOpponents = opponents;
			});
		});
	}
	getOpenGames() {
		if (!this.state.currentUser) {
			return false;
		}
		var app = this;
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'open_games', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gms = JSON.parse(text);
				var games = [];
				for (var gameId in gms) {
					var title = gms[gameId].title;
					var oppName = gms[gameId].starter_name;
					var gameEntry = {
						id: gameId,
						name: title,
						opponent: oppName
					}
					if (gameEntry && gameEntry.id) {
						games.push(gameEntry);
					}
				}
				app.openGames = games;
			});
		});
	}
	getUsernames() {
		if (!this.state.currentUser) {
			return false;
		}
		var app = this;
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(this.gameServer+'usernames', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var users = JSON.parse(text);
				app.usernames = users;
				var usernameLookup = {};
				for (var userId in users) {
					usernameLookup[users[userId]] = userId;
				}
				app.usernameLookup = usernameLookup;
			});
		});
	}
	userMenuBody() {
		return (
			<div className="userMenu p-3">
				<DataBrowser label="Active and Open Games:" items={this.state.games} view="list" callback={this.loadGame} id="userGameList" deleteEmpty={true} hideIfEmpty={true} />
				<DataBrowser label="Invites:" items={this.state.invites} view="list" id="userInviteList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'accept', action: this.acceptInvite},{label: 'decline', action: this.declineInvite}]} />
				<DataBrowser label="Outgoing Requests:" items={this.state.requests} view="list" id="userRequestList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'cancel', action: this.cancelRequest}]} />
				<input type="submit" value="New Game" onClick={this.openNewGameMenu} />
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
	onKeyDown (e) {
		if (!e.keyCode) { return; }
		switch (e.keyCode) {
			// Arrow Keys
			case 37:
			case 38:
			case 39:
			case 40:
				if (this.gameRef) {
					var game = this.gameRef;
					if (!game.state.started && game.state.placementMode == 'keyboard') {
						this.gameBoard.placementArrowMove(e.keyCode);
					}
				}
			break;
			case keyCodes['1']:
			case keyCodes['2']:
			case keyCodes['3']:
			case keyCodes['4']:
			case keyCodes['5']:
			case keyCodes['6']:
			case keyCodes['7']:
			case keyCodes['8']:
			case keyCodes['9']:
			case keyCodes['s']:
			case keyCodes['b']:
			case keyCodes['f']:
				if (this.gameRef) {
					var game = this.gameRef;
					if (!game.state.started && game.state.placementMode == 'keyboard') {
						this.gameBoard.placeByKeyboard(this.keyCodeLookup[e.keyCode]);
					}
				}
			break;
			case keyCodes['esc']:
				if (this.activeModal && this.activeModal.props.onKeyDown) {
					this.activeModal.props.onKeyDown(e);
				}
			break;
		}
	}
	render() {
		const body = this.getBody();
		return (
				<div className="app-wrapper p-0 m-0" onKeyDown={this.onKeyDown} tabIndex="0">
					<Navigation app={this} />
					{body}
					<NewGameMenu app={this} />
					<JoinGameMenu app={this} />
					<UserOptionsMenu app={this} />
				</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
