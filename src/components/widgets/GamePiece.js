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
	const isDraggable = function(rank, game, captured) {
		var rv = !!rank;
		if (captured) { 
			rv = false; 
		}
		else if (game && game.state && game.props.app && game.props.app.state) {
			var playerId = game.props.app.state.currentUser.user_id;
			if (game.state.started) {
				var turnColor = game.state.turn;
				var turnId = game.state.players[turnColor].id;
				// Once game starts, piece is draggable only when it's the current user's turn.
				rv = (turnId == playerId);
			}
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
		canDrag: () => isDraggable(props.rank, props.game, props.captured || false),
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
			canDrag: !!monitor.canDrag()
		}),
  });
  return (
    <div
      ref={drag}
      style={{
		  color: props.color || 'black',
        opacity: isDragging ? 0 : 1,
        cursor: canDrag ? 'move' : 'default',
      }}
    >
	  <GamePiece color={props.color} rank={props.rank} placed={props.placed || false} captured={props.captured || false} game={props.game} /> 
    </div>
  );
}

export default DragPiece;
