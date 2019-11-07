import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class NewGameMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opponentSelectMode: 'past',
			userSearch: '',
			formOpen: false,
			opponentId: null
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
	updateUserSearch(event) {
		this.setState({userSearch: event.target.value});
	}
	updatePastOpp(value) {
		this.setState({opponentId: value});
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
		switch (mode) {
			case 'past':
				formData.append('opponent_id',opponentId);
			break;
			case 'name':
				console.log("This doesn't work yet!");
			break;
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
		var app = this.props.app;
		var newGameForm = (
			<form action={app.state.gameServer+"new_game"} onSubmit={this.handleSubmit}>
				<h3 className="mb-2">Select an opponent!</h3>
				<input type="radio" name="selectMode" className="float-left mr-3 mt-1" value="past" checked={this.state.opponentSelectMode == 'past'} onChange={this.changeOpponentSelectMode} />
				<div onClick={() => this.focusPastOpps(true) }>
					<DataBrowser label="Select from Past Opponents:" items={app.state.pastOpponents} view="select" id="userOpponentList" callback={this.updatePastOpp} />
				</div>
				<input type="radio" name="selectMode" className="float-left mr-3 mt-1" value="name" checked={this.state.opponentSelectMode == 'name'} onChange={this.changeOpponentSelectMode} />
				<input type="text" onClick={() => this.focusUserSearch(true) } value={this.state.userSearch} onChange={this.updateUserSearch} size="22" className="mr-2" name="nameSearch" placeholder="Username" />
			<br />
				<input type="submit" value="Submit" size="3" onClick={this.handleSubmit} />
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
