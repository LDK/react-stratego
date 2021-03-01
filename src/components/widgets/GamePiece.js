import React, { Component } from 'react';
import {PIECES} from '../Helpers.js';
import { useDrag } from 'react-dnd';
import { CSSTransition } from 'react-transition-group';
import { isMobile } from "react-device-detect";

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
		this.pieceClicked = this.pieceClicked.bind(this);
	}
	pieceClicked() {
		var game = this.props.game;
		var app = game.props.app;
		var gb = app.gameBoard;
		if (this.props.placed && this.props.gameSpaceId && game && game.state.placementMode == 'click' && !game.selectedRank && !game.state.started) {
			if (!gb.state.selectedSpace) {
				gb.selectSpace(this.props.gameSpaceId);
				gb.highlightSpace(this.props.gameSpaceId);
			}
			else {
				var y = Math.ceil(parseInt(this.props.gameSpaceId) / 10);
				var x = parseInt(this.props.gameSpaceId) % 10 || 10
				const territory = y < 5 ? 'red' : (y > 6 ? 'blue' : 'neutral');
				if (territory == app.tileRack.playerColor) {
					gb.swapPieces(this.props.gameSpaceId,gb.state.selectedSpace);
				}
				gb.highlightSpace(null);
				gb.selectSpace(null);
			}
		}
		else if (!this.props.placed && game && !game.state.started && game.state.placementMode == 'click'){
			game.selectedRank = (game.selectedRank != this.props.rank) ? this.props.rank : null;
			app.tileRack.setState({});
		}
		else if (this.props.placed && game && !game.state.started && game.state.placementMode == 'erase'){
			app.tileRack.returnTileToRack(game,app,this.props.gameSpaceId);
		}
		else if (isMobile && game && game.state.started && this.props.placed && (game.state.turn == app.tileRack.playerColor) && app.tileRack.playerColor == this.props.color) {
			gb.selectSpace(this.props.gameSpaceId);
			gb.highlightSpace(this.props.gameSpaceId);
			gb.clearDroppables();
			var moves = gb.getValidMoveSpaces(this.props.fromX, this.props.fromY, this.props.color, this, game);
			for (var i in moves) {
				var id = moves[i];
				if (id == this.props.gameSpaceId) {
					continue;
				}
				gb.droppable[id] = true;
				gb.resetSpace(id);
			}
		}
	}
	render() {
		var divClass = "gamePiece text-center mx-auto" + (this.props.className || '');
		var wrapperClass = "gamePiece-wrapper " + (this.props.wrapperClass || '');
		wrapperClass = wrapperClass.trim();
		var moveClass = '';
		divClass = divClass.trim();
		var tileFace = '';
		if (!!this.props.moveInfo) {
			moveClass = ' ' + this.props.moveInfo.direction + '-' + this.props.moveInfo.distance;
		}
		if (this.props.rank) {
			tileFace = <div className={"tileFace rank-"+this.props.rank}></div>;
		}
		else {
			wrapperClass += ' no-drag';
		}
		return (
			<CSSTransition
			in={!!this.props.moveInfo && !!this.props.game.state.started}
			timeout={1000}
			classNames="piece-moving"
			appear
			>
				<div className={wrapperClass+moveClass} onClick={this.pieceClicked}>
					<div className={divClass + " " + this.props.color}>
						{tileFace}
					</div>
				</div>
			</CSSTransition>
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
		// We're in initial tile placement state but not in drag and drop mode
		// Note this still allows for drag and drop swapping of already-placed tiles
		if (!game.state.started && game.state.placementMode != 'drag' && !props.placed) {
			return false;
		}
		// Game is over! No need to drag anything.
		if (game.state.status && game.state.status == 'done') {
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
	if (canDrag && props.game.state.started) {
		styles['cursor'] = 'move';
	}
	var piece = false;
	if (props.rank) {
		piece = PIECES[props.rank]
	}
	if (piece && !piece.move && props.game && props.game.state.started) {
		styles['cursor'] = 'not-allowed';
	}
	var wrapperClass = '';
	if (props.color) {
		wrapperClass = 'piece-'+props.color;
	}
	var countLabel = '';
	if (props.count && props.count > 1) {
		countLabel = (<label>x{props.count}</label>);
	}
	
	return (
		<div
			ref={drag}
			style={styles}
			className={wrapperClass+' '+(props.extraClass || '')}
		>
			<GamePiece color={props.color} rank={props.rank} moveInfo={props.moveInfo || null} gameSpaceId={props.fromId || null} placed={props.placed || false} captured={props.captured || false} game={props.game} fromX={props.fromX} fromY={props.fromY} className={props.className} />
			{countLabel}
		</div>
  );
}

export default DragPiece;
