import './App.scss';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { LoginCallback, Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Home } from './Home';
import { Game } from './Game';
import { toRelativeUrl } from '@okta/okta-auth-js';

const ClientId = '0oa2t6lqn7Qsg1T3g5d7';
const AuthDomain = 'dev-6379228.okta.com';

const config = {
  clientId: `${ClientId}`,
  issuer: `https://${AuthDomain}/oauth2/default`,
  discoveryUri: `https://${AuthDomain}/oauth2/default`,
  redirectUri: 'http://localhost:3000/login-callback',
  endSessionRedirectUri: 'http://localhost:3000/logout',
  scopes: ['openid', 'profile', 'email'],
  requireHardwareBackedKeyStore: false,
  pkce: true
};

const oktaAuth = new OktaAuth(config);
const originalUri = toRelativeUrl(window.location.href, window.location.origin);
oktaAuth.setOriginalUri(originalUri);

function App() {
    const [ userInfo, setUserInfo ] = useState(null);
    const [ unregistered, setUnregistered ] = useState(false);
	const restoreOriginalUri = () => {
		window.location='/';
	};
	const checkAuth = (args) => {
		const { authState, oktaAuth, userInfo, setUserInfo, setUnregistered } = args;
		if (!authState || !authState.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			if (!userInfo || !userInfo.username) {
				oktaAuth.token.getUserInfo().then(info => {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userKey: info.sub, email: info.email })
					};
					fetch('http://localhost:3002/login', requestOptions)
						.then(response => response.json())
						.then(data => {
							setUserInfo({
								email: data.email,
								id: data.user_id,
								key: info.sub,
								invite_available: data.invite_available,
								random_available: data.random_available,
								username: data.username,
								recent_games: data.recentGames,
								active_games: data.activeGames
							});
							setUnregistered(!data.user_id);
					});
				});
			}
		}
	};
	const app = {
		userInfo: userInfo,
		setUserInfo: setUserInfo,
		unregistered: unregistered,
		setUnregistered: setUnregistered,
		checkAuth: checkAuth
	};
	return (
		<div className="App">
			<Router>
				<header>
					<div>Stratego</div>
					<ul className="menu"><li><Link to="/">Home</Link></li></ul>
				</header>
				<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
					<Route exact path='/'>
						<Home app={app} />
					</Route>
					<Route path='/game/:game_id'>
						<Game app={app} />
					</Route>
					<Route path='/login-callback' component={LoginCallback}/>
				</Security>
			</Router>
		</div>
	);
}

export default App;
