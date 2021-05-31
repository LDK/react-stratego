import React from 'react';
import PropTypes from 'prop-types';
import {PIECES} from '../Helpers.js';
import { CSSTransition } from 'react-transition-group';
import { isMobile } from "react-device-detect";

class GamePiece extends React.Component {
	static get propTypes() {
		return {
			captured: PropTypes.bool,
			placed: PropTypes.bool,
			rank: PropTypes.string,
			game: PropTypes.object,
			gameSpaceId: PropTypes.number,
			x: PropTypes.number,
			y: PropTypes.number,
			fromX: PropTypes.number,
			fromY: PropTypes.number,
			className: PropTypes.string,
			wrapperClass: PropTypes.string,
			color: PropTypes.string,
			moveInfo: PropTypes.object
		};
	}
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
			// If clicking a piece on the board during click placement...
			if (!gb.state.selectedSpace) {
				// If no space is selected, select & highlight clicked piece's space.
				gb.selectSpace(this.props.gameSpaceId);
				gb.highlightSpace(this.props.gameSpaceId);
				game.setHelpText('Click any space to move the selected tile there.');
			}
			else {
				// If a square is already selected...
				var y = Math.ceil(parseInt(this.props.gameSpaceId) / 10);
				// var x = parseInt(this.props.gameSpaceId) % 10 || 10
				const territory = y < 5 ? 'red' : (y > 6 ? 'blue' : 'neutral');
				if (territory == app.tileRack.playerColor) {
					// If clicked piece's space is within player's territory, 
					// swap clicked piece with selected space's content.
					gb.swapPieces(this.props.gameSpaceId,gb.state.selectedSpace);
				}
				gb.highlightSpace(null);
				gb.selectSpace(null);
				game.resetHelpText();
			}
		}
		else if (!this.props.placed && game && !game.state.started && game.state.placementMode == 'click'){
			// If this piece is not placed (still on rack) during click placement,
			// then make its rank the selected rank.  If its rank is already selected,
			// unselect that rank and re-render the tilerack.
			game.selectedRank = (game.selectedRank != this.props.rank) ? this.props.rank : null;
			var placementAction = isMobile ? 'Tap' : 'Click';
			if (app.tileRack && app.tileRack.remaining && game.selectedRank) {
				game.setHelpText((
					<div>{ placementAction + ' a square to place a ' }
						<div className={"d-inline-block position-relative tileFace rank-"+this.props.rank}></div>
					</div>
				));
			}
			else {
				game.resetHelpText();
			}
			app.tileRack.setState({});
		}
		else if (this.props.placed && game && !game.state.started && game.state.placementMode == 'erase'){
			// If this piece is placed on the board and user is in erase mode, send it back to the rack.
			app.tileRack.returnTileToRack(game,app,this.props.gameSpaceId);
			game.resetHelpText();
		}
		else if (isMobile && game && game.state.started && this.props.placed && (game.state.turn == app.tileRack.playerColor) && app.tileRack.playerColor == this.props.color) {
			// On mobile, if player taps own piece during player's turn, select that piece to be moved
			// and highlight its square.
			gb.selectSpace(this.props.gameSpaceId);
			gb.highlightSpace(this.props.gameSpaceId);
			
			// Clear & reset the "droppable" squares, i.e. squares that constitute valid game moves.
			gb.clearDroppables();
			var moves = gb.getValidMoveSpaces(this.props.fromX, this.props.fromY, this.props.color, this, game);
			for (var i in moves) {
				var id = moves[i];
				if (id == this.props.gameSpaceId) {
					// Exclude selected space.
					continue;
				}
				gb.droppable[id] = true;
				gb.resetSpace(id);
			}
			if (!moves.length) {
				game.setHelpText('No valid moves.  Try selecting another piece.');
			}
			else if (moves.length == 1) {
				game.setHelpText('Tap the highlighted square to move there.');
			}
			else {
				game.setHelpText('Tap any of the highlighted squares to move there.')
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
		if (this.props.moveInfo) {
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
			in={this.props.moveInfo && this.props.game.state.started}
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

export default GamePiece;
