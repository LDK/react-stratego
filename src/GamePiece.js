/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { useDrag } from 'react-dnd'

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
		<div className="game-piece" ref={dragRef} data-rank={rank} data-color={color} data-square={squareId}>{ color || '' } { rank && color ? (rank || '?') : '' }{isDragging && '😱'}</div>
	);
};
GamePiece.propTypes = {
	color: PropTypes.string,
	rank: PropTypes.any,
	squareId: PropTypes.number,
	playerColor: PropTypes.string
};
