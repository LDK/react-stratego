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
		this.emptySpace = this.emptySpace.bind(this);
		this.props.app.gameBoard = this;
	}
	componentDidMount() {
		var app = this.props.app;
		var game = this.props.game;
		var spaces = this.props.game.props.spaces;
		var uid = app.state.currentUser.user_id;

		if (app.tileRack) {
			if (game.props.starter == uid) {
				app.tileRack.playerColor = 'blue';
			}
			else {
				app.tileRack.playerColor = 'red';
			}
		}
		if (spaces && spaces.length && app.tileSpaces) {
			for (var i in spaces) {
				var space = spaces[i];
				var targetSpace = null;
				if (space.rank && app.tileSpaces[space.rank]) {
					targetSpace = app.tileSpaces[space.rank];
				}
				this.placePiece({ rank: space.rank, color: space.color, tileSpace: targetSpace }, space.id, true);
				if (targetSpace) {
					targetSpace.setState({ remaining: targetSpace.remaining });
				}
			}
		}
	}
	renderGameSpace(row,col,key,piece) {
		var occupied = (piece !== undefined);
		return <DropSpace id={key} board={this} y={row} x={col} occupied={occupied} key={key} passable={!(this.obscuredSpaces[key] || false)} game={this.props.game}>
				{piece}
			</DropSpace>;
	}
	emptySpace(id) {
		var spaces = this.state.spaces;
		var app = this.props.app;
		var playerColor = app.tileRack.playerColor;
		var space = spaces[id];
		var newSpace = this.renderGameSpace(space.props.y,space.props.x,id);
		spaces[id] = newSpace;
		this.setState({ spaces: spaces });
		return newSpace;
	}
	placePiece(pieceInfo,id,loading) {
		var spaces = this.state.spaces;
		var app = this.props.app;
		var playerColor = app.tileRack.playerColor;
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
			if (!tileSpace.remaining) {
				return;
			}
			if (spaces[id].props.occupied) {
				var occupantInfo = spaces[id].props.children.props;
				if (occupantInfo.color == color && occupantInfo.rank == rank) {
					return;
				}
				else if (occupantInfo.color == color) {
					this.props.app.tileSpaces[occupantInfo.rank].remaining++;
				}
			}
			if (color == playerColor) 
			{
				tileSpace.remaining--;
				app.tileRack.remaining--;
				if (!app.tileRack.remaining) {
					app.tileRack.setState({ allPlaced: true });
				}
			}
			tileSpace.setState({ remaining: tileSpace.remaining });
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
