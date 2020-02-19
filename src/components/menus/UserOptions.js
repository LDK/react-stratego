import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import cloneDeep from 'lodash/cloneDeep';

class UserOptionsMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			usernameInput: props.app.state.currentUser.username || '',
			passInput: '',
			newPassInput: '',
			newPass2Input: '',
			emailInput: props.app.state.currentUser.email || '',
			invitesAvailable: 
				(typeof props.app.state.currentUser.invitesAvailable != 'undefined') ?
					props.app.state.currentUser.invitesAvailable : 
					true,
			randomAvailable: 
				(typeof props.app.state.currentUser.randomAvailable != 'undefined') ?
					props.app.state.currentUser.randomAvailable : 
					true
		};
		this.saveOptions = this.saveOptions.bind(this);
		this.updateUsernameInput = this.updateUsernameInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.updateNewPassInput = this.updateNewPassInput.bind(this);
		this.updateNewPass2Input = this.updateNewPass2Input.bind(this);
		this.updateEmailInput = this.updateEmailInput.bind(this);
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
		var formData = new FormData();
		if (state.newPassInput) {
			formData.append('current_password',state.passInput);
			formData.append('new_password',state.newPassInput);
			currentUser.password = state.newPassInput;
		}
		currentUser.email = state.emailInput;
		formData.append('username',state.usernameInput);
		formData.append('email',state.emailInput);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(app.gameServer+'save_user_options', {
			method: 'POST', 
			body: formData
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
						<div className="col-12 col-md-8">
							<input type="text" value={state.usernameInput} onChange={this.updateUsernameInput} size="22" className="small" name="username" placeholder="Username" />
						</div>
						<div className="col-12 col-md-4">
							<label className="mr-2 small">E-mail Address:</label>
						</div>
						<div className="col-12 col-md-8">
							<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="32" className="small" name="email" placeholder="E-mail Address" />
						</div>
						<div className="col-12 mt-4">
							<label className="small d-block">Current Password (Required if changing password):</label>
							<input type="password" onChange={this.updatePassInput} name="current-password" size="22" className="small" placeholder="Current Password" />
						</div>
						<div className="col-12 mt-3">
							<label className="small d-block">New Password (Both fields must match):</label>
							<input type="password" value={state.newPassInput} onChange={this.updateNewPassInput} name="new-password" size="22" className="small" /><br />
							<input type="password" value={state.newPass2Input} onChange={this.updateNewPass2Input} name="new-password2" size="22" className="small" />
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
			open={this.state.formOpen}
			width="small"
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default UserOptionsMenu;
