import React, { Component } from 'react';
import TileSpace from '../widgets/TileSpace.js';
import {PIECES} from '../Helpers.js';

class TileRack extends React.Component {
	constructor(props) {
		super(props);
		this.remaining = props.remaining || 40;
		this.spaces = {};
		this.renderTileSpace = this.renderTileSpace.bind(this);
		this.tileSpaces = this.tileSpaces.bind(this);		
		this.setReady = this.setReady.bind(this);		
		this.app = props.app;
		this.app.tileSpaces = {};
		this.app.tileRack = this;
		this.state = { 
			allPlaced: false
		};
		if (this.app.state.currentUser.user_id == this.app.state.activeGame.props.starter) {
			this.playerColor = 'blue';
		}
		else {
			this.playerColor = 'red';
		}
	}
	renderTileSpace(key) {
		return <TileSpace id={"tileSpace-"+key} rack={this} key={key} rank={key} game={this.props.game} />;
	}
	tileSpaces() {
		var spaces = [];
		for (var rank in PIECES) {
			spaces.push(this.renderTileSpace(rank));
		}
		this.spaces = spaces;
		return spaces;
	}
	setReady(isReady) {
		var app = this.app;
		var game = this.props.game;
		var players = game.state.players;
		players[this.playerColor].ready = isReady;
		var oppColor = (this.playerColor == 'red') ? 'blue' : 'red';
		game.setState({players: players});
		app.saveActiveGame();
	}
	render() {
		var readyButton = '';
		var startButton = '';
		var game = this.props.game;
		if (!game.state.started) {
			if (!this.remaining && this.state.allPlaced && !game.state.players[this.playerColor].ready) {
				readyButton = (
						<div className="col-12">
					<a className="button mx-auto my-3" tabIndex="-1" onClick={() => this.setReady(true)}>Ready to Start</a>
						</div>
				);
			}
			else if (!this.remaining && this.state.allPlaced) {
				readyButton = (
						<div className="col-12">
					<a className="button mx-auto my-3" tabIndex="-1" onClick={() => this.setReady(false)}>Not Ready</a>
						</div>
				);
			}
			if (game.state.players.blue.ready && game.state.players.red.ready) {
				startButton = (
						<div className="col-12">
					<a className="button mx-auto my-3" tabIndex="-1" onClick={game.startGame}>Start Game</a>
						</div>
				);
			}
		}
		return (
			<div className="container-fluid px-0">
				<div className="tileRack row no-gutters pl-5 pr-3 pl-md-3 pr-md-0">
					{startButton}
					{readyButton}
					{this.tileSpaces()}
				</div>
			</div>
		)
	}
}

export default TileRack;
