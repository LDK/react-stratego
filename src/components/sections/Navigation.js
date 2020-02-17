import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInput: '',
			passInput: '',
			pass2Input: '',
			emailInput: '',
			regFormOpen: false,
			activeGame: props.app.state.activeGame
		};
		this.sendLogin = this.sendLogin.bind(this);
		this.gameChange = this.gameChange.bind(this);
		this.updateUserInput = this.updateUserInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.updatePass2Input = this.updatePass2Input.bind(this);
		this.updateEmailInput = this.updateEmailInput.bind(this);
		this.goHome = this.goHome.bind(this);
		props.app.nav = this;
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
	sendLogin(event) {
		event.preventDefault();
		var app = this.props.app;
		var state = cloneDeep(this.state);
		var formData = new FormData();
		var props = this.props;
		var nav = this;
		formData.append('username',state.userInput);
		formData.append('password',state.passInput);
		window.fetch(app.gameServer+'login', {
			method: 'POST', 
			body: formData
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				if (res.error) {
					if (res.error == 'no-user') {
						nav.setState({regFormOpen: true});
						nav.render();
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
	logout(event) {
		event.preventDefault();
	}
	gameChange(id) {
		var app = this.props.app;
		if (!id) {
			app.setState({ activeGame: null });
			return;
		}
		app.loadGame(id);
	}
	goHome() {
		var app = this.props.app;
		app.setState({ activeGame: null });
		if (app.nav && app.nav.gameBrowser) {
			app.nav.gameBrowser.setState({value: null});
		}
	}
	render() {
		var app = this.props.app;
		var formClass = app.state.currentUser ? 'd-none' : '';
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		var gameBrowser = '';
		var games = app.state.games;
		if (games.length) {
			gameBrowser = <DataBrowser parentObj={this} refName='gameBrowser' label="Game:" emptyOption='- Select a Game -' items={games} view="select" callback={this.gameChange} id="gameList" value={this.state.activeGame ? this.state.activeGame.props.id : null} />
		}
		return (
			<div className="navigation row py-3 px-3">
				<a className="anchor no-underline" onClick={this.goHome}>Home</a>
				<div className="col-3 col-md-4 col-lg-6">
					{gameBrowser}
				</div>
				<div className="col-8 col-md-7 col-lg-5 text-right">
					<form onSubmit={this.sendLogin} action={app.gameServer+'login'} className={formClass}>
						<label className="mr-2">Register/Login</label>
						<input type="text" value={this.state.userInput} onChange={this.updateUserInput} size="14" className="mr-2" name="username" placeholder="Username" />
						<input type="password" value={this.state.passInput} onChange={this.updatePassInput} name="password" size="14" className="mr-2" placeholder="Password" />
						<input type="submit" value="Go" size="3" onClick={this.sendLogin} />
					</form>
					<div className={userClass}>
						<span className="username mr-2">{username} is playing.</span>
						[<a className="text-white anchor no-underline" onClick={this.props.logoutCallback}>Log out</a>]
					</div>
				</div>
			</div>
		)
	}
}

export default Navigation;
