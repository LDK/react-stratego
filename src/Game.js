import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";

export function Game(props) {
	const { game_id } = useParams();
	const { authState, oktaAuth } = useOktaAuth();
    const { userInfo, setUserInfo, unregistered, setUnregistered, checkAuth } = props.app;

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
			return (<div className="game-wrapper">Game: { game_id }.  You are { userInfo.username }.</div>);
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