import React from 'react';
import DragPiece from './DragPiece.js';
import PropTypes from 'prop-types';

class TileSpace extends React.Component {
	static get propTypes() {
		return {
			rack: PropTypes.object,
			game: PropTypes.object,
			count: PropTypes.number,
			passable: PropTypes.bool,
			occupied: PropTypes.bool,
			onClick: PropTypes.func,
			name: PropTypes.string,
			rank: PropTypes.any
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			highlight: false,
			passable: props.passable || true,
			occupied: props.occupied || false,
			occupant: null,
		};
		this.remaining = props.count || props.game.props.app.Config.Pieces[this.props.rank].count;
		this.state.remaining = this.remaining;
		this.onClick = this.props.onClick || function(){};
		this.empty = this.empty.bind(this);
		this.populate = this.populate.bind(this);
		this.rack = props.rack;
		this.app = props.rack.app;
		this.app.tileSpaces[props.rank] = this;
	}
	populate(items) {
		this.setState({ occupant: items });
	}
	empty() {
		this.setState({ occupant: null });
	}
	render() {
		const { rackOrder } = this.props.game.props.app.Config.Pieces[this.props.rank];
		var orderClass = rackOrder ? ' order-'+rackOrder : '';
		var unavailable = !this.remaining;
		var selectedClass = (this.props.game.selectedRank && this.props.game.selectedRank == this.props.rank) ? ' selected-rank' : '';
		if (unavailable) {
			return (
				<div id={'tileSpace-'+this.props.rank} className={"tileSpace col-2 col-sm-1 col-md-4 col-lg-4 " + this.props.rank + orderClass + (this.state.highlight ? ' highlight' : '') }>

				</div>
			);
		}
		return (
			<div id={'tileSpace-'+this.props.rank} className={"tileSpace col-2 col-sm-1 col-md-4 col-lg-4 " + this.props.rank + orderClass + selectedClass + (this.state.highlight ? ' highlight' : '') } onClick={this.onClick}>
				<DragPiece color={this.rack.playerColor} rank={this.props.rank} placed={false} game={this.props.game} tileSpace={this} />
				<label>x{this.state.remaining}</label>
			</div>
		)
	}
}

export default TileSpace;
