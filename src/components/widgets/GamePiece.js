import React, { Component } from 'react';
import {PIECES} from '../Helpers.js';
import { useDrag } from 'react-dnd';

class GamePiece extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			captured: props.captured || false,
			placed: props.placed || false,
		};
		if (props.rank) {
			const { name, rackOrder, move, capture, defuse } = PIECES[props.rank];
			this.name = name;
			this.rackOrder = rackOrder;
			this.move = move;
			this.capture = capture || null;
			this.defuse = defuse || false;
		}
	}
	render() {
		var divClass = "gamePiece text-center " + (this.props.className || '');
		var wrapperClass = "gamePiece-wrapper " + (this.props.wrapperClass || '');
		wrapperClass = wrapperClass.trim();
		divClass = divClass.trim();
		var tileFace = '';
		if (this.props.rank) {
			tileFace = <div className={"tileFace rank-"+this.props.rank}></div>;
		}
		else {
			wrapperClass += ' no-drag';
		}
		return (
			<div className={wrapperClass}>
				<div className={divClass + " " + this.props.color}>
					{tileFace}
				</div>
			</div>
		)
	}
}

function DragPiece(props) {
	const isDraggable = function(rank, game, move, captured) {
		if (!game || !game.state || !game.props.app || !game.props.app.state) {
			// App isn't ready or something is very wrong.
			return false;
		}
		// Opponent tiles won't have a rank
		if (!rank) {
			return false;
		}
		// Can't drag a captured piece.
		if (captured) { 
			return false;
		}
		// There has to be a user or else who's doing the dragging?
		if (!game.props.app.state.currentUser || !game.props.app.state.currentUser.user_id) {
			return false;
		}
		// rv = return value
		// Start by assuming that if we have a rank, the piece is draggable.
		var rv = true;
		var playerId = game.props.app.state.currentUser.user_id;
		// Game Started situation
		if (game.state.started) {
			// If the piece is immovable, it's not draggable.
			if (!PIECES[rank].move) {
				return false;
			}
			// Once game starts, piece is draggable only when it's the current user's turn.
			var turnColor = game.state.turn;
			var turnId = game.state.players[turnColor].id;
			rv = (turnId == playerId);
		}
		return rv;
	}
	const [{isDragging, canDrag}, drag] = useDrag({
		item: { 
			type: 'piece', 
			rank: props.rank || null, 
			game: props.game, 
			color: props.color, 
			tileSpace: props.tileSpace, 
			fromX: props.fromX, 
			fromY: props.fromY, 
			fromId: props.fromId 
		},
		canDrag: () => isDraggable(props.rank, props.game, props.move, props.captured || false),
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
			canDrag: !!monitor.canDrag()
		}),
	});
	var styles = {
		color: props.color || 'black',
		opacity: isDragging ? 0 : 1,
	};
	if (canDrag) {
		styles['cursor'] = 'move';
	}
	var piece = false;
	if (props.rank) {
		piece = PIECES[props.rank]
	}
	if (piece && !piece.move) {
		styles['cursor'] = 'not-allowed';
	}
	var wrapperClass = '';
	if (props.color) {
		wrapperClass = 'piece-'+props.color;
	}
	return (
		<div
			ref={drag}
			style={styles}
			className={wrapperClass}
		>
			<GamePiece color={props.color} rank={props.rank} placed={props.placed || false} captured={props.captured || false} game={props.game} /> 
		</div>
  );
}

export default DragPiece;
