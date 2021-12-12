import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";

export function Game(props) {
	const { game_id } = useParams();
	const { authState, oktaAuth } = useOktaAuth();
    const { userInfo, setUserInfo, unregistered, setUnregistered, checkAuth } = props.app;
	const [ loaded, setLoaded ] = useState(false);
	const [ turn, setTurn ] = useState(null);
	const [ color, setColor ] = useState(null);
	const [ opponent, setOpponent ] = useState(null);
	const [ redPlayer, setRedPlayer ] = useState(null);
	const [ bluePlayer, setBluePlayer ] = useState(null);

	const fetchGame = (id, userInfo) => {
		if (loaded) {
			return;
		}
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: id, userKey: userInfo.key, user_id: userInfo.id })
		};
		fetch('http://localhost:3002/game', requestOptions)
			.then(response => response.json())
			.then(data => {
				setLoaded(true);
				setTurn(data.turn);
				setColor(data.starter_uid == userInfo.id ? 'blue' : 'red');
				setOpponent(data.starter_uid == userInfo.id ? data.opponent_name : data.starter_name);
				setBluePlayer(data.starter_name);
				setRedPlayer(data.opponent_name);
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

	if (authState.isAuthenticated) {
		if (unregistered) {
			return (<div><p>If you are seeing this, I should really open a modal to create your profile, new user.</p></div>);
		}
		else if (userInfo) {
			if (!loaded) {
				fetchGame(game_id, userInfo);
			}
			let turnLabel = '';
			if (turn) {
				turnLabel = (<p>{ turn == 'red' ? redPlayer : bluePlayer }&apos;s turn.</p>);
			}
			return (<div className="game-wrapper">
				Game: { game_id }.
				You are { userInfo.username }.
				You use { color } tiles.
				Your opponent is { opponent }.
				{ turnLabel }
				</div>);
		}
		else {
			return (<div><p>Loading...</p></div>);
		}
	}
	else {
		return (<div><p>You need to sign in to use the application!</p></div>);
	}

}

Game.propTypes = {
  app: PropTypes.object
};