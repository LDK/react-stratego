import React, { Component } from 'react';
import TileSpace from '../widgets/TileSpace.js';
import {PIECES} from '../Helpers.js';
import { isMobile } from "react-device-detect";

function PlacementIndicator(props) {
	var { game, tileRack } = props;
	var indicator = '';
	if (game.state.placementMode == 'click' && tileRack.remaining) {
		var placementText = '';
		var placementAction = isMobile ? 'Tap' : 'Click';
		if (game.selectedRank) {
			placementText = (
				<div>{ placementAction + ' a square to place a ' }
					<div className={"d-inline-block position-relative tileFace rank-"+game.selectedRank}></div>
				</div>
			);
		}
		else {
			placementText = placementAction + ' a tile on the rack to select that piece.';
		}
		indicator = (
			<div className="d-table d-lg-none position-fixed w-100" style={{ height:'56px', backgroundColor: 'rgba(1, 1, 1, 0.75)', bottom: 0, left: 0 }}>
				<span className="d-table-cell w-100 p-0 m-0 text-white text-center" style={{ bottom: 0, left: 0, height:'48px', fontSize:'24px', backgroundColor: 'rgba(1,1,1,.75)', verticalAlign: 'middle' }}>{placementText}</span>
			</div>
		);
	}
	return indicator;
}

class TileRack extends React.Component {
	constructor(props) {
		super(props);
		this.remaining = props.remaining || 40;
		this.spaces = {};
		this.renderTileSpace = this.renderTileSpace.bind(this);
		this.tileSpaces = this.tileSpaces.bind(this);
		this.setReady = this.setReady.bind(this);
		this.resetCounts = this.resetCounts.bind(this);
		this.app = props.app;
		this.app.tileRack = this;
		this.app.tileSpaces = {};
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
	componentDidMount() {
		this.app.tileRack = this;
	}
	renderTileSpace(key) {
		return <TileSpace id={"tileSpace-"+key} rack={this} key={key} rank={key} game={this.props.game} />;
	}
	resetCounts() {
		var app = this.props.app;
		this.remaining = 40;
		this.setState({allPlaced: false});
		for (var rank in PIECES) {
			app.tileSpaces[rank].remaining = PIECES[rank].count;
			app.tileSpaces[rank].setState({remaining: PIECES[rank].count});
		}
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
	componentWillUnmount() {
		this.app.tileRack = null;
		this.app.tileSpaces = {};
	}
	
	render() {
		var readyButton = '';
		var startButton = '';
		var game = this.props.game;
		if (this.app.reportRenders) { console.log('TileRack rendering'); }
		if (!game.state.started) {
			if (!this.remaining && this.state.allPlaced && !game.state.players[this.playerColor].ready) {
				readyButton = (
					<div className="col-12">
						<a className="go-button d-block blue text-white text-center mx-auto my-md-3" tabIndex="-1" onClick={() => this.setReady(true)}>I&apos;m Ready!</a>
					</div>
				);
			}
			else if (!this.remaining && this.state.allPlaced) {
				readyButton = (
					<div className="col-12">
						<a className="go-button d-block red text-white text-center mx-auto my-md-3" tabIndex="-1" onClick={() => this.setReady(false)}>I&apos;m Not Ready!</a>
					</div>
				);
			}
			if (game.state.players.blue.ready && game.state.players.red.ready) {
				startButton = (
					<div className="col-12">
						<a className="go-button d-block text-white text-center mx-auto my-3" tabIndex="-1" onClick={game.startGame}>START GAME</a>
					</div>
				);
			}
		}
		return (
			<div className="container-fluid px-0">
				<div className="tileRack row no-gutters px-3 px-md-0">
					{startButton}
					{readyButton}
					{this.tileSpaces()}
				</div>
				<PlacementIndicator game={game} tileRack={this} />
			</div>
		)
	}
}

export default TileRack;
