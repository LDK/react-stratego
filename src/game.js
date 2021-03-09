import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import GameBoard from './components/sections/GameBoard.js';
import TileRack from './components/sections/TileRack.js';
import GamePiece from './components/widgets/GamePiece.js';
import UserLink from './components/widgets/UserLink.js';
import OptionIndicator from './components/widgets/OptionIndicator.js';
import ReactTooltip from 'react-tooltip';
import HTML5Backend from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd';
import { useDrag } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import { isMobile } from "react-device-detect";

function HelpBar(props) {
	var { app, game } = props;
	var tileRack = app.tileRack;
	var board = app.gameBoard;
	var indicator = '';
	var placementText = false;
	var placementSubtext = '';
	if (game.state.placementMode == 'click' && !!board.state.selectedSpace) {
		placementText = 'Click any space to move the selected tile there.';
		placementSubtext = 'Click the rack to remove this tile from the board.';
	}
	else if (game.state.placementMode == 'click' && tileRack.remaining) {
		var placementAction = isMobile ? 'Tap' : 'Click';
		if (game.selectedRank) {
			placementText = (
				<div>{ placementAction + ' a square to place a ' }
					<div className={"d-inline-block position-relative tileFace rank-"+game.selectedRank}></div>
				</div>
			);
		}
		else {
			placementText = placementAction + ' any ' + app.tileRack.playerColor + ' tile to select that piece.';
		}
	}
	if (placementText) {
		indicator = (
			<div className="d-table d-lg-none position-fixed w-100" id="help-bar" style={{ height:'56px', backgroundColor: 'rgba(1, 1, 1, 0.75)', bottom: 0, left: 0 }}>
				<span className="d-table-cell w-100 p-0 m-0 text-white text-center" style={{ bottom: 0, left: 0, height:'48px', fontSize:'24px', backgroundColor: 'rgba(1,1,1,.75)', verticalAlign: 'middle' }}>{placementText}</span>
			</div>
		);
	}
	return indicator;
}

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
				if (last_move && (app.tileRack.playerColor != last_move.color) && (!game.state.last_move || (last_move.ts != game.state.last_move.ts))) {
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
		var gameBoard = <GameBoard game={this} app={app} />;
		var rightPanel;
		var gameClass = "container mx-auto";
		var uid = parseInt(app.state.currentUser.user_id);
		var starterUid = parseInt(this.props.starter);
		var playerColor = (uid == starterUid) ? 'blue' : 'red';
		var playerColorClass;
		if (playerColor) {
			playerColorClass = ' player-'+playerColor;
		}
		gameClass += playerColorClass;
		if (!this.state.started) {
			rightPanel = (
				<div className="col-12 col-lg-3 px-0 tileRack-col order-3 order-lg-2 bg-md-white mt-lg-3 mr-xl-auto">
					<div className="row no-gutters pt-1 pt-md-3">
						<OptionIndicator id="placementMode" className="col-12 px-0 lg-up mb-3" layout="horizontal" 
							value={this.state.placementMode}
							disableArrows={true}
							ulClass="text-center px-0 mt-3"
							liClass="col-4 col-md-6 px-0 mx-2 pt-3 mx-auto"
							disabled={this.state.players[playerColor].ready}
							labelClass="px-2 px-md-3"
							listLabelClass="pb-2"
							options={[
								// {key: 'Drag & Drop', value: 'drag', className: 'lg-up', tooltip: 'Drag & drop tiles from the rack to the board'},
								{key: 'Tap & Place', value: 'click', className: 'md-down', tooltip: 'Tap the tile on the rack you want to place, then tap the space(s) where you want to place it'},
								{key: 'Click & Place', value: 'click', className: 'lg-up', tooltip: 'Click the tile on the rack you want to place, then click the space(s) where you want to place it'},
								{key: 'Keyboard', value: 'keyboard', className: 'lg-up', tooltip: 'Use the arrow keys to select a square and place tiles by typing the rank'},
								{key: 'Quick Load', value: 'quick', tooltip: 'Choose from a list of preset tile layouts', onSelect: this.openQuickLoadModal},
								{key: 'Erase', value: 'erase', tooltip: 'Click to remove tiles you have placed' }
							]} 
							name="placementMode" label="Placement Mode"
							callback={this.modeChange} 
						/>
						<div className="col-12 mx-auto">
							<TileRack game={this} app={app} />
						</div>
					</div>
				</div>
			);
		}
		else {
			var turnLabel, winLabel;
			var turnClass;
			if (this.state.turn && this.state.status && this.state.status != 'done') {
				turnLabel = (<h6 className="text-center mx-auto my-3">Current Turn: <br className="sm-down" /><span className={"text-"+this.state.turn}>{this.state.players[this.state.turn].name}</span></h6>);
				turnClass = ' turn-'+this.state.turn;
			}
			else if (this.state.status && this.state.status == 'done') {
				var winnerName, winnerClass;
				if (this.state.winner_uid == starterUid) {
					winnerName = this.props.starterName;
					winnerClass = 'text-blue';
				}
				else {
					winnerName = this.props.opponentName;
					winnerClass = 'text-red';
				}
				var winnerInfo = { name: winnerName, id: this.state.winner_uid};
				var winnerLink = (<UserLink app={app} user={winnerInfo} className={"anchor "+winnerClass} />);
				winLabel = (<h5 className="text-center mx-auto mt-4">{winnerLink} is the winner!</h5>);
			}
			var captured = { red: [], blue: [] };
			for (var color in this.state.captured) {
				for (var rank in this.state.captured[color]) {
					captured[color].push(this.state.captured[color][rank]);
				}
			}
			gameClass += turnClass+playerColorClass;
			rightPanel = (
				<div className="sm-up col-4 col-lg-3 px-0 gameStatus-col bg-md-white text-center order-1 order-lg-2 mt-lg-3 mr-xl-auto">
					<div className="row no-gutters">
						{winLabel}
						{turnLabel}
						<h4 className="mx-auto d-block my-3 col-12">Captured</h4>
						<div className="col-6 px-3">
							<span className="text-red">
								<UserLink app={app} user={this.state.players.red} className="anchor" />
							</span>
							<div className="captured-tiles player-red mt-3">
								{captured.red.length ? captured.red : 'None'}
							</div>
						</div>
						<div className="col-6 px-3">
							<span className="text-blue">
								<UserLink app={app} user={this.state.players.blue} className="anchor" />
							</span>
							<div className="captured-tiles player-blue mt-3">
								{captured.blue.length ? captured.blue : 'None'}
							</div>
						</div>
					</div>
					<div className="d-none">
						<TileRack game={this} app={app} />
					</div>
				</div>
			);
		}
		var backendOpts = { backends: [{ backend: HTML5Backend },{ backend: TouchBackend }] };
		return (
			<div className={gameClass}>
				<DndProvider backend={MultiBackend} options={backendOpts}>
					<div className="row no-gutters">
						<div className="col-12 col-sm-8 col-lg-9 col-xl-8 ml-xl-auto px-0 order-2 order-lg-1 scroll">
							{gameBoard}
						</div>
						{rightPanel}
					</div>
						<HelpBar game={this} app={app} />
				</DndProvider>
			</div>
		);
	}
}

export default Game;