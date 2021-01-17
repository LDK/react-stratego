import React, { Component } from 'react';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username || '',
			formOpen: false,
			wins: 0,
			losses: 0,
			forfeits: 0,
			join_date: null,
			last_active: null
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
			joinDate = new Date(this.state.join_date * 1000).toString('M-d-Y');
		}
		if (this.state.last_active) {
			lastActive = new Date(this.state.last_active * 1000).toString();
		}

		var userProfile = (
			<div id="user-profile">
				<h2>Profile: {this.state.username}</h2>
				<p><label>Joined: </label> <span>{joinDate}</span></p>
				<p><label>Last Active: </label> <span>{lastActive}</span></p>
				<p>{this.state.wins} wins, {this.state.losses} losses with {this.state.forfeits} forfeits</p>
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
