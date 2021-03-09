import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import GameBoard from './components/sections/GameBoard.js';
import GamePiece from './components/widgets/GamePiece.js';
import InfoPanel from './components/widgets/InfoPanel.js';
import HelpBar from './components/widgets/HelpBar.js';
import HTML5Backend from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import { isMobile } from "react-device-detect";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			id: props.id || false,
			players: {
				blue: { id: props.starter, ready: props.starterReady || false, name: props.starterName },
				red: { id: props.opponent || null, ready: props.opponentReady || false, name: props.opponentName }
			},
			captured: {
				blue: {},
				red: {}
			},
			turn: props.turn || null,
			placementMode: 'click',
			started: !!props.started,
			status: props.status || 'pending',
			attacks: props.attacks || 0,
			winner_uid: props.winner_uid || false,
			last_move_ts: props.last_move_ts || false,
			last_attack: props.last_attack || {}
		};
		if (isMobile) {
			this.state.placementMode = 'click';
		}
		this.selectedRank =  null;
		this.startGame = this.startGame.bind(this);
		this.modeChange = this.modeChange.bind(this);
		this.openQuickLoadModal = this.openQuickLoadModal.bind(this);
		this.addCaptured = this.addCaptured.bind(this);
		this.clearCaptured = this.clearCaptured.bind(this);
		this.pollOpponentStatus = this.pollOpponentStatus.bind(this);
		this.polled = false;
		if (props.captured) {
			for (var i in props.captured) {
				var pieceId = props.captured[i];
				var pieceColor = pieceId.split('-')[0];
				var pieceRank = pieceId.split('-')[1];
				this.addCaptured({color: pieceColor, rank: pieceRank },true);
			}
		}
	}
	pollOpponentStatus(){
		var app = this.props.app;
		if (!app.state.activeGame || !app.state.activeGame.props.id || !app.tileRack || !app.gameBoard || !app.tileSpaces || !app.gameOpened) {
			return null;
		}
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		if (!uid || !userKey) {
			return null;
		}
		var game = this;
		var gameId = app.state.activeGame.props.id;
		var payload = { game_id: gameId, user_id: uid, userKey: userKey };
		var spaces;
		window.fetch(app.gameServer+'opponent_status', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			if (!game.polled) {
				app.UserStatus.getNotifications();
			}
			game.polled = true;
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
				var last_move = gameData.last_move ? JSON.parse(gameData.last_move) : {};
				var gameChanges = {};
				if (last_move && !!app.tileRack && (app.tileRack.playerColor != last_move.color) && (!game.state.last_move || (last_move.ts != game.state.last_move.ts))) {
					gameChanges.last_move = last_move;
				}
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
					gameChanges.players = players;
				}
				if (started != game.state.started) {
					gameChanges.started = started;
				}
				if (turn != game.state.turn) {
					gameChanges.turn = turn;
				}
				var remaining = game.state.players[opponentColor].soldiers;
				if (remaining === undefined || remaining != gameData['soldiers_remaining']) {
					var players = game.state.players;
					players[opponentColor].soldiers = gameData['soldiers_remaining'];
					gameChanges.players = players;
				}
				if (Object.keys(gameChanges).length) {
					game.setState(gameChanges);
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
						app.gameBoard.placePiece(piece, id, true);
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
	componentDidMount() {
		this.props.app.gameRef = this;
		this.opponentPoll = setInterval( this.pollOpponentStatus, 3000 );
	}
	clearCaptured() {
		this.state.captured = { blue: {}, red: {} };
	}
	addCaptured(pieceInfo,loading) {
		var captured = this.state.captured;
		var pieceCount = 1;
		if (captured[pieceInfo.color][pieceInfo.rank]) {
			pieceCount = captured[pieceInfo.color][pieceInfo.rank].props.count + 1;
		}
		captured[pieceInfo.color][pieceInfo.rank] = <GamePiece color={pieceInfo.color} rank={pieceInfo.rank} captured={true} game={this} count={pieceCount} key={pieceInfo.color+'-'+pieceInfo.rank} extraClass="w-50 d-inline-block mb-2" />
		if (loading) {
			// this needs to go away 
			this.state.captured = captured;
		}
		else {
			this.setState({ captured: captured });
		}
		// this.state.captured = captured;
		// captured[pieceInfo.color].push(<GamePiece color={pieceInfo.color} rank={pieceInfo.rank} captured={true} game={this} />)
	}
	startGame() {
		var app = this.props.app;
		var gb = this.props.app.gameBoard;
		gb.selectSpace(null);
		gb.highlightSpace(null);
		this.setState({ started: true });
		var turn = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue';
		app.gameStates[this.props.id].started = true;
		app.gameStates[this.props.id].turn = turn;
		app.saveActiveGame();
	}
	toggleTurn() {
		var turn;
		if (this.state.turn == 'blue') {
			turn = 'red';
		}
		else {
			turn = 'blue';
		}
		this.setState({turn: turn});
	}
	modeChange(val) {
		this.setState({ placementMode: val });
		if (val == 'keyboard') {
			this.props.app.gameBoard.selectSpace(1);
		}
		else {
			this.props.app.gameBoard.selectSpace(null);
			this.props.app.gameBoard.highlightSpace(null);
		}
		if (val != 'quick') {
			this.props.app.gameBoard.QuickLoadMenu.previousMode = val;
		}
	}
	openQuickLoadModal() {
		var app = this.props.app;
		app.gameBoard.QuickLoadMenu.setState({ formOpen: true });
	}
	componentWillUnmount() {
		clearInterval(this.opponentPoll);
		var app = this.props.app
		app.gameRef = null;
		app.gameOpened = false;
	}
	render() {
		var app = this.props.app;
		if (app.reportRenders) { console.log('Game rendering'); }
		if (this.props.id) {
			app.gameStates[this.props.id] = this.state;
		}
		var uid = parseInt(app.state.currentUser.user_id);
		var starterUid = parseInt(this.props.starter);
		var playerColor = (uid == starterUid) ? 'blue' : 'red';
		var gameClass = "container mx-auto player-"+playerColor;
		if (this.state.started) {
			if (this.state.turn && this.state.status && this.state.status != 'done') {
				gameClass += ' turn-' + this.state.turn;
			}
		}
		var backendOpts = { backends: [{ backend: HTML5Backend },{ backend: TouchBackend }] };
		return (
			<div className={gameClass}>
				<DndProvider backend={MultiBackend} options={backendOpts}>
					<div className="row no-gutters">
						<div className="col-12 col-sm-8 col-lg-9 col-xl-8 ml-xl-auto px-0 order-2 order-lg-1 scroll">
							<GameBoard game={this} app={app} />
						</div>
						<InfoPanel game={this} app={app} playerColor={playerColor} />
					</div>
					<HelpBar game={this} app={app} />
				</DndProvider>
			</div>
		);
	}
}

export default Game;