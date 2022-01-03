/* eslint-disable */
import React from "react";
import { useDrop } from 'react-dnd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import PropTypes from "prop-types";
import { GamePiece } from './GamePiece.js';

export const TileRack = (props) => {
	// if (!props || !props.data) {
	// 	return null;
	// }

	return (
		<Container className="tile-rack">
			TILE RACK
			<GamePiece rank={"3"} color={"Blue"} />
		</Container>
	);
};
TileRack.propTypes = {
  lastChecked: PropTypes.any
};

