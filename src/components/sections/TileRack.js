import React, { Component } from 'react';
import TileSpace from '../widgets/TileSpace.js';
import {PIECES} from '../Helpers.js';

class TileRack extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.spaces = {};
		this.renderTileSpace = this.renderTileSpace.bind(this);
		this.tileSpaces = this.tileSpaces.bind(this);		
		this.game = props.game;
		this.game.tileSpaces = {};
		this.playerColor = 'red';
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
	render() {
		var game = this.props.game;
		var app = game.app;
		return (
			<div className="tileRack row no-gutters">
				{this.tileSpaces()}
			</div>
		)
	}
}

export default TileRack;
