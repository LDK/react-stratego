/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useDrag } from 'react-dnd'
import "./scss/game.scss";

export const GamePiece = (props) => {
	const { rank, color, squareId, playerColor, turn } = props;
    const [{ isDragging }, dragRef] = useDrag({
        type: 'GamePiece',
		canDrag: (playerColor == color || playerColor == turn),
        item: { rank, color, squareId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })
	return (
		<div className="gamePiece-wrapper" ref={dragRef} data-rank={rank} data-color={color} data-square={squareId}>
			<div className={"gamePiece " + (color || '')}>
				{ rank && color ? <div className={`tileFace rank-${rank}`} /> : '' }{isDragging && '😱'}
			</div>
		</div>
	);
};
GamePiece.propTypes = {
	color: PropTypes.string,
	rank: PropTypes.any,
	squareId: PropTypes.number,
	playerColor: PropTypes.string
};
