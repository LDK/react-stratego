import React from 'react';
import PropTypes from 'prop-types';
import GamePiece from './GamePiece.js';
import { useDrag } from 'react-dnd';

let DragPiece = (props) => {
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
			if (!game.props.app.Config.Pieces[rank].move) {
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
		piece = props.game.props.app.Config.Pieces[props.rank];
	}
	if (piece && !piece.move && props.game && props.game.state.started) {
		styles['cursor'] = 'not-allowed';
	}
	var wrapperClass = '';
	if (props.color) {
		wrapperClass = 'piece-'+props.color;
	}
	var countLabel = '';
	if (props.count) {
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
};
DragPiece.propTypes = {
    placed: PropTypes.bool,
    captured: PropTypes.bool,
    rank: PropTypes.any,
	game: PropTypes.object,
	color: PropTypes.string,
	tileSpace: PropTypes.object,
	fromX: PropTypes.number,
	fromY: PropTypes.number,
	fromId: PropTypes.number,
	move: PropTypes.any,
	moveInfo: PropTypes.object,
	count: PropTypes.number,
	extraClass: PropTypes.string,
	className: PropTypes.string
};

export default DragPiece;