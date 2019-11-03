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
		return <TileSpace id={"tileSpace-"+key} rack={this} key={key} rank={key} />;
	}
	tileSpaces() {
		var spaces = [];
		for (var rank in PIECES) {
			spaces.push(this.renderTileSpace(rank));
		}
		this.spaces = spaces;
		return spaces;
	}
	setReady() {
		var app = this.app;
		var game = this.props.game;
		var players = game.state.players;
		players[this.playerColor].ready = true;
		game.setState({players: players});
		app.saveActiveGame();
	}
	render() {
		var startButton = '';
		var game = this.props.game;
		if (!this.remaining && this.state.allPlaced && !game.state.players[this.playerColor].ready) {
			startButton = (
					<div className="col-12">
				<a className="button mx-auto my-3" tabIndex="-1" onClick={this.setReady}>Ready to Start</a>
					</div>
			);
		}
		return (
			<div className="tileRack row no-gutters">
				{startButton}
				{this.tileSpaces()}
			</div>
		)
	}
}

export default TileRack;
