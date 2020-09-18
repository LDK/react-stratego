import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import Autosuggest from '../widgets/Autosuggest.js';
import {keyCodes} from '../Helpers.js';

class NewGameMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opponentSelectMode: 'past',
			userSearch: '',
			formOpen: false,
			opponentId: null,
			opponentFound: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getModeHelpText = this.getModeHelpText.bind(this);
		this.focusModeOption = this.focusModeOption.bind(this);
		this.updateUserSearch = this.updateUserSearch.bind(this);
		this.updatePastOpp = this.updatePastOpp.bind(this);
		this.changeOpponentSelectMode = this.changeOpponentSelectMode.bind(this);
		this.closeForm = this.closeForm.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		props.app.newGameMenu = this;
	}
	closeForm() {
		this.setState({ formOpen: false });
	}
	focusModeOption(mode) {
		if (mode == this.state.opponentSelectMode || !this.state.formOpen) {
			// Redundant
			return;
		}
		var stateChanges = {
			opponentSelectMode: mode
		};
		var opponentId = this.state.opponentId;
		if (this.state.opponentSelectMode == 'past' 
			|| mode == 'open'
			|| mode == 'join'
			|| mode == 'name'
			) {
			opponentId = null;
		}
		if (mode == 'past') {
			opponentId = this.pastOpponents.state.value;
			if (opponentId == '(none)') {
				opponentId = null;
			}
		}
		if (mode != 'name') {
			if (this.autoSuggest) {
				this.autoSuggest.setState({ userInput : '' });
			}
			stateChanges.userSearch = '';
		}
		if (opponentId == null) {
			stateChanges.opponentFound = false;
		}
		else {
			stateChanges.opponentFound = true;
		}
		stateChanges.opponentId = opponentId;
		this.setState(stateChanges);
	}
	updateUserSearch(value) {
		var opponentId = this.props.app.usernameLookup[value] || null;
		this.setState({
			userSearch: value,
			opponentId: opponentId,
			opponentFound: !!opponentId
		});
	}
	updatePastOpp(value) {
		var opponentId = parseInt(value) || null;
		this.setState({ 
			opponentId: opponentId, 
			opponentFound: !!opponentId 
		});
	}
	changeOpponentSelectMode(event) {
		this.setState({opponentSelectMode: event.target.value});
	}
	handleSubmit(event) {
		event.preventDefault();
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var opponentId = this.state.opponentId;
		var mode = this.state.opponentSelectMode;
		if (!uid || !userKey) {
			return [];
		}
		if (mode == 'join') {
			this.setState({ formOpen: false });
			this.props.app.JoinGameMenu.setState({ formOpen: true });
			return;
		}
		var payload = { user_id: uid, userKey: userKey, mode: mode };
		var menu = this;
		if (opponentId) {
			payload.opponent_id = opponentId;
		}
		window.fetch(app.gameServer+'new_game', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gameData = JSON.parse(text);
				menu.setState({ formOpen: false });
				app.getRequests();
				app.getGames();
				if (gameData.gameId && !isNaN(gameData.gameId)) {
					app.loadGame(gameData.gameId);
				}
			});
		});
	}
	onKeyDown (e) {
		if (!e.keyCode) { return; }
		switch (e.keyCode) {
			case keyCodes['esc']:
				this.closeForm();
			break;
		}
	}
	getModeHelpText() {
		switch (this.state.opponentSelectMode) {
			case 'past':
				return "Choose from a list of your past opponents.  Avenge a past loss or reassert your dominance!";
			break;
			case 'join':
				return "Join a random open game someone else has started.";
			break;
			case 'open':
				return "Start a game anyone can join.  You can arrange your tiles while you wait for an opponent.";
			break;
			case 'name':
				return "Search a list of available players to find your next opponent!";
			break;
			case 'random':
				return "Feeling lucky?  Challenge a random opponent!";
			break;
		}
		return '';
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
		var helpText = this.getModeHelpText();
		var newGameForm = (
			<form action={app.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<div className="container-fluid p-0" style={{ backgroundColor: '#3880be', height: '100%' }} id="new-game-menu">
					<div className="row">
						<div className="col-12 pl-3">
							<h3 className="text-white mt-0">NEW GAME</h3>
							<p className="text-white">Find an opponent:</p>
						</div>
						<div className="col-7 px-3">
							<div className="w-100 game-mode-options bg-white p-3" style={{minHeight: '240px', border:'1px solid black'}}>
								<div onClick={() => this.focusModeOption('past')} className="mb-3">
									<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
										value="past" 
										checked={this.state.opponentSelectMode == 'past'} 
										onChange={this.changeOpponentSelectMode} 
									/>
									<DataBrowser 
										label="Select from Past Opponents:" 
										items={app.pastOpponents} 
										emptyOption='- Select Username -'
										emptyVal='(none)'
										view="select" 
										id="userOpponentList" 
										parentObj={this}
										refName='pastOpponents'
										callback={this.updatePastOpp} 
									/>
								</div>
								<div onClick={() => this.focusModeOption('name')} className="mb-3">
									<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
										value="name"
										checked={this.state.opponentSelectMode == 'name'} 
										onChange={this.changeOpponentSelectMode}
									/>
									<label>User Search:</label>
									<div className="autosuggest-wrapper">
										<Autosuggest 
											inputSize="22"
											value={this.state.userSearch}
											onSelect={this.updateUserSearch}
											onChange={this.updateUserSearch}
											inputName="nameSearch"
											placeholder="Username"
											parentObj={this}
											suggestions={app.usernames ? Object.values(app.usernames) : []}
										/>
									</div>
								</div>
								<div onClick={() => this.focusModeOption('open')} className="">
									<label>Create an Open Game</label>
									<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
										value="open"
										checked={this.state.opponentSelectMode == 'open'} 
										onChange={this.changeOpponentSelectMode}
									/>
								</div>
								<div onClick={() => this.focusModeOption('join')} className="">
									<label>Join an Open Game</label>
									<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
										value="join"
										checked={this.state.opponentSelectMode == 'join'} 
										onChange={this.changeOpponentSelectMode}
									/>
								</div>
								<div onClick={() => this.focusModeOption('random')} className="">
									<label>Random Opponent</label>
									<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
										value="random"
										checked={this.state.opponentSelectMode == 'random'} 
										onChange={this.changeOpponentSelectMode}
									/>
								</div>
							</div>
						</div>
						<div className="col-5 pr-3">
							<div className="w-100 game-mode-help-text px-3 py-2" style={{backgroundColor:'#c2ab3a', height:'124px', border: '1px solid black'}}>
								<p>{helpText}</p>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-6 text-left">
							<span className="pt-2 mt-3 d-block text-white text-center" style={{fontSize:"18px", width:"172px", height:"44px", background: "#e65f00", border: "1px solid black"}}>{opponentIndicator}</span>
						</div>
						<div className="col-6 text-right" style={{textAlign: 'right'}}>
							<input className="mt-3 d-inline-block text-white text-center new-game-submit" type="submit" value="START GAME" style={{}} />
						</div>
					</div>
				</div>
			</form>
		);
		return (
		<Modal 
			id="newGame-modal"
			app={app}
			content={newGameForm}
			open={true}
			onKeyDown={this.onKeyDown} 
			closeButton={true}
			closeCallback={this.closeForm}
			styles={{ backgroundColor: 'rgb(56, 128, 190)' }}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default NewGameMenu;
