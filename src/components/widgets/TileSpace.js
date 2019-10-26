import React, { Component } from 'react';
import DragPiece from './GamePiece.js';
import {PIECES} from '../Helpers.js';

class TileSpace extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			highlight: false,
			passable: props.passable || true,
			occupied: props.occupied || false,
			occupant: null,
			remaining: props.count || PIECES[this.props.rank].count
		};
		this.onClick = this.props.onClick || function(){};
		this.empty = this.empty.bind(this);
		this.populate = this.populate.bind(this);
		this.rack = props.rack;
		this.game = props.rack.game;
		this.game.tileSpaces[props.rank] = this;
	}
	populate(items) {
		this.setState({ occupant: items });
	}
	empty() {
		this.setState({ occupant: null });
	}
	render() {
		const { name, rackOrder } = PIECES[this.props.rank];
		var orderClass = rackOrder ? ' order-'+rackOrder : '';
		var unavailable = !this.state.remaining;
		if (unavailable) {
			return (
				<div id={'tileSpace-'+this.props.rank} className={"tileSpace col-6 " + this.props.rank + orderClass + (this.state.highlight ? ' highlight' : '') }>

				</div>
			);
		}
		return (
			<div id={'tileSpace-'+this.props.rank} className={"tileSpace col-6 " + this.props.rank + orderClass + (this.state.highlight ? ' highlight' : '') } onClick={this.onClick}>
				<DragPiece color={this.rack.playerColor} rank={this.props.rank} placed={false} game={this.game} tileSpace={this} />
				<label>x{this.state.remaining}</label>
			</div>
		)
	}
}

export default TileSpace;
