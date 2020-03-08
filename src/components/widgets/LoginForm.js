import React, { Component } from 'react';
import Icon from '../widgets/Icon.js';
import DataBrowser from '../widgets/DataBrowser.js';
import Cookies from 'universal-cookie';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInput: '',
			passInput: '',
			userDropdownOpen: !!props.open
		};
		this.sendLogin = this.sendLogin.bind(this);
		this.updateUserInput = this.updateUserInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.openRegistrationMenu = this.openRegistrationMenu.bind(this);
		this.openUserOptions = this.openUserOptions.bind(this);
		this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
		this.closeUserDropdown = this.closeUserDropdown.bind(this);
		this.logUserOut = this.logUserOut.bind(this);
		props.app.LoginForm = this;
	}
	logUserOut() {
		const cookies = new Cookies();
		cookies.remove("stratego-user");
		this.props.app.setState({currentUser: false, activeGame: null, games: []});
		this.closeUserDropdown();
	}
	updateUserInput(event) {
		this.setState({userInput: event.target.value});
		this.props.app.RegistrationMenu.setState({userInput: event.target.value});
	}
	updatePassInput(event) {
		this.setState({passInput: event.target.value});
		this.props.app.RegistrationMenu.setState({passInput: event.target.value});
	}
	openUserOptions() {
		var app = this.props.app;
		app.UserOptions.setState({ formOpen: true });
		this.closeUserDropdown();
	}
	toggleUserDropdown() {
		this.setState({ userDropdownOpen: !this.state.userDropdownOpen });
	}
	closeUserDropdown() {
		this.setState({ userDropdownOpen: false });
	}
	sendLogin(event) {
		event.preventDefault();
		var app = this.props.app;
		var state = this.state;
		var props = this.props;
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
						app.RegistrationMenu.setState({formOpen: true});
					}
				}
				else if (props.loginCallback) {
					props.loginCallback(res);
				}
			});
		}).catch(function(error) {
			console.log('Request failed', error);
		});
	}
	openRegistrationMenu() {
		this.props.app.RegistrationMenu.setState({ formOpen: true });
	}
	render() {
		var app = this.props.app;
		var formClass = app.state.currentUser ? 'd-none' : '';
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		var dropdownItems = [
			{ value: 'options', name: 'User Options', onSelect: this.openUserOptions },
			{ value: 'logout', name: 'Log out', onSelect: this.logUserOut }
		];
		return (
			<div className={this.props.wrapperClass}>
				<form onSubmit={this.sendLogin} className={formClass}>
					<span className="lg-up mr-2">[<a className="text-white anchor no-underline" onClick={this.openRegistrationMenu}>New User? Register!</a>]</span>
					<span className="md-down mr-2">[<a className="text-white anchor no-underline" onClick={this.openRegistrationMenu}>Register</a>]</span>
					<label className="mr-2">Login:</label>
					<input type="text" value={this.state.userInput} onChange={this.updateUserInput} size="14" className="mr-2" name="username" placeholder="Username" />
					<input type="password" value={this.state.passInput} onChange={this.updatePassInput} name="password" size="14" className="mr-2" placeholder="Password" />
					<input type="submit" value="Go" size="3" onClick={this.sendLogin} />
				</form>
				<div className={userClass} id="nav-user-menu">
					<span className="username mr-2">{username} is playing.</span>
					<a className="text-white anchor no-underline" onClick={this.toggleUserDropdown}>
						<Icon icon="user" fill="white" stroke="white" height="1rem" width="1rem" additionalClasses="mr-3" id="user-icon" />
					</a>
					<div id="user-dropdown-wrapper" className={this.state.userDropdownOpen ? '' : 'd-none'}>
						<DataBrowser label={null} items={dropdownItems} view="list" id="user-dropdown" />
					</div>
				</div>
			</div>
		);
	}
}

export default LoginForm;
