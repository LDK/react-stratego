import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import NewGameMenu from './components/menus/NewGame.js';
import JoinGameMenu from './components/menus/JoinGame.js';
import UserOptionsMenu from './components/menus/UserOptions.js';
import UserProfile from './components/menus/UserProfile.js';
import Navigation from './components/sections/Navigation.js';
import Game from './game.js';
import Cookies from 'universal-cookie';
import HTML5Backend from 'react-dnd-html5-backend';
import DataBrowser from './components/widgets/DataBrowser.js';
import {PIECES} from './components/Helpers.js';
import {keyCodes} from './components/Helpers.js';
import {time2TimeAgo} from './components/Helpers.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		
		// this.gameServer = 'http://stratego-api.electric-bungalow.com/';
		this.gameServer = 'http://localhost:3000/';
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
		this.pollGames = this.pollGames.bind(this);
		this.newGame = this.newGame.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.openNewGameMenu = this.openNewGameMenu.bind(this);
		this.openUserProfile = this.openUserProfile.bind(this);

		// FOR DEBUG ONLY
		// this.reportRenders = true;

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
		this.getUsernames();
		this.gameStates = {};
		this.gameSpaces = [];
		this.gamesPoll = setInterval( this.pollGames, 15000 );
	}
	acceptInvite(id,notificationId){
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var app = this;
		var payload = { user_id: uid, userKey: userKey, game_id: id, notification_id: notificationId };
		window.fetch(this.gameServer+'accept_invite', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var result = JSON.parse(text);
				if (result.accepted) {
					app.getInvites();
					app.UserStatus.getNotifications();
					app.loadGame(result.accepted.id);
				}
			});
		});
	}
	declineInvite(id,notificationId) {
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var app = this;
		var payload = { user_id: uid, userKey: userKey, game_id: id, notification_id: notificationId };
		window.fetch(this.gameServer+'decline_invite', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var result = JSON.parse(text);
				if (result.declined) {
					app.getInvites();
					app.UserStatus.getNotifications();
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
		var app = this;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(this.gameServer+'games', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var games = { recent: [], active: []};
				for (var listName in games) {
					for (var i in gameData[listName]) {
						var game = gameData[listName][i];
						var last_move = game.last_move_ts;
						if (last_move) {
							last_move = time2TimeAgo(last_move);
						}
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
						var turn_name = null;
						if (game.turn) {
							if (game.turn == 'blue') {
								turn_name = game.starter_name;
							}
							else if (game.turn == 'red') {
								turn_name = game.opponent_name;
							}
						}
						var winner_name = null;
						if (game.winner) {
							if (game.winner == game.starter_uid) {
								winner_name = game.starter_name;
							}
							else if (game.winner == game.opponent_uid) {
								winner_name = game.opponent_name;
							}
						}
						var gameEntry = {
							id: game.id,
							name: game.title,
							opponent_name: opponent,
							opponent_id: opponent_id,
							started: started,
							turn: turn_name,
							last_move_ts: game.last_move_ts,
							last_move: last_move,
							winner: winner_name
						}
						if (gameEntry && gameEntry.id) {
							games[listName].push(gameEntry);
						}
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
		var app = this;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(this.gameServer+'outgoing_requests', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
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
		var app = this;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(this.gameServer+'incoming_invites', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
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
		this.newGameMenu.setState({ formOpen: true });
		return;
	}
	openUserProfile(uid){
		console.log('Opening user profile ',uid);
		this.userProfile.setState({ formOpen: true });
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
		var app = this;
		if (app.gameBoard && app.gameOpened) {
			app.gameBoard.setState({ spaces: []});
		}
		if (app.tileSpaces) {
			for (var rank in this.tileSpaces) {
				var space = this.tileSpaces[rank];
				var initCount = PIECES[rank].count;
				space.remaining = initCount;
				space.setState({ remaining: space.remaining });
			}
		}
		if (app.tileRack) {
			app.tileRack.remaining = 40;
		}
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var payload = { user_id: uid, userKey: userKey, id: id };
		var spaces;
		app.gameOpened = false;
		window.fetch(this.gameServer+'game', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				var gameStatus = gameData.status;
				var starterReady = gameData.starter_ready;
				var opponentReady = gameData.opponent_ready;
				var opponentName = gameData.opponent_name;
				var starterName = gameData.starter_name;
				var starterUid = gameData.starter_uid;
				var opponentUid = gameData.opponent_uid;
				var started = gameData.started;
				var turn = gameData.turn;
				var attacks = gameData.attacks;
				var winnerUid = gameData.winner_uid || false;
				var players = {
					blue: { id: starterUid, ready: !!starterReady, name: starterName },
					red: { id: opponentUid, ready: !!starterReady, name: opponentName }
				}
				
				var last_attack = JSON.parse(gameData.last_attack);
				var captured = JSON.parse(gameData.captured);
				spaces = JSON.parse(gameData.spaces);
				var gm = <Game app={app} id={id} starter={starterUid} opponent={opponentUid} starterName={starterName} opponentName={opponentName} spaces={spaces} starterReady={starterReady} opponentReady={opponentReady} turn={turn} started={started} attacks={attacks} last_attack={last_attack} captured={captured} status={gameStatus} winner_uid={winnerUid} />;
				if (app.gameRef) {
					app.gameRef.setState({
						id: id,
						started: started,
						turn: turn,
						players: players,
						status: gameStatus
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
				app.gameOpened = (new Date()).getTime();
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
		var app = this;
		var payload = { game_id: id, user_id: uid, userKey: userKey};
		window.fetch(this.gameServer+'cancel_request', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
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
	saveActiveGame(moveData){
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
		var app = this;
		var payload = {
			user_id: uid,
			userKey: userKey,
			game_id: id,
			started: started,
			players: JSON.stringify(players)
		};
		if (turn) {
			payload.turn = turn;
		}
		if (moveData) {
			payload.moveData = JSON.stringify(moveData);
		}
		var capturedList = this.getCapturedList(captured);
		payload.capturedList = JSON.stringify(capturedList);
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
		payload.spaces = JSON.stringify(saveSpaces);
		window.fetch(this.gameServer+'saveGame', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				app.getGames();
			});
		});
	}
	preLoginBody() {
		return (
			<div className="preLogin py-3">
				<h2>Welcome to Stratego!  Please register or login above.</h2>
			</div>
		);
	}
	getUsernames() {
		if (!this.state.currentUser) {
			return false;
		}
		var app = this;
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(this.gameServer+'usernames', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
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
			<div className="userMenu py-3">
				<DataBrowser label="Active and Open Games:" items={this.state.games.active} view="list" afterKeys={{ turn: 'Turn: %this%', last_move: 'Last Move: %this%' }} afterParentheses={true} callback={this.loadGame} id="userGameList" deleteEmpty={true} hideIfEmpty={true} />
				<DataBrowser label="Recently Finished Games:" items={this.state.games.recent} afterKeys={{ winner: 'Winner: %this%' }} afterParentheses={true} view="list" callback={this.loadGame} id="recentGameList" deleteEmpty={true} hideIfEmpty={true} />
				<DataBrowser label="Invites:" items={this.state.invites} view="list" id="userInviteList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'accept', action: this.acceptInvite},{label: 'decline', action: this.declineInvite}]} />
				<DataBrowser label="Outgoing Requests:" items={this.state.requests} view="list" id="userRequestList" deleteEmpty={true} hideIfEmpty={true} afterLinks={[{label: 'cancel', action: this.cancelRequest}]} />
				<input type="submit" value="New Game" onClick={this.openNewGameMenu} />
			</div>
		);
	}
	getBody() {
		var body = '', bodyClass = 'container mx-auto';
		var rowClass = "row no-gutters";
		if (this.state.activeGame) {
			body = this.state.activeGame;
			bodyClass = 'container-fluid game-bg px-0 pt-4 pt-lg-0';
			rowClass = "row";
		}
		else if (this.state.currentUser) {
			body = this.userMenuBody();
		}
		else {
			body = this.preLoginBody();
		}
		return (
			<div className={bodyClass} id="app-body">
				<div className={rowClass}>
					{body}
				</div>
			</div>
		);
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
			case keyCodes['space']:
				if (this.gameRef) {
					var game = this.gameRef;
					if (!game.state.started && game.state.placementMode == 'keyboard') {
						if (this.gameBoard.state.highlighted) {
							this.gameBoard.swapByKeyboard(this.gameBoard.state.highlighted);
						}
						else {
							this.gameBoard.highlightByKeyboard();
						}
					}
				}
			break;
		}
	}
	render() {
		const body = this.getBody();
		if (this.reportRenders) { console.log('app rendering'); }
		return (
				<div className="app-wrapper p-0 m-0" onKeyDown={this.onKeyDown} tabIndex="0">
					<Navigation app={this} />
					{body}
					<NewGameMenu app={this} />
					<UserProfile app={this} />
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
