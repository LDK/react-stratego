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
		if (!this.state.passInput || this.state.passInput != this.state.pass2Input) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		var app = this.props.app;
		var state = cloneDeep(this.state);
		var formData = new FormData();
		var props = this.props;
		var nav = this;
		formData.append('username',state.userInput);
		formData.append('email',state.emailInput);
		formData.append('password',state.passInput);
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
					nav.setState({regFormOpen: false});
					if (props.loginCallback) {
						props.loginCallback(res);
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
		var RegistrationForm = (
			<form action={app.state.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<h3 className="mb-2">Select a game to join!</h3>
				<div>
					<DataBrowser 
						label="Open Games:" 
						items={app.openGames} 
						emptyOption='- Select A Game -'
						emptyVal={null}
						view="select" 
						id="openGameList" 
						parentObj={this}
						// refName='pastOpponents'
						callback={this.updateChosen}
					/>
				</div>
				<input type="submit" value="Submit" size="3" onClick={this.handleSubmit} disabled={!this.state.gameFound} />
			</form>
		);
		var app = this.props.app;
		var formClass = app.state.currentUser ? 'd-none' : '';
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		const RegistrationForm = (
			<form action={app.state.gameServer+"register"} onSubmit={this.sendRegistration}>
				<h3 className="mb-2">That username was not found in the database.<br />Maybe you should register!</h3>
				<input type="text" value={this.state.userInput} onChange={this.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="text" value={this.state.emailInput} onChange={this.updateEmailInput} size="22" className="mr-2" name="email" placeholder="E-mail Address" /><br />
				<input type="password" value={this.state.passInput} onChange={this.updatePassInput} name="password" size="22" className="mr-2" placeholder="Password" /><br />
				<input type="password" value={this.state.pass2Input} onChange={this.updatePass2Input} name="password2" size="22" className="mr-2" placeholder="Enter Password Again" /><br />
				<input type="submit" value="Go" size="3" onClick={this.sendRegistration} />
			</form>
		);
		
		return (
		<Modal 
			id="registration-modal"
			content={RegistrationForm}
			open={this.state.formOpen}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default RegistrationMenu;
