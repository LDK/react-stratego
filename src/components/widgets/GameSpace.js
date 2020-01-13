import React, { Component } from 'react';
import GamePiece from './GamePiece.js';
import { PIECES } from '../Helpers.js';
import { xyToId } from '../Helpers.js';
import { getSpaceId } from '../Helpers.js';
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
		if (!game || !game.state) {
			return;
		}
		if (!game.state.started && dropped.color != territory) {
			return;
		}
		if (!passable) {
			return;
		}
		board.placePiece(dropped,id);
	}
	const handleHover = function(x,y,territory,item) {
		if (!passable) {

		}
		else if (item.color != territory) {

		}
		else {

		}
	}
	const getValidMoveSpaces = function(x, y, item, piece, game) {
		// For each direction on the board, we'll see how far this piece can go in each direction with valid game moves.
		var directions = ['east','west','south','north'];
		var blockHit, oppFound;
		var validSpaces = [xyToId(x,y)];
		for (var di in directions) {
			var dir = directions[di];
			blockHit = false;
			oppFound = false;
			var i = 1;
			while (i <= piece.move && !blockHit) {
				// We've gone as far as we can go, so nothing beyond this point in this direction should be added
				if (oppFound) { blockHit = true; continue; }
				// Otherwise, grab next space in this direction
				var spaceId = getSpaceId(x, y, i, dir);
				// If there's not a space in that direction, we've hit the edge of the board, so a block.
				if (!spaceId) {
					blockHit = true;
					continue;
				}
				var spaceInfo = game.props.app.gameBoard.state.spaces[spaceId].props;
				// If this space isn't passable, we've hit a block.
				if (!spaceInfo.passable) { blockHit = true; }
				if (spaceInfo.children) {
					// If player's one piece is in this space, we've hit a block.
					if (spaceInfo.children.props.color == item.color) {
						blockHit = true;
						continue;
					}
					// If an opponent is there, we haven't hit a block, but we've found an opponent.
					// We will add this space to the list of valid spaces, but nothing beyond it.
					else {
						oppFound = true;
					}
				}
				
				// No blocks!  Add it to the list.
				if (!blockHit) {
					validSpaces.push(spaceId);
				}
				i++;
			}
		}
		return validSpaces;
	}
	const isDroppable = function(x,y,territory,item,game) {
		// var pieceInfo = PIECES[item.rank];
		if (!item || !game || !game.state) {
			return false;
		}
		if (!passable) {
			return false;
		}
		if (!game.state.started) {
			// Before game has started, all spaces are droppable 
			// if they're passable and the player's territory
			return item.color == territory;
		}
		else {
			// Game started situation
			var piece = PIECES[item.rank];
			var validSpaces = getValidMoveSpaces(item.fromX,item.fromY,item,piece,game);
			var spaceId = xyToId(x,y);
			return (spaceId && validSpaces.indexOf(spaceId) != -1);
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
		<div ref={drop} className={"gameSpace-wrapper col px-0 mx-0 "+spaceClass}>
			<div className="gameSpace-overlay"></div>
			<GameSpace id={id} x={x} y={y} passable={passable} territory={territory} board={board}>
				{children}
			</GameSpace>
		</div>
	);
}

export default DropSpace;
