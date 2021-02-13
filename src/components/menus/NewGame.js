import React, { Component } from 'react';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import Autosuggest from '../widgets/Autosuggest.js';
import UserLink from '../widgets/UserLink.js';

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
		this.id = "newGame-modal";
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getModeHelpText = this.getModeHelpText.bind(this);
		this.focusModeOption = this.focusModeOption.bind(this);
		this.updateUserSearch = this.updateUserSearch.bind(this);
		this.updatePastOpp = this.updatePastOpp.bind(this);
		this.getOpenGames = this.getOpenGames.bind(this);
		this.openMenu = this.openMenu.bind(this);
		this.getPastOpponents = this.getPastOpponents.bind(this);
		this.changeOpponentSelectMode = this.changeOpponentSelectMode.bind(this);
		props.app.newGameMenu = this;
	}
	componentDidMount() {
		this.getPastOpponents();
		this.props.app.getUsernames();
	}
	openMenu() {
		this.getPastOpponents();
		this.getOpenGames();
		this.props.app.getUsernames();
		this.setState({ formOpen: true });
	}
	getOpenGames() {
		var app = this.props.app;
		if (!app.state.currentUser) {
			return false;
		}
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(app.gameServer+'open_games', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var gms = JSON.parse(text);
				var games = [];
				for (var gameId in gms) {
					var title = gms[gameId].title;
					var oppName = gms[gameId].starter_name;
					var gameEntry = {
						id: gameId,
						name: title,
						opponent: oppName
					}
					if (gameEntry && gameEntry.id) {
						games.push(gameEntry);
					}
				}
				app.openGames = games;
			});
		});
	}
	getPastOpponents() {
		var app = this.props.app;
		if (!app.state.currentUser) {
			return false;
		}
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(app.gameServer+'past_opponents', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var opps = JSON.parse(text);
				var opponents = [];
				for (var oppId in opps) {
					var oppName = opps[oppId];
					var oppEntry = {
						id: oppId,
						name: oppName
					}
					if (oppEntry && oppEntry.id) {
						opponents.push(oppEntry);
					}
				}
				// app.setState({ pastOpponents: opponents });
				app.pastOpponents = opponents;
			});
		});
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
			this.getOpenGames();
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
		var startText = 'START GAME';
		if (this.state.opponentSelectMode == 'join' || this.state.opponentSelectMode == 'random') {
			startText = 'FIND GAME';
		}
		var viewProfile = null;
		if (this.state.opponentFound) {
			opponentIndicator = (
				<span className="pt-2 mt-3 d-block text-white text-center" style={{fontSize:"18px", width:"172px", height:"44px", background: "#e65f00", border: "1px solid black"}}>
					<p className="opponentFound">Opponent Found!</p>
				</span>
			);
			viewProfile = (
				<UserLink app={app} className="anchor underline text-white d-block" user={{ id: this.state.opponentId, name: 'View Profile' }} />
			);
		}
		var helpText = this.getModeHelpText();
		var newGameForm = (
			<form action={app.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<div className="container-fluid p-0" id="new-game-menu">
					<div className="row">
						<div className="col-12 pl-3">
							<h3 className="text-white mt-0">NEW GAME</h3>
							<p className="text-white">Find an opponent:</p>
						</div>
						<div className="col-12 col-md-7 px-3">
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
						<div className="col-12 col-sm-5 pr-3">
							<div className="w-100 game-mode-help-text md-up px-3 py-2" style={{backgroundColor:'#c2ab3a', minHeight:'148px', border: '1px solid black'}}>
								<p>{helpText}</p>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-sm-6 text-left">{opponentIndicator}{viewProfile}</div>
						<div className="col-12 col-sm-6 text-right" style={{textAlign: 'right'}}>
							<input className="mt-3 d-inline-block text-white text-center go-button" type="submit" value={startText} style={{}} 
								disabled={
									!this.state.opponentId &&
									this.state.opponentSelectMode != 'open' &&
									this.state.opponentSelectMode != 'join' &&
									this.state.opponentSelectMode != 'random'
								}
							/>
						</div>
					</div>
				</div>
			</form>
		);
		return (
			<MenuModal 
				parentMenu={this}
				content={newGameForm}
				styles={{ backgroundColor: 'var(--water)' }}
				additionalClasses={"text-black"}
			/>
		);
	}
}

export default NewGameMenu;
