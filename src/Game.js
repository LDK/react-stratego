/* eslint-disable */
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useParams } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";
import { GamePiece } from './GamePiece.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd';

const blockedSpaces = [43,44,47,48,53,54,57,58];
const GameSpace = (props) => {
	const { x, y, id, data, playerColor, turn } = props;
    const [{ isOver }, dropRef] = useDrop({
        accept: 'GamePiece',
        drop: (item) => { console.log('dropped',item,'on',id); },
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
const GameBoard = (props) => {
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
			<DndProvider backend={HTML5Backend}>
			{ rows }
			</DndProvider>
		</Container>
	);
};
GameBoard.propTypes = {
  lastChecked: PropTypes.any
};

export function Game(props) {
	const { game_id } = useParams();
	const { authState, oktaAuth } = useOktaAuth();
    const { userInfo, setUserInfo, unregistered, setUnregistered, checkAuth } = props.app;
	const [ loaded, setLoaded ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ turn, setTurn ] = useState(null);
	const [ color, setColor ] = useState(null);
	const [ opponent, setOpponent ] = useState(null);
	const [ redPlayer, setRedPlayer ] = useState(null);
	const [ bluePlayer, setBluePlayer ] = useState(null);
	const [ lastChecked, setLastChecked ] = useState(Date.now());
	const [ gameData, setGameData ] = useState(null);
	const [ notFound, setNotFound ] = useState(false);

	const fetchGame = (id, userInfo) => {
		if (loaded) {
			return;
		}
		setLoading(true);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: id, userKey: userInfo.key, user_id: userInfo.id })
		};
		fetch('http://localhost:3002/game', requestOptions)
		.then((response) => {
			if (response.ok) {
				response.json().then(
					data => {
						setLoaded(true);
						setLoading(false);
						setTurn(data.turn);
						setColor(data.starter_uid == userInfo.id ? 'blue' : 'red');
						setOpponent(data.starter_uid == userInfo.id ? data.opponent_name : data.starter_name);
						setBluePlayer(data.starter_name);
						setRedPlayer(data.opponent_name);
						setLastChecked(Date.now());
						setGameData(data);
					}
				)
			}
			else {
				setNotFound(true);
			}
		});
	}

	useEffect(() => checkAuth({
		authState: authState,
		oktaAuth: oktaAuth,
		userInfo: userInfo,
		setUserInfo: setUserInfo,
		setUnregistered: setUnregistered
	}), [authState, oktaAuth]); // Update if authState changes

	if (!authState) {
		return (
			<div>Loading authentication...</div>
		);
	}

	if (notFound) {
		return (
			<div>Sorry, no game was found with that id.</div>
		);
	}

	if (authState.isAuthenticated) {
		if (unregistered) {
			return (<div><p>If you are seeing this, I should really open a modal to create your profile, new user.</p></div>);
		}
		else if (userInfo) {
			if (!loaded && !loading) {
				fetchGame(game_id, userInfo);
			}
			let turnLabel = '';
			if (turn) {
				turnLabel = (<p>{ turn == 'red' ? redPlayer : bluePlayer }&apos;s turn.</p>);
			}
			return (<div className="game-wrapper">
				Game: { game_id }.
				You are { userInfo.username }.
				Your opponent is { opponent }.
				You use { color } tiles.
				{ turnLabel }
				<GameBoard data={gameData} lastChecked={lastChecked} color={color} turn={turn} />
				</div>);
		}
		else {
			return (<div><p>Loading...</p></div>);
		}
	}
	else {
		window.location = '/';
		return (<div><p>You need to sign in to use the application!</p></div>);
	}

}

Game.propTypes = {
  app: PropTypes.object
};