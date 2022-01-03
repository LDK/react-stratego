/* eslint-disable */
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useParams } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";
import { GameBoard } from './GameBoard.js';
import { TileRack } from './TileRack.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
			return (<Container fluid className="game-wrapper">
				Game: { game_id }.
				You are { userInfo.username }.
				Your opponent is { opponent }.
				You use { color } tiles.
				{ turnLabel }
			<DndProvider backend={HTML5Backend}>
				<Row>
					<Col xs={12} md={8} lg={9}>
						<GameBoard data={gameData} lastChecked={lastChecked} color={color} turn={turn} />
					</Col>
					<Col xs={12} md={4} lg={3}>
						<TileRack />
					</Col>
				</Row>
			</DndProvider>
				</Container>);
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