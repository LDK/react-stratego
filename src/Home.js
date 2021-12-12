import React, { useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';
import PropTypes from "prop-types";

export function Home(props) {
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
	let gamesList = '';
	if (authState.isAuthenticated) {
		if (unregistered) {
			userText = (<div><p>If you are seeing this, I should really open a modal to create your profile, new user.</p></div>);
		}
		else if (userInfo) {
			userText = (<div><p>Welcome, {userInfo.username}!</p><button onClick={ logout }>Logout</button></div>);
			if (userInfo.recent_games) {
				gamesList = (<ul>
					(
						{userInfo.recent_games.map(game => <li key="game-{game.id}"><a href={"/game/" + game.id}>{game.title}</a></li>)}
					)
					</ul>);
			}
		}
		else {
			userText = (<div><p>Loading user info...</p></div>);
		}
	}
	else {
		userText = (<div><p>You need to sign in to use the application!</p><LoginButton /></div>);
	}
	
	return (<div className="page-home"><h1>Welcome to Stratego</h1>{ userText }{ gamesList }</div>);
}

Home.propTypes = {
  app: PropTypes.object
};