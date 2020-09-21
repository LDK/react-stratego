import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class JoinGameMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formOpen: false,
			gameId: null,
			gameFound: false,
			parentMenu: props.app.newGameMenu
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.updateChosen = this.updateChosen.bind(this);
		props.app.JoinGameMenu = this;
	}
	componentDidMount() {
		this.state.parentMenu.getOpenGames();
	}
	handleSubmit(event) {
		event.preventDefault();
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var opponentId = this.state.opponentId;
		if (!uid || !userKey) {
			return [];
		}
		var payload = { user_id: uid, userKey: userKey };
		var gameId = this.state.gameId;
		var menu = this;
		if (gameId) {
			payload.game_id = gameId;
		}
		window.fetch(app.gameServer+'join_game', {
			method: 'POST',
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				menu.setState({ formOpen: false });
				app.getRequests();
				app.getGames();
				app.loadGame(gameId);
			});
		});
	}
	updateChosen(value) {
		var gameId = !isNaN(parseInt(value)) ? parseInt(value) : null;
		this.setState({ 
			gameId: gameId,
			gameFound: !isNaN(gameId)
		});
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var app = this.props.app;
		var opponentIndicator = null;
		if (this.state.opponentFound) {
			opponentIndicator = (<p className="opponentFound">Opponent Found!</p>);
		}
		var JoinGameForm = (
			<form action={app.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<h3 className="mb-2">Select a game to join!</h3>
				<div>
					<DataBrowser 
						label="Open Games:" 
						items={app.openGames} 
						emptyOption='- Select A Game -'
						emptyVal={null}
						view="select" 
						id="openGameList" 
						parentObj={this}
						// refName='pastOpponents'
						callback={this.updateChosen}
					/>
				</div>
				<input type="submit" value="Submit" size="3" onClick={this.handleSubmit} disabled={!this.state.gameFound} />
			</form>
		);
		return (
		<Modal 
			id="JoinGame-modal"
			app={app}
			content={JoinGameForm}
			open={true}
			height="medium"
			width="small"
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default JoinGameMenu;
