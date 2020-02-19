import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';

class UserOptionsMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			usernameInput: props.app.state.currentUser.username || '',
			passInput: '',
			newPassInput: '',
			newPass2Input: '',
			emailInput: ''
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
		var uid = this.state.currentUser.user_id;
		var userKey = this.state.currentUser.userKey;
		if (!uid || !userKey) {
			return;
		}
		if (state.newPassInput && (state.newPassInput != state.newPass2Input)) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		var formData = new FormData();
		formData.append('username',this.state.usernameInput);
		formData.append('email',this.state.emailInput);
		formData.append('current_password',this.state.passInput);
		formData.append('new_password',this.state.newPassInput);
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		window.fetch(app.gameServer+'save_options', {
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
				<h3 className="mb-2">User Options</h3>
				<input type="text" value={state.userInput} onChange={this.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="22" className="mr-2" name="email" placeholder="E-mail Address" /><br />
				<input type="password" onChange={this.updatePassInput} name="current-password" size="22" className="mr-2" placeholder="Current Password" /><br />
				<input type="password" value={state.newPassInput} onChange={this.updateNewPassInput} name="new-password" size="22" className="mr-2" placeholder="New Password" /><br />
				<input type="password" value={state.newPass2Input} onChange={this.updateNewPass2Input} name="new-password2" size="22" className="mr-2" placeholder="Enter New Password Again" /><br />
				<input type="submit" value="Go" size="3" onClick={this.saveOptions} 
					disabled={
						!state.userInput ||
						!state.passInput ||
						!state.pass2Input ||
						!state.emailInput ||
						state.pass2Input != state.passInput
					}
				/>
			</form>
		);
		
		return (
		<Modal 
			id="user-options-modal"
			content={OptionsForm}
			open={this.state.formOpen}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default UserOptionsMenu;
