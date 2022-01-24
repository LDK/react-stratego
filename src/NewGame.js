/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Modal from 'react-bootstrap/Modal';
import "./scss/game.scss";

export const NewGame = (props) => {
	const { visible } = props;
	const { setOpenMenu } = props.app;
	return (
		<Modal
			className="new-game-menu"
			keyboard={true}
			backdrop={true}
			show={visible}
			onHide={() => { setOpenMenu(null); }}
			centered
			size="lg"
			>
				<Modal.Header closeButton>
					<span>Create or Join a Game</span>
				</Modal.Header>
				<Modal.Body>

				</Modal.Body>
		</Modal>
	);
};
// GamePiece.propTypes = {
// 	color: PropTypes.string,
// 	rank: PropTypes.any,
// 	squareId: PropTypes.number,
// 	playerColor: PropTypes.string
// };
