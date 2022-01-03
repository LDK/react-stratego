/* eslint-disable */
import React from "react";
import { useDrop } from 'react-dnd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import PropTypes from "prop-types";
import { GamePiece } from './GamePiece.js';

const blockedSpaces = [43,44,47,48,53,54,57,58];
const GameSpace = (props) => {
	const { x, y, id, data, playerColor, turn } = props;
	const handleDrop = (item) => {
		console.log('dropped this',item);
	};
    const [{ isOver }, dropRef] = useDrop({
        accept: 'GamePiece',
        drop: (item) => { handleDrop(item) },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })
	if (blockedSpaces.includes(id)) {
		return (
			<Col className="game-space unpassable text-center" data-x={x} data-y={y} data-id={id} data-passable={false}>X</Col>
		);
	}
	let rank, color;
	if (props.data) {
		rank = props.data.rank;
		color = props.data.color;
	}
	return (
		<Col className="game-space" data-x={x} data-y={y} data-id={id} ref={dropRef}>
			<GamePiece rank={rank} turn={turn} color={color} squareId={id} playerColor={playerColor} />
		</Col>
	);
};
GameSpace.propTypes = {
	territory: PropTypes.string,
	passable: PropTypes.any,
	id: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number
};

const BoardRow = (props) => {
	const { y, spaces, playerColor, turn } = props;
	let i = 1;
	let gameSpaces = [];
	while (i <= 10) {
		let id = ((y - 1) * 10) + i;
		gameSpaces.push(<GameSpace turn={turn} playerColor={playerColor} key={id} y={y} x={i} id={id} data={spaces[id]} />);
		i++;
	}
	return (
		<Row className="board-row">
			{ gameSpaces }
		</Row>
	);
};
BoardRow.propTypes = {
	y: PropTypes.number
};
export const GameBoard = (props) => {
	if (!props || !props.data) {
		return null;
	}
	let rows = [];
	let spaces = {};
	if (props.data.spaces) {
		spaces = JSON.parse(props.data.spaces);
	}
	let y = 1;
	while (y <= 10) {
		rows.push(<BoardRow turn={props.turn} playerColor={props.color} key={"row-"+y} spaces={spaces} y={y} />);
		y++;
	}
	return (
		<Container className="game-board">
			<p>game board, last checked { props.lastChecked }</p>
			{ rows }
		</Container>
	);
};
GameBoard.propTypes = {
  lastChecked: PropTypes.any
};
