import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import GameBoard from './components/sections/GameBoard.js';
import TileRack from './components/sections/TileRack.js';
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
				blue: { id: props.starter, ready: props.starterReady || false },
				red: { id: props.opponent || null, ready: props.opponentReady || false }
			},
			captured: {
				
			},
			started: !!props.started,
			status: props.status || 'pending'
		};
		this.startGame = this.startGame.bind(this);
	}
	startGame() {
		var app = this.props.app;
		this.setState({ started: true });
		app.gameStates[this.props.id].started = true;
		app.saveActiveGame();
	}
	render() {
		var app = this.props.app;
		if (this.props.id) {
			app.gameStates[this.props.id] = this.state;
		}
		var gameBoard = <GameBoard game={this} app={app} />;
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
}

export default Game;