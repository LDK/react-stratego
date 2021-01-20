import React, { Component } from 'react';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import {time2TimeAgo} from '../Helpers.js';
import {time2Date} from '../Helpers.js';

class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			uid: null,
			formOpen: false,
			wins: 0,
			losses: 0,
			forfeits: 0,
			join_date: null,
			last_active: null,
			headtohead: null,
			recentGames: null
		};
		this.id = "userProfile-modal";
		props.app.userProfile = this;
	}
	componentDidMount() {

	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var app = this.props.app;
		var joinDate = '';
		var lastActive = '';
		if (this.state.join_date) {
			joinDate = time2Date(this.state.join_date);
		}
		if (this.state.last_active) {
			lastActive = time2TimeAgo(this.state.last_active * 1000);
		}
		var userProfile = (
			<div id="user-profile">
				<h2>Profile: {this.state.username}</h2>
				<p><label>Joined: </label> <span>{joinDate}</span></p>
				<p><label>Last Active: </label> <span>{lastActive}</span></p>
				<p>{this.state.wins} wins, {this.state.losses} losses with {this.state.forfeits} forfeits</p>
				<div className="mb-4">
					<h5>Recently Finished Games</h5>
					<DataBrowser items={this.state.recentGames} afterKeys={{ winner: 'Winner: %this%' }} afterParentheses={true} view="list" callback={app.loadGame} id="profileRecentGameList" deleteEmpty={true} hideIfEmpty={true} />
				</div>
				<div className="mb-3">
					<h5>Head-to-Head History</h5>
					<h6>Advantage: {this.state.advantage.replace('[%you]',app.state.currentUser.username)}</h6>
					<DataBrowser sublabel={"Advantage: "+this.state.advantage} items={this.state.headtohead} afterKeys={{ winner: 'Winner: %this%' }} afterParentheses={true} view="list" callback={app.loadGame} id="profileHTHGameList" deleteEmpty={true} hideIfEmpty={true} />
				</div>
			</div>
		);
		return (
			<MenuModal 
				parentMenu={this}
				content={userProfile}
				styles={{ backgroundColor: 'var(--water)' }}
				additionalClasses={"text-white"}
			/>
		);
	}
}

export default UserProfile;
