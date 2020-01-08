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
		this.focusUserSearch = this.focusUserSearch.bind(this);
		this.updateUserSearch = this.updateUserSearch.bind(this);
		this.updatePastOpp = this.updatePastOpp.bind(this);
		this.changeOpponentSelectMode = this.changeOpponentSelectMode.bind(this);
		props.app.newGameMenu = this;
	}
	focusUserSearch(focused){
		if (this.state.formOpen && focused) {
			this.setState({opponentSelectMode: 'name' });
		}
	}
	focusPastOpps(focused){
		if (this.state.formOpen && focused) {
			this.setState({opponentSelectMode: 'past' });
		}
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
		if (!uid || !userKey || !opponentId) {
			return [];
		}
		var formData = new FormData();
		formData.append('user_id',uid);
		formData.append('userKey',userKey);
		var mode = this.state.opponentSelectMode;
		var menu = this;
		formData.append('opponent_id',opponentId);
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
		var app = this.props.app;
		var opponentIndicator = null;
		if (this.state.opponentFound) {
			opponentIndicator = (<p className="opponentFound">Opponent Found!</p>);
		}
		var newGameForm = (
			<form action={app.state.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<h3 className="mb-2">Select an opponent!</h3>
				<div onClick={() => this.focusPastOpps(true) }>
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="past" 
						checked={this.state.opponentSelectMode == 'past'} 
						onChange={this.changeOpponentSelectMode} 
					/>
					<DataBrowser 
						label="Select from Past Opponents:" 
						items={app.pastOpponents} 
						view="select" 
						id="userOpponentList" 
						callback={this.updatePastOpp} 
					/>
				</div>
				<div onClick={() => this.focusUserSearch(true)} className="mr-2">
					<input type="radio" name="selectMode" className="float-left mr-3 mt-1" 
						value="name"
						checked={this.state.opponentSelectMode == 'name'} 
						onChange={this.changeOpponentSelectMode}
					/>
					<Autosuggest 
						inputSize="22"
						value={this.state.userSearch}
						onSelect={this.updateUserSearch}
						onChange={this.updateUserSearch}
						inputName="nameSearch"
						placeholder="Username"
						suggestions={app.usernames ? Object.values(app.usernames) : []}
					/>
				</div>
				{opponentIndicator}
				<input type="submit" value="Submit" size="3" onClick={this.handleSubmit} disabled={!this.state.opponentId} />
			</form>
		);
		if (!this.state.formOpen) {
			return null;
		}
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
