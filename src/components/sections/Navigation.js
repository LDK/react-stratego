import React, { Component } from 'react';
import DataBrowser from '../widgets/DataBrowser.js';
import RegistrationMenu from '../menus/Registration.js';
import LoginForm from '../widgets/LoginForm.js';
import Icon from '../widgets/Icon.js';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeGame: props.app.state.activeGame
		};
		this.gameChange = this.gameChange.bind(this);
		this.goHome = this.goHome.bind(this);
		props.app.nav = this;
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
		app.gameOpened = false;
		if (app.nav && app.nav.gameBrowser) {
			app.nav.gameBrowser.setState({value: null});
		}
	}
	render() {
		var app = this.props.app;
		var gameBrowser = '';
		var games = app.state.games;
		if (games.length) {
			gameBrowser = <DataBrowser parentObj={this} refName='gameBrowser' label="Game:" emptyOption='- Select a Game -' items={games} view="select" callback={this.gameChange} id="gameList" value={this.state.activeGame ? this.state.activeGame.props.id : null} />
		}
		return (
			<div className="navigation row py-3 px-3">
				<a className="anchor no-underline" onClick={this.goHome}>
					<Icon icon="home" fill="white" width="1rem" height="1rem" />
				</a>
				<div className="col-3 col-md-4 col-lg-3">
					{gameBrowser}
				</div>
				<LoginForm wrapperClass="pl-0 col-8 col-md-7 col-lg-8 text-right" loginCallback={app.setCurrentUser} app={app} />
				<RegistrationMenu app={app} />
			</div>
		)
	}
}

export default Navigation;
