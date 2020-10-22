import React, { Component } from 'react';
import DataBrowser from '../widgets/DataBrowser.js';
import RegistrationMenu from '../menus/Registration.js';
import UserStatus from '../widgets/UserStatus.js';
import Icon from '../widgets/Icon.js';
import { isMobile } from "react-device-detect";

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
		var containerClass = isMobile ? 'container-fluid' : 'container';
		if (games.active && games.active.length) {
			gameBrowser = (
				<div className="col-4 col-lg-3">
					<DataBrowser parentObj={this} refName='gameBrowser' label="Game:" labelClass="mr-2 md-up" emptyOption='- Select a Game -' items={games.active} view="select" callback={this.gameChange} id="gameList" value={this.state.activeGame ? this.state.activeGame.props.id : null} />
				</div>
			);
		}
		return (
			<div id="top-row">
				<div className="navigation py-3 py-sm-1 py-md-3">
					<div className={containerClass + " mx-auto"}>
						<div className="row no-gutters">
							<div className="d-inline-block pr-3 pt-1">
								<a className="anchor no-underline" onClick={this.goHome}>
									<Icon icon="home" fill="white" width="1rem" height="1rem" />
								</a>
							</div>
							{gameBrowser}
							<UserStatus wrapperClass="col px-0 text-right" loginCallback={app.setCurrentUser} app={app} />
							<RegistrationMenu app={app} />
						</div>
					</div>
				</div>
				{dropdown}
			</div>
		)
	}
}

export default Navigation;
