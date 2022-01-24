/* eslint-disable */
import React, { useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

export function Home(props) {
	const { authState, oktaAuth } = useOktaAuth();
    const { userInfo, setUserInfo, unregistered, setUnregistered, checkAuth, setOpenMenu } = props.app;

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

	const login = () => oktaAuth.signInWithRedirect({originalUri: '/'});
	const LoginButton = () => {
		if (!authState.isAuthenticated) {
			return (
				<div>
					<button onClick={login}>Login</button>
				</div>
			);
		}
		return null;
	}

	const logout = () => { oktaAuth.signOut(); }
	let userText = '';
	let recentGames = '';
	let activeGames = '';
	let newGameButton = '';
	const GamesList = (list, listId, header) => {
		return (
			<div id={listId}>
				<h3>{ header }</h3>
				<ul>
					{list.map(game => <li key={`game-${listId}-${game.id}`}><a href={"/game/" + game.id}>{ game.title }</a></li>)}
				</ul>
			</div>
		);
	}
	if (authState.isAuthenticated) {
		if (unregistered) {
			userText = (<div><p>If you are seeing this, I should really open a modal to create your profile, new user.</p></div>);
		}
		else if (userInfo && !userInfo.error) {
			userText = (<div><p>Welcome, {userInfo.username}!</p><button onClick={ logout }>Logout</button></div>);
			if (userInfo.recent_games) {
				recentGames = GamesList(userInfo.recent_games, 'recent-games', 'Recent Games');
			}
			if (userInfo.active_games) {
				activeGames = GamesList(userInfo.active_games, 'active-games', 'Active Games');
			}
			newGameButton = (<Button variant="primary" onClick={() => { setOpenMenu('NewGame'); }}>New Game</Button>);
		}
		else if (userInfo && userInfo.error) {
			userText = (<div><p>The game server could not be found.  Please try again later.</p></div>)
			switch (userInfo.error) {
				case 'no-server':
					userText = (<div><p>The game server could not be found.  Please try again later.</p></div>)
				break;
			}
		}
		else {
			userText = (<div><p>Loading user info...</p></div>);
		}
	}
	else {
		userText = (<div><p>You need to sign in to use the application!</p><LoginButton /></div>);
	}
	return (
		<div className="page-home">
			<h1>Welcome to Stratego</h1>
			{ userText }
			{ activeGames }
			{ recentGames }
			{ newGameButton }
		</div>
	);
}

Home.propTypes = {
  app: PropTypes.object
};