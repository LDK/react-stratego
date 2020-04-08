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
		this.closeAll = this.closeAll.bind(this);
		this.subItems = {};
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
	closeAll() {
		for (var i in this.subItems) {
			this.subItems[i].close();
		}
		this.setState({ dropdownOpen: false })
	}
	render() {
		var app = this.props.app;
		var gameBrowser = '';
		var dropdown = (<div className={"dropdown-overlay" + (this.state.dropdownOpen ? ' open' : '')} onMouseEnter={this.closeAll} />);
		var games = app.state.games;
		if (games.active && games.active.length) {
			gameBrowser = <DataBrowser parentObj={this} refName='gameBrowser' label="Game:" labelClass="mr-2" emptyOption='- Select a Game -' items={games.active} view="select" callback={this.gameChange} id="gameList" value={this.state.activeGame ? this.state.activeGame.props.id : null} />
		}
		return (
			<div>
				<div className="navigation row py-3 px-3">
					<div className="d-inline-block px-3 pt-1">
						<a className="anchor no-underline" onClick={this.goHome}>
							<Icon icon="home" fill="white" width="1rem" height="1rem" />
						</a>
					</div>
					<div className="col-3 col-md-4 col-lg-3">
						{gameBrowser}
					</div>
					<LoginForm wrapperClass="pl-0 col-8 col-md-7 col-lg-8 text-right" loginCallback={app.setCurrentUser} app={app} />
					<RegistrationMenu app={app} />
				</div>
				{dropdown}
			</div>
		)
	}
}

export default Navigation;
