import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class RegistrationMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			gameId: null,
			gameFound: false,
			userInput: '',
			passInput: '',
			pass2Input: '',
			emailInput: '',
			parentMenu: props.app.newGameMenu
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.updateChosen = this.updateChosen.bind(this);
		this.sendRegistration = this.sendRegistration.bind(this);
		props.app.RegistrationMenu = this;
	}
	sendRegistration(event) {
		event.preventDefault();
		var app = this.props.app;
		var parentObj = this.props.parentObj;
		var Reg = this;
		if (!parentObj.state.passInput || parentObj.state.passInput != parentObj.state.pass2Input) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		var formData = new FormData();
		formData.append('username',parentObj.state.userInput);
		formData.append('email',parentObj.state.emailInput);
		formData.append('password',parentObj.state.passInput);
		window.fetch(app.gameServer+'register', {
			method: 'POST', 
			body: formData
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				if (res.error) {
					if (res.error == 'username-taken') {

					}
					if (res.error == 'email-taken') {

					}
				}
				else {
					Reg.setState({formOpen: false});
					if (parentObj.props.loginCallback) {
						parentObj.props.loginCallback(res);
					}
				}
			});
		}).catch(function(error) {
			console.log('Request failed', error);
		});
	}
	handleSubmit(event) {
		event.preventDefault();
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var opponentId = this.state.opponentId;
		if (!uid || !userKey) {
			return [];
		}
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		var gameId = this.state.gameId;
		var menu = this;
		if (gameId) {
			formData.append('game_id',gameId);
		}
		window.fetch(app.gameServer+'join_game', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				menu.setState({ formOpen: false });
				app.getRequests();
				app.getGames();
			});
		});
	}
	updateChosen(value) {
		var gameId = parseInt(value) || null;
		this.setState({ 
			gameId: gameId,
			gameFound: !!gameId
		});
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var app = this.props.app;
		var opponentIndicator = null;
		if (this.state.opponentFound) {
			opponentIndicator = (<p className="opponentFound">Opponent Found!</p>);
		}
		var app = this.props.app;
		var formClass = app.state.currentUser ? 'd-none' : '';
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		var parentObj = this.props.parentObj;
		const RegForm = (
			<form action={app.state.gameServer+"register"} onSubmit={this.sendRegistration}>
				{parentObj.state.passInput}12{parentObj.state.userInput}
				<h3 className="mb-2">That username was not found in the database.<br />Maybe you should register!</h3>
				<input type="text" value={parentObj.state.userInput} onChange={parentObj.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="text" value={parentObj.state.emailInput} onChange={parentObj.updateEmailInput} size="22" className="mr-2" name="email" placeholder="E-mail Address" /><br />
				<input type="password" value={parentObj.state.passInput} onChange={parentObj.updatePassInput} name="password" size="22" className="mr-2" placeholder="Password" /><br />
				<input type="password" value={parentObj.state.pass2Input} onChange={parentObj.updatePass2Input} name="password2" size="22" className="mr-2" placeholder="Enter Password Again" /><br />
				<input type="submit" value="Go" size="3" onClick={this.sendRegistration} 
					disabled={
						!parentObj.state.userInput ||
						!parentObj.state.passInput ||
						!parentObj.state.pass2Input ||
						!parentObj.state.emailInput ||
						parentObj.state.pass2Input != parentObj.state.passInput
					}
				/>
			</form>
		);
		
		return (
		<Modal 
			id="registration-modal"
			content={RegForm}
			open={this.state.formOpen}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default RegistrationMenu;
