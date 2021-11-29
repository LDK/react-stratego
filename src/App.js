import './App.scss';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { LoginCallback, Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Home } from './Home';
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
	const restoreOriginalUri = () => {
		window.location='/';
	};
	return (
		<div className="App">
			<Router>
				<header>
					<div>Stratego</div>
					<ul className="menu"><li><Link to="/">Home</Link></li></ul>
				</header>
				<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
					<Route exact path='/' component={Home}/>
					<Route path='/login-callback' component={LoginCallback}/>
				</Security>
			</Router>
		</div>
	);
}

export default App;
