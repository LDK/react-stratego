import React from 'react';
import PropTypes from 'prop-types';
import MenuModal from '../widgets/MenuModal.js';
import cloneDeep from 'lodash/cloneDeep';
import { debug } from '../Helpers.js';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class UserOptionsMenu extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object
		};
	}
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
		this.id = 'user-options-modal';
		this.saveOptions = this.saveOptions.bind(this);
		this.updateUsernameInput = this.updateUsernameInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.updateNewPassInput = this.updateNewPassInput.bind(this);
		this.updateNewPass2Input = this.updateNewPass2Input.bind(this);
		this.updateEmailInput = this.updateEmailInput.bind(this);
		this.toggleInvitesAvailable = this.toggleInvitesAvailable.bind(this);
		this.toggleRandomAvailable = this.toggleRandomAvailable.bind(this);
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
	toggleInvitesAvailable() {
		this.setState({invitesAvailable: !this.state.invitesAvailable});
	}
	toggleRandomAvailable() {
		this.setState({randomAvailable: !this.state.randomAvailable});
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
				// if (res.error) {
				// 	if (res.error == 'username-taken') {
				//
				// 	}
				// 	if (res.error == 'email-taken') {
				//
				// 	}
				// }
				if (!res.error) {
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
			debug('Request failed', error);
		});
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var state = this.state;
		const OptionsForm = (
			<form onSubmit={this.saveOptions}>
				<h3 className="mt-0">USER OPTIONS</h3>
				<p className="">Edit your user profile:</p>
				<hr />
				<Container fluid={true} className="px-0">
					<Row noGutters={true}>
						<Col xs={12} md={4}>
							<label className="mr-2 small">Username:</label>
						</Col>
						<Col xs={12} md={8} className="mb-2">
							<input type="text" value={state.usernameInput} onChange={this.updateUsernameInput} size="24" className="small" name="username" placeholder="Username" />
						</Col>
						<Col xs={12} md={4}>
							<label className="mr-2 small">E-mail Address:</label>
						</Col>
						<Col xs={12} md={8}>
							<input type="text" value={state.emailInput} onChange={this.updateEmailInput} size="24" className="small" name="email" placeholder="E-mail Address" />
						</Col>
						<Col xs={12} className="mt-4">
							<label className="small d-block">Current Password (Required if changing password):</label>
							<input type="password" onChange={this.updatePassInput} name="current-password" size="24" className="small" placeholder="Current Password" />
						</Col>
						<Col xs={12} className="mt-3">
							<label className="small d-block">New Password (Both fields must match):</label>
							<input type="password" value={state.newPassInput} onChange={this.updateNewPassInput} name="new-password" size="24" className="small" /><br />
							<input type="password" value={state.newPass2Input} onChange={this.updateNewPass2Input} name="new-password2" size="24" className="small" />
						</Col>
						<Col xs={12} className="mt-4">
							<input type="checkbox" name="invite-available" checked={state.invitesAvailable} onChange={this.toggleInvitesAvailable} />
							<label className="small ml-2">Available for Game Invites</label>
						</Col>
						<Col xs={12}>
							<input type="checkbox" name="random-available" checked={state.randomAvailable} onChange={this.toggleRandomAvailable} />
							<label className="small ml-2">Available to Be Selected As Random Opponent</label>
						</Col>
						<Col xs={12} className="mt-4">
							<input type="submit" value="Save Options" size="3" className="go-button text-white float-right" onClick={this.saveOptions} 
								disabled={
									!state.usernameInput ||
									!state.emailInput ||
									(state.newPassInput && state.newPassInput != state.newPass2Input)
								}
							/>
						</Col>
					</Row>
				</Container>
			</form>
		);
		return (
			<MenuModal 
				parentMenu={this}
				height="auto"
				width="small"
				content={OptionsForm}
				styles={{ backgroundColor: 'var(--blue-light)' }}
				additionalClasses={"text-black"}
			/>
		);
	}
}

export default UserOptionsMenu;
