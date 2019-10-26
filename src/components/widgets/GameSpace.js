import React, { Component } from 'react';
import GamePiece from './GamePiece.js';
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

function DropSpace({ id, x, y, passable, board, children }) {

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
	const isDroppable = function(x,y,territory,item) {
		return (item && passable && item.color == territory);
	}
	const territory = y < 5 ? 'red' : (y > 6 ? 'blue' : 'neutral');
	const [{ dropped, isOver, canDrop }, drop] = useDrop({
		accept: 'piece',
		drop: () => handleDrop(x, y, territory, dropped),
		hover: () => handleHover(x, y, territory, dropped),
		canDrop: () => isDroppable(x, y, territory, dropped),
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
