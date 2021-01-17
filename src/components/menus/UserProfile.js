import React, { Component } from 'react';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';

class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username || '',
			formOpen: false
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
		var userProfile = (
			<div id="user-profile">
				<label>Profile: {this.state.username}</label>
			</div>
		);
		return (
			<MenuModal 
				parentMenu={this}
				content={userProfile}
				styles={{ backgroundColor: 'var(--water)' }}
				additionalClasses={"text-black"}
			/>
		);
	}
}

export default UserProfile;
