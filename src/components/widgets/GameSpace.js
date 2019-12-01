import React, { Component } from 'react';
import GamePiece from './GamePiece.js';
import { PIECES } from '../Helpers.js';
import { xyToId } from '../Helpers.js';
import { DropTarget } from 'react-dnd'
import { useDrop } from 'react-dnd';

class GameSpace extends React.Component {
	constructor(props) {
		super(props);
		this.passable = this.props.passable || true;
		this.x = props.x;
		this.y = props.y;
		this.state = {
			extraClass: ''
		};
	}
	render() {
		return (
			<div id={this.props.id} 
				data-col={this.props.col} 
				data-row={this.props.row} 
				data-territory={this.territory}
				className={"gameSpace col " + this.props.spaceKey + (this.passable ? ' passable' : '') + ' ' + this.state.extraClass} 
			>
				{this.props.children}
				{this.props.passable ? '' : 'X'}
			</div>
		)
	}
}

function DropSpace({ id, x, y, passable, board, game, children }) {

	const handleDrop = function(x,y,territory,dropped) {
		if (!passable || dropped.color != territory) {

		}
		else {
			board.placePiece(dropped,id);
		}
	}
	const handleHover = function(x,y,territory,item) {
		if (!passable) {

		}
		else if (item.color != territory) {

		}
		else {

		}
	}
	const isDroppable = function(x,y,territory,item,game) {
		// var pieceInfo = PIECES[item.rank];
		if (!item || !game || !game.state) {
			return false;
		}
		if (!passable) {
			return false;
		}
		// Allow the non-move
		if (x == item.fromX && y == item.fromY) {
			return true;
		}
		if (!game.state.started) {
			// Before game has started, all spaces are droppable 
			// if they're passable and the player's territory
			return item.color == territory;
		}
		else {
			// No diagonal moves
			if (x != item.fromX && y != item.fromY) {
				return false;
			}
			if (children) {
				// If space is occupied by a piece of the same color, the piece can't be dropped there.
				if (item.color == children.props.color) {
					return false;
				}
				else {
					// Battle!!
				}
			}
			// Game started situation
			var piece = PIECES[item.rank];
			var xDist = Math.abs(x-item.fromX);
			console.log(x,item.fromX,xDist);
			var yDist = Math.abs(y-item.fromY);
			// You can only move as far as the piece's stats allow
			if (xDist > piece.move || yDist > piece.move) {
				return false;
			}
			if (piece.move > 1) {
				var xMove = x-item.fromX;
				var yMove = y-item.fromY;
				var moveDist = (xDist > yDist) ? xMove : yMove;
				var nextVal = (moveDist > 0) ? function(n) { return n+1; } : function(n) { return n-1; };
				var oppFound = false;
				for (var i = 1;  i != nextVal(moveDist); i = nextVal(i)) {
					if (oppFound) {
						return false;
					}
					// if the space this distance in the move direction is occupied or passable, 
					// nothing beyond it is droppable, so return false;
					if (xDist > yDist) {
						var spaceInfo = game.props.app.gameBoard.state.spaces[xyToId(item.fromX+i,item.fromY)].props;
					}
					else {
						var spaceInfo = game.props.app.gameBoard.state.spaces[xyToId(item.fromX,item.fromY+i)].props;
					}
					if (!spaceInfo.passable) {
						return false;
					}
					if (spaceInfo.children) {
						if (spaceInfo.children.props.color == item.color) {
							return false;
						}
						else {
							oppFound = true;
						}
					}
				}
			}
			// console.log(x,y,item.fromX,item.fromY);
			return true;
		}
	}
	const territory = y < 5 ? 'red' : (y > 6 ? 'blue' : 'neutral');
	const [{ dropped, isOver, canDrop }, drop] = useDrop({
		accept: 'piece',
		drop: () => handleDrop(x, y, territory, dropped),
		hover: () => handleHover(x, y, territory, dropped),
		canDrop: () => isDroppable(x, y, territory, dropped, game),
		collect: monitor => ({
			dropped: monitor.getItem(),
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop()
		}),
	})
	var spaceClass = '';
	if (!!dropped) {
		if (canDrop && isOver) {
			spaceClass = 'drop-target';
		}
		else if (canDrop) {
			spaceClass = 'droppable';
		}
		else {
			spaceClass = 'no-drop';
		}
	}
	return (
		<div ref={drop} className={"gameSpace-wrapper col "+spaceClass}>
			<div className="gameSpace-overlay"></div>
			<GameSpace id={id} x={x} y={y} passable={passable} territory={territory} board={board}>
				{children}
			</GameSpace>
		</div>
	);
}

export default DropSpace;
