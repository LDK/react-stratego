import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import GameBoard from './components/sections/GameBoard.js';
import TileRack from './components/sections/TileRack.js';
import GamePiece from './components/widgets/GamePiece.js';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDrag } from 'react-dnd';

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
			started: !!props.started,
			status: props.status || 'pending',
			attacks: props.attacks || 0,
			last_attack: props.last_attack || {}
		};
		// this.state.captured.blue.push(<GamePiece color={'blue'} rank={'3'} captured={true} game={this} key={1} />);
		// this.state.captured.blue.push(<GamePiece color={'blue'} rank={'4'} captured={true} game={this} key={2} />);
		// this.state.captured.red.push(<GamePiece color={'red'} rank={'3'} captured={true} game={this} key={3} />);
		// this.state.captured.red.push(<GamePiece color={'red'} rank={'4'} captured={true} game={this} key={4} />);
		// this.state.captured.red.push(<GamePiece color={'red'} rank={'S'} captured={true} game={this} key={5} />);
		// this.state.captured.red.push(<GamePiece color={'red'} rank={'9'} captured={true} game={this} key={5} />);
		// this.state.captured.red.push(<GamePiece color={'red'} rank={'9'} captured={true} game={this} key={5} />);
		this.startGame = this.startGame.bind(this);
		this.addCaptured = this.addCaptured.bind(this);
		this.clearCaptured = this.clearCaptured.bind(this);
		if (props.captured) {
			for (var i in props.captured) {
				var pieceId = props.captured[i];
				var pieceColor = pieceId.split('-')[0];
				var pieceRank = pieceId.split('-')[1];
				this.addCaptured({color: pieceColor, rank: pieceRank });
			}
		}
		props.app.gameRef = this;
	}
	clearCaptured() {
		this.state.captured = { blue: {}, red: {} };
	}
	addCaptured(pieceInfo) {
		var captured = this.state.captured;
		var pieceCount = 1;
		if (captured[pieceInfo.color][pieceInfo.rank]) {
			pieceCount = captured[pieceInfo.color][pieceInfo.rank].props.count + 1;
		}
		captured[pieceInfo.color][pieceInfo.rank] = <GamePiece color={pieceInfo.color} rank={pieceInfo.rank} captured={true} game={this} count={pieceCount} key={pieceInfo.color+'-'+pieceInfo.rank} />
		this.setState({ captured: captured });
		// this.state.captured = captured;
		// captured[pieceInfo.color].push(<GamePiece color={pieceInfo.color} rank={pieceInfo.rank} captured={true} game={this} />)
	}
	startGame() {
		var app = this.props.app;
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
	render() {
		var app = this.props.app;
		if (this.props.id) {
			app.gameStates[this.props.id] = this.state;
		}
		var gameBoard = <GameBoard game={this} app={app} />;
		var rightPanel;
		var gameClass = "container-fluid mx-auto game-bg";
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
				<div className="col-12 col-md-4 col-lg-3 pr-0 tileRack-col">
					<TileRack game={this} app={app} />
				</div>
			);
		}
		else {
			var turnLabel;
			var turnClass;
			if (this.state.turn) {
				turnLabel = (<h6>Current Turn: {this.state.players[this.state.turn].name} </h6>);
				turnClass = ' turn-'+this.state.turn;
			}
			var captured = { red: [], blue: [] };
			for (var color in this.state.captured) {
				for (var rank in this.state.captured[color]) {
					captured[color].push(this.state.captured[color][rank]);
				}
			}
			gameClass += turnClass+playerColorClass;
			rightPanel = (
				<div className="col-12 col-md-4 col-lg-3 pr-0 gameStatus-col text-center">
					<h4 className="mx-auto d-block">Captured</h4>
					<div className="row">
						<div className="col-12 col-md-6">
							<span className="text-red">
								{this.state.players.red.name}
							</span>
							<div className="captured-tiles player-red">
								{captured.red.length ? captured.red : 'None'}
							</div>
						</div>
						<div className="col-12 col-md-6">
							<span className="text-blue">
								{this.state.players.blue.name}
							</span>
							<div className="captured-tiles player-blue">
								{captured.blue.length ? captured.blue : 'None'}
							</div>
						</div>
						{turnLabel}
					</div>
					<div className="d-none">
						<TileRack game={this} app={app} />
					</div>
				</div>
			);
		}
		return (
			<div className={gameClass}>
				<DndProvider backend={HTML5Backend}>
					<div className="row">
						<div className="col-12 col-md-8 col-lg-9 pr-0">
							{gameBoard}
						</div>
						{rightPanel}
					</div>
				</DndProvider>
			</div>
		);
	}
}

export default Game;