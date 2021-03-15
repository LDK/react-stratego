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
			<div id={"gameSpace-"+this.props.id} 
				data-col={this.props.x} 
				data-row={this.props.y} 
				data-territory={this.props.territory}
				className={"gameSpace col " + (this.props.spaceKey || '') + (this.props.passable ? ' passable' : '') + ' ' + this.state.extraClass}
			>
				{this.props.children}
			</div>
		)
	}
}

function DropSpace({ id, x, y, passable, board, game, children, occupied }) {

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
		if (game.state.status == 'done') {
			return;
		}
		dropped.gameSpaceId = id;
		board.placePiece(dropped,id,false);
	}
	const handleHover = function(x,y,territory,item) {
		if (!passable) {

		}
		else if (item.color != territory) {

		}
		else {

		}
	}
	const handleClick = function(event) {
		if (!game || !game.state) {
			return;
		}
		if (!game.state.started && playerColor != territory) {
			return;
		}
		if (!passable) {
			return;
		}
		if (game.state.status == 'done') {
			return;
		}
		if (!game.state.started && game.state.placementMode == 'click') {
			if (typeof children == 'undefined' && board.state.selectedSpace && territory == playerColor) {
				board.swapPieces(board.state.selectedSpace,id);
				board.highlightSpace(null);
				board.selectSpace(null);
				game.resetHelpText();
			}

			var rank = game.selectedRank;
			var tileSpace = game.props.app.tileSpaces[rank];
			if (!rank || !tileSpace) {
				return;
			}

			if (territory == playerColor) {
				var piece = { rank: rank, color: playerColor, tileSpace: tileSpace, gameSpaceId: id };
				board.placePiece(piece, id, false);
			}
		}
		else if (!game.state.started && game.state.placementMode == 'keyboard') {
			board.selectSpace(id);
		}
		else if (game.state.started) {
			if (board.state.selectedSpace) {
				var piece = board.state.spaces[board.state.selectedSpace].props.children;
				var item = { 
					type: 'piece', 
					rank: piece.props.rank || null, 
					game: game, 
					color: piece.props.color, 
					tileSpace: undefined, 
					fromX: piece.props.fromX, 
					fromY: piece.props.fromY, 
					fromId: piece.props.fromId 
				}
				if (isDroppable(x, y, territory, item, game)) {
					item.gameSpaceId = id;
					board.placePiece(item,id,false);
				}
			}
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
		if (!game.state.started) {
			// Before game has started, all spaces are droppable 
			// if they're passable and the player's territory
			return item.color == territory;
		}
		else {
			// Game started situation
			var piece = PIECES[item.rank];
			var validSpaces = board.getValidMoveSpaces(item.fromX,item.fromY,item.color,piece,game);
			var spaceId = xyToId(x,y);
			var droppable = (spaceId && validSpaces.indexOf(spaceId) != -1);
			if (droppable) {
				
			}
			return droppable;
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
		else if (canDrop && game.state.started) {
			spaceClass = 'droppable';
		}
		else {
			spaceClass = 'no-drop';
		}
	}
	var uid = parseInt(game.props.app.state.currentUser.user_id);
	var starterUid = parseInt(game.props.starter);
	var playerColor = (uid == starterUid) ? 'blue' : 'red';
	var selectedClass = '';
	var highlightClass = '';
	var occupiedClass = (typeof occupied != 'undefined' && !!occupiedClass) ? ' occupied' : '';
	
	if (board.state.selectedSpace) {
		var piece = board.state.spaces[board.state.selectedSpace].props.children;
		var item = {};
		if (!!piece) {
			item = { 
				type: 'piece', 
				rank: piece.props.rank || null, 
				game: game, 
				color: piece.props.color, 
				tileSpace: false, 
				fromX: piece.props.fromX, 
				fromY: piece.props.fromY, 
				fromId: piece.props.fromId 
			}
			if (isDroppable(x, y, territory, item, game)) {
				spaceClass = 'droppable';
			}
		}
		// board.render();
	}

	if (board.state.selectedSpace && board.state.selectedSpace == id) {
		selectedClass = ' selectedSpace';
	}
	if (board.state.highlighted && board.state.highlighted == id) {
		highlightClass = ' highlightedSpace';
	}
	var passableClass = passable ? ' passable' : ' not-passable';
	return (
		<div ref={drop} className={"gameSpace-wrapper col px-0 mx-0 "+spaceClass+selectedClass+highlightClass+passableClass+occupiedClass} onClick={handleClick}>
			<GameSpace id={id} x={x} y={y} passable={passable} territory={territory} board={board}>
				{children}
			</GameSpace>
			<div className="gameSpace-overlay"></div>
		</div>
	);
}

export default DropSpace;
