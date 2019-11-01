import React, { Component } from 'react';
import DropSpace from '../widgets/GameSpace.js';
import DragPiece from '../widgets/GamePiece.js';
import cloneDeep from 'lodash/cloneDeep';

class GameBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spaces: {}
		};
		this.obscuredSpaces = { 43: true, 44: true, 47: true, 48: true, 53: true, 54: true, 57: true, 58: true };
		this.renderGameSpace = this.renderGameSpace.bind(this);
		this.gameSpaceRow = this.gameSpaceRow.bind(this);
		this.gameSpaceRows = this.gameSpaceRows.bind(this);
		this.placePiece = this.placePiece.bind(this);
		this.props.app.gameBoard = this;
	}
	renderGameSpace(row,col,key,piece) {
		var occupied = (piece !== undefined);
		return <DropSpace id={key} board={this} y={row} x={col} occupied={occupied} key={key} passable={!(this.obscuredSpaces[key] || false)} game={this.props.game}>
				{piece}
			</DropSpace>;
	}
	placePiece(pieceInfo,id,loading) {
		var spaces = this.state.spaces;
		var app = this.props.app;
		var { x, y, territory } = spaces[id].props;
		var { rank, color, tileSpace } = pieceInfo;
		if (pieceInfo.fromId) {
			if(!this.props.game.state.started) {
				if (!spaces[id].props.occupied) {
					// Render the target space with the piece in it, and empty the source space.
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId);
				}
				else {
					// Swap the pieces
					var occupantInfo = spaces[id].props.children.props;
					var fromPiece =  (<DragPiece color={pieceInfo.color} rank={pieceInfo.rank} fromX={x} fromY={y} fromId={id} placed={true} />);
					var toPiece =  (<DragPiece color={occupantInfo.color} rank={occupantInfo.rank} fromX={pieceInfo.fromX} fromY={pieceInfo.fromY} fromId={pieceInfo.fromId} placed={true} />);
					spaces[id] = this.renderGameSpace(y,x,id,fromPiece);
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId,toPiece);
					this.setState({spaces: spaces});
					app.saveActiveGame();
					return;
				}
			}
		}
		if (tileSpace) {
			var {remaining} = tileSpace.state;
			if (!remaining) {
				return;
			}
			if (spaces[id].props.occupied) {
				var occupantInfo = spaces[id].props.children.props;
				if (occupantInfo.color == color && occupantInfo.rank == rank) {
					return;
				}
				else if (occupantInfo.color == color) {
					var occRemaining = this.props.app.tileSpaces[occupantInfo.rank].state.remaining;
					occRemaining++;
					this.props.app.tileSpaces[occupantInfo.rank].setState({ remaining: occRemaining });
				}
			}
			remaining--;
			tileSpace.setState({ remaining: remaining });
		}
		spaces[id] = this.renderGameSpace(y,x,id,<DragPiece color={color} fromX={x} fromY={y} fromId={id} rank={rank} placed={true} game={this.props.game} />);
		this.setState({spaces: spaces});
		if (!loading) {
			app.saveActiveGame();
		}
	}
	gameSpaceRow(row,start,end,colSize) {
		var offset = (row - 1) * (colSize || 10);
		var gameSpaces = [];
		for (var i = start; i <= end; i++) {
			var newSpace = null;
			if (!this.state.spaces[offset+i]) {
				newSpace = this.renderGameSpace(row,i,offset+i);
				this.state.spaces[offset+i] = newSpace;
			}
			else {
				newSpace = this.state.spaces[offset+i];
			}
			gameSpaces.push(newSpace);
		}
		return (
			<div className="row" key={row}>
				{gameSpaces}
			</div>
		);
	}
	gameSpaceRows(start,end,cols) {
		var rows = [];
		for (var i = start; i <= end; i++) {
			rows.push(this.gameSpaceRow(i,1,10,10));
		}
		return rows;
	}
	render() {
		// console.log('render board',this.state.spaces);
		var game = this.props.game;
		var app = game.app;
		return (
			<div className="gameBoard">
				{this.gameSpaceRows(1,10,10)}
			</div>
		)
	}
}

export default GameBoard;
