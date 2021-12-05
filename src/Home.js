import React, { useState, useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';

export function Home() {
	const { authState, oktaAuth } = useOktaAuth();
    const [ userInfo, setUserInfo ] = useState(null);
    const [ unregistered, setUnregistered ] = useState(false);
	useEffect(() => {
		if (!authState || !authState.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			oktaAuth.token.getUserInfo().then(info => {
				if (!userInfo || !userInfo.username) {
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
								username: data.username
							});
							setUnregistered(!data.user_id);
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
		if (unregistered) {
			userText = (<div><p>If you are seeing this, I should really open a modal to create your profile, new user.</p></div>);
		}
		else if (userInfo) {
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