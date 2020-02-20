import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';

class RegistrationMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			userInput: '',
			passInput: '',
			pass2Input: '',
			emailInput: ''
		};
		this.sendRegistration = this.sendRegistration.bind(this);
		this.updateUserInput = this.updateUserInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.updatePass2Input = this.updatePass2Input.bind(this);
		this.updateEmailInput = this.updateEmailInput.bind(this);
		props.app.RegistrationMenu = this;
	}
	updateUserInput(event) {
		this.setState({userInput: event.target.value});
	}
	updateEmailInput(event) {
		this.setState({emailInput: event.target.value});
	}
	updatePassInput(event) {
		this.setState({passInput: event.target.value});
	}
	updatePass2Input(event) {
		this.setState({pass2Input: event.target.value});
	}
	sendRegistration(event) {
		event.preventDefault();
		var app = this.props.app;
		var Reg = this;
		if (!state.passInput || state.passInput != state.pass2Input) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		var formData = new FormData();
		formData.append('username',this.state.userInput);
		formData.append('email',this.state.emailInput);
		formData.append('password',this.state.passInput);
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
		var app = this.props.app;
		const RegForm = (
			<form onSubmit={this.sendRegistration}>
				<h3 className="mb-2">That username was not found in the database.<br />Maybe you should register!</h3>
				<input type="text" value={state.userInput} onChange={this.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="22" className="mr-2" name="email" placeholder="E-mail Address" /><br />
				<input type="password" value={state.passInput} onChange={this.updatePassInput} name="password" size="22" className="mr-2" placeholder="Password" /><br />
				<input type="password" value={state.pass2Input} onChange={this.updatePass2Input} name="password2" size="22" className="mr-2" placeholder="Enter Password Again" /><br />
				<input type="submit" value="Go" size="3" onClick={this.sendRegistration} 
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
			id="registration-modal"
			app={app}
			content={RegForm}
			open={this.state.formOpen}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default RegistrationMenu;
