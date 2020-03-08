import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import cloneDeep from 'lodash/cloneDeep';
import {keyCodes} from '../Helpers.js';
import Hotkeys from 'react-hot-keys';

class UserOptionsMenu extends React.Component {
	constructor(props) {
		super(props);
		var currentUser = props.app.state.currentUser;
		this.state = {
			formOpen: false,
			usernameInput: currentUser.username || '',
			passInput: '',
			newPassInput: '',
			newPass2Input: '',
			emailInput: currentUser.email || '',
			invitesAvailable: currentUser.invite_available != 'false',
			randomAvailable: currentUser.random_available != 'false'
		};
		this.saveOptions = this.saveOptions.bind(this);
		this.updateUsernameInput = this.updateUsernameInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.updateNewPassInput = this.updateNewPassInput.bind(this);
		this.updateNewPass2Input = this.updateNewPass2Input.bind(this);
		this.updateEmailInput = this.updateEmailInput.bind(this);
		this.toggleInvitesAvailable = this.toggleInvitesAvailable.bind(this);
		this.toggleRandomAvailable = this.toggleRandomAvailable.bind(this);
		this.closeForm = this.closeForm.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		props.app.UserOptions = this;
	}
	updateUsernameInput(event) {
		this.setState({usernameInput: event.target.value});
	}
	updateEmailInput(event) {
		this.setState({emailInput: event.target.value});
	}
	updatePassInput(event) {
		this.setState({passInput: event.target.value});
	}
	updateNewPassInput(event) {
		this.setState({newPassInput: event.target.value});
	}
	updateNewPass2Input(event) {
		this.setState({newPass2Input: event.target.value});
	}
	toggleInvitesAvailable(event) {
		this.setState({invitesAvailable: !this.state.invitesAvailable});
	}
	toggleRandomAvailable(event) {
		this.setState({randomAvailable: !this.state.randomAvailable});
	}
	closeForm() {
		this.setState({ formOpen: false });
	}
	saveOptions(event) {
		event.preventDefault();
		var app = this.props.app;
		var Opt = this;
		var currentUser = cloneDeep(app.state.currentUser);
		var uid = currentUser.user_id;
		var userKey = currentUser.userKey;
		var state = this.state;
		if (!uid || !userKey) {
			return;
		}
		if (state.newPassInput && (state.newPassInput != state.newPass2Input)) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		currentUser.email = state.emailInput;
		var payload = {
			username: state.usernameInput,
			email: state.emailInput,
			random_available: !!state.randomAvailable,
			invite_available: !!state.invitesAvailable,
			user_id: uid,
			userKey: userKey
		};
		if (state.newPassInput) {
			payload.current_password = state.passInput;
			payload.new_password = state.newPassInput;
			currentUser.password = state.newPassInput;
		}
		window.fetch(app.gameServer+'save_user_options', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		.then(function(data) {
			var changes = false;
			data.text().then(function(text) {
				var res = JSON.parse(text);
				if (res.error) {
					if (res.error == 'username-taken') {

					}
					if (res.error == 'email-taken') {

					}
				}
				else {
					// DRY this up when you have nothing else to do.
					if (res.username) {
						changes = true;
						currentUser.username = res.username;
					}
					if (res.email) {
						changes = true;
						currentUser.email = res.email;
					}
					if (res.password) {
						changes = true;
						currentUser.password = res.password;
					} 
					if (res.invite_available) {
						changes = true;
						currentUser.invite_available = res.invite_available;
					} 
					if (res.random_available) {
						changes = true;
						currentUser.random_available = res.random_available;
					} 
					if (changes) {
						app.setCurrentUser(currentUser);
					}
					Opt.setState({formOpen: false});
				}
			});
		}).catch(function(error) {
			console.log('Request failed', error);
		});
	}
	onKeyDown (e) {
		if (!e.keyCode) { return; }
		switch (e.keyCode) {
			case keyCodes['esc']:
				this.closeForm();
			break;
		}
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var state = this.state;
		const OptionsForm = (
			<form onSubmit={this.saveOptions}>
				<h3 className="mb-3">User Options</h3>
				<div className="container-fluid px-0">
					<div className="row no-gutters">
						<div className="col-12 col-md-4">
							<label className="mr-2 small">Username:</label>
						</div>
						<div className="col-12 col-md-8 mb-2">
							<input type="text" value={state.usernameInput} onChange={this.updateUsernameInput} size="24" className="small" name="username" placeholder="Username" />
						</div>
						<div className="col-12 col-md-4">
							<label className="mr-2 small">E-mail Address:</label>
						</div>
						<div className="col-12 col-md-8">
							<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="24" className="small" name="email" placeholder="E-mail Address" />
						</div>
						<div className="col-12 mt-4">
							<label className="small d-block">Current Password (Required if changing password):</label>
							<input type="password" onChange={this.updatePassInput} name="current-password" size="24" className="small" placeholder="Current Password" />
						</div>
						<div className="col-12 mt-3">
							<label className="small d-block">New Password (Both fields must match):</label>
							<input type="password" value={state.newPassInput} onChange={this.updateNewPassInput} name="new-password" size="24" className="small" /><br />
							<input type="password" value={state.newPass2Input} onChange={this.updateNewPass2Input} name="new-password2" size="24" className="small" />
						</div>
						<div className="col-12 mt-4">
							<input type="checkbox" name="invite-available" checked={state.invitesAvailable} onChange={this.toggleInvitesAvailable} />
							<label className="small ml-2">Available for Game Invites</label>
						</div>
						<div className="col-12">
							<input type="checkbox" name="random-available" checked={state.randomAvailable} onChange={this.toggleRandomAvailable} />
							<label className="small ml-2">Available to Be Selected As Random Opponent</label>
						</div>
						<div className="col-12 mt-4">
							<input type="submit" value="Go" size="3" onClick={this.saveOptions} 
								disabled={
									!state.usernameInput ||
									!state.emailInput ||
									(state.newPassInput && state.newPassInput != state.newPass2Input)
								}
							/>
						</div>
					</div>
				</div>
			</form>
		);
		
		return (
		<Modal 
			id="user-options-modal"
			content={OptionsForm}
			app={this.props.app}
			open={this.state.formOpen}
			width="small"
			onKeyDown={this.onKeyDown} 
			closeButton={true}
			closeCallback={this.closeForm}
			additionalClasses={"py-4 px-5 text-black"}
		/>
		);
	}
}

export default UserOptionsMenu;
