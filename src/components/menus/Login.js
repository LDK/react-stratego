import React from 'react';
import PropTypes from 'prop-types';
import MenuModal from '../widgets/MenuModal.js';

class LoginMenu extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object,
			loginCallback: PropTypes.func
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			userInput: '',
			passInput: ''
		};
		this.id = 'login-modal';
		this.sendLogin = this.sendLogin.bind(this);
		this.updateUserInput = this.updateUserInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		props.app.LoginMenu = this;
	}
	updateUserInput(event) {
		this.setState({userInput: event.target.value});
	}
	updatePassInput(event) {
		this.setState({passInput: event.target.value});
	}
	sendLogin(event) {
		event.preventDefault();
		var props = this.props;
		var app = props.app;
		var state = this.state;
		var loginForm = this;
		var payload = { username: state.userInput, password: state.passInput };
		window.fetch(app.gameServer+'login', {
			method: 'POST',
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				if (res.error) {
					if (res.error == 'no-user') {
						app.LoginMenu.setState({formOpen: true});
					}
				}
				else {
					loginForm.setState({ formOpen: false });
					if (props.loginCallback) {
						props.loginCallback(res);
					}
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
		const loginForm = (
			<form onSubmit={this.sendLogin} className="h-100">
				<h3 className="mt-0">LOGIN</h3>
				<input type="text" value={state.userInput} onChange={this.updateUserInput} size="22" className="mr-2" name="username" placeholder="Username" /><br />
				<input type="password" value={state.passInput} onChange={this.updatePassInput} name="password" size="22" className="mr-2" placeholder="Password" /><br />
			<input type="submit" value="Sign In" size="3" className="go-button text-white float-right" onClick={this.sendLogin} 
					disabled={
						!state.userInput ||
						!state.passInput
					}
				/>
					
			</form>
		);
		
		return (
			<MenuModal 
				parentMenu={this}
				content={loginForm}
				styles={{ backgroundColor: 'var(--dark)' }}
				additionalClasses={"text-white"}
			/>
		);
	}
}

export default LoginMenu;
