import React from 'react';
import PropTypes from 'prop-types';
import MenuModal from '../widgets/MenuModal.js';

class RegistrationMenu extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			userInput: '',
			passInput: '',
			pass2Input: '',
			emailInput: ''
		};
		this.id = 'registration-modal';
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
		if (!this.state.passInput || this.state.passInput != this.state.pass2Input) {
			// return for now.  todo: some validation and subsequent reporting
			return;
		}
		var payload = {
			username: this.state.userInput,
			email: this.state.emailInput,
			password: this.state.passInput
		};
		window.fetch(app.gameServer+'register', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				// if (res.error) {
				// 	if (res.error == 'username-taken') {
				//
				// 	}
				// 	if (res.error == 'email-taken') {
				//
				// 	}
				// }
				if (!res.error) {
					Reg.setState({formOpen: false});
					res.user_id = res.id;
					app.setCurrentUser(res);
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
		const RegForm = (
			<form onSubmit={this.sendRegistration} className="h-100">
				<h3 className="mt-0">USER REGISTRATION</h3>
				<p className="">Register for Stratego here!</p>
				<input type="text" value={state.userInput} onChange={this.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="22" className="mr-2" name="email" placeholder="E-mail Address" /><br />
				<input type="password" value={state.passInput} onChange={this.updatePassInput} name="password" size="22" className="mr-2" placeholder="Password" /><br />
				<input type="password" value={state.pass2Input} onChange={this.updatePass2Input} name="password2" size="22" className="mr-2" placeholder="Enter Password Again" /><br />
				<input type="submit" value="SIGN UP!" size="3" className="go-button text-white float-right" onClick={this.sendRegistration} 
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
			<MenuModal 
				parentMenu={this}
				content={RegForm}
				styles={{ backgroundColor: 'var(--dark)' }}
				additionalClasses={"text-white"}
			/>
		);
	}
}

export default RegistrationMenu;
