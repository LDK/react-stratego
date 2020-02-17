import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import Autosuggest from '../widgets/Autosuggest.js';

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
		this.focusModeOption = this.focusModeOption.bind(this);
		this.updateUserSearch = this.updateUserSearch.bind(this);
		this.updatePastOpp = this.updatePastOpp.bind(this);
		this.changeOpponentSelectMode = this.changeOpponentSelectMode.bind(this);
		props.app.newGameMenu = this;
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
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		formData.append('mode',mode);
		var menu = this;
		if (opponentId) {
			formData.append('opponent_id',opponentId);
		}
		window.fetch(app.gameServer+'new_game', {
			method: 'POST', 
			body: formData
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				menu.setState({ formOpen: false });
				app.getRequests();
			});
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
		var newGameForm = (
			<form action={app.state.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<h3 className="mb-2">Select an opponent!</h3>
				<div onClick={() => this.focusModeOption('past')}>
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
				<div onClick={() => this.focusModeOption('name')} className="mr-2">
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="name"
						checked={this.state.opponentSelectMode == 'name'} 
						onChange={this.changeOpponentSelectMode}
					/>
					<label>User Search:</label>
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
				<div onClick={() => this.focusModeOption('open')} className="mr-2">
					<label>Create an Open Game</label>
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="open"
						checked={this.state.opponentSelectMode == 'open'} 
						onChange={this.changeOpponentSelectMode}
					/>
				</div>
				<div onClick={() => this.focusModeOption('join')} className="mr-2">
					<label>Join an Open Game</label>
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="join"
						checked={this.state.opponentSelectMode == 'join'} 
						onChange={this.changeOpponentSelectMode}
					/>
				</div>
				<div onClick={() => this.focusModeOption('random')} className="mr-2">
					<label>Random Opponent</label>
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="random"
						checked={this.state.opponentSelectMode == 'random'} 
						onChange={this.changeOpponentSelectMode}
					/>
				</div>
				{opponentIndicator}
				<input type="submit" value="Submit" size="3" onClick={this.handleSubmit} disabled={
					!this.state.opponentId && 
					this.state.opponentSelectMode != 'open' &&
					this.state.opponentSelectMode != 'join' &&
					this.state.opponentSelectMode != 'random'
				} />
			</form>
		);
		return (
		<Modal 
			id="newGame-modal"
			content={newGameForm}
			open={true}
			additionalClasses={"p-5 text-black"}
		/>
		);
	}
}

export default NewGameMenu;
