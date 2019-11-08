import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import GameBoard from './components/sections/GameBoard.js';
import TileRack from './components/sections/TileRack.js';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import {PIECES} from './components/Helpers.js';

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

export default Game;