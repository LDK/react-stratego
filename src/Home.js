import React, { useState, useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';

export function Home() {
	const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
	useEffect(() => {
		if (!authState || !authState.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			oktaAuth.token.getUserInfo().then(info => {

				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userKey: info.sub })
				};

				if (!userInfo || !userInfo.username) {
					fetch('http://localhost:3002/login', requestOptions)
						.then(response => response.json())
						.then(data => {
							info.username = data.username;
							info.id = data.user_id;
							info.invite_available = data.invite_available;
							info.random_available = data.random_available;
							setUserInfo(info);
					});
				}
			});
		}
	}, [authState, oktaAuth]); // Update if authState changes

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
	if (authState.isAuthenticated) {
		if (userInfo) {
			userText = (<div><p>Welcome, {userInfo.username}!</p><button onClick={ logout }>Logout</button></div>);
		}
		else {
			userText = (<div><p>Loading user info...</p></div>);
		}
	}
	else {
		userText = (<div><p>You need to sign in to use the application!</p><LoginButton /></div>);
	}
	
	return (<div className="page-home"><h1>Welcome to Stratego</h1>{ userText }</div>);
}