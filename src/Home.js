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
				setUserInfo(info);
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
			userText = (<div><p>Welcome, {userInfo.given_name}!</p><button onClick={ logout }>Logout</button></div>);
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