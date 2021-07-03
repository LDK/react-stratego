import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../widgets/Icon.js';
import cloneDeep from 'lodash/cloneDeep';
import DataBrowser from '../widgets/DataBrowser.js';
import { debug } from '../Helpers.js';

class UserStatus extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object,
			open: PropTypes.bool,
			loginCallback: PropTypes.func,
			wrapperClass: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			userInput: '',
			passInput: '',
			notifications: {},
			userDropdownOpen: !!props.open,
			newest_notification_ts: null
		};

		this.openUserOptions = this.openUserOptions.bind(this);
		this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
		this.openUserDropdown = this.openUserDropdown.bind(this);
		this.closeUserDropdown = this.closeUserDropdown.bind(this);
		this.markVisibleSeen = this.markVisibleSeen.bind(this);
		this.processNotifications = this.processNotifications.bind(this);
		this.notificationAction = this.notificationAction.bind(this);
		this.notificationButton = this.notificationButton.bind(this);
		
		this.close = this.close.bind(this);
		props.app.UserStatus = this;
		props.app.nav.subItems.UserStatus = this;
		this.getNotifications = this.getNotifications.bind(this);
	}
	componentDidMount() {
		this.getNotifications();
		this.notificationPoll = setInterval( this.getNotifications, 15000 );
	}
	componentWillUnmount() {
		clearInterval(this.notificationPoll);
	}
	close() {
		this.closeUserDropdown();
	}
	markVisibleSeen() {
		if (!this.state.notifications.unseen) {
			return;
		}
		var notifications = cloneDeep(this.state.notifications);
		var ids = false;
		for (var i in notifications.notifications) {
			var notification = notifications.notifications[i];
			if (!notification.seen_ts) {
				if (!ids) {
					ids = [];
				}
				ids.push(notification.id);
				notifications.unseen--;
				notification.seen_ts = Date.now();
			}
		}
		if (!ids) {
			return;
		}
		this.setState({ notifications: notifications });
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		var payload = { user_id: uid, userKey: userKey, notification_ids: ids };
		window.fetch(app.gameServer+'markSeen', {
			method: 'POST',
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				return res;
			});
		}).catch(function(error) {
			debug('Request failed', error);
		});
	}
	openUserOptions() {
		var app = this.props.app;
		app.nav.closeAll();
		app.UserOptions.setState({ formOpen: true });
	}
	toggleUserDropdown() {
		var isOpen = this.state.userDropdownOpen;
		if (isOpen) {
			this.closeUserDropdown();
		}
		else {
			this.openUserDropdown();
		}
	}
	openUserDropdown() {
		this.setState({ userDropdownOpen: true });
		this.props.app.nav.setState({ dropdownOpen: true });
	}
	closeUserDropdown() {
		this.markVisibleSeen();
		this.setState({ userDropdownOpen: false });
		this.props.app.nav.setState({ dropdownOpen: false });
	}
	getNotifications() {
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var userMenu = this;
		var payload = { user_id: uid, userKey: userKey };
		window.fetch(app.gameServer+'notifications', {
			method: 'POST', 
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function(data){
			data.text().then(function(text) {
				if (!text.length) {
					return;
				}
				var notifications = JSON.parse(text);
				if (notifications.newest_ts > userMenu.state.newest_notification_ts) {
					userMenu.setState({ notifications: notifications });
				}
			});
		});
	}
	notificationButton(event) {
		var id = parseInt(event.target.attributes['data-id'].value);
		var type = event.target.attributes['data-type'].value;
		var action = event.target.attributes['data-mode'].value;
		if (this.props.app.debugNotifications) {
			debug('notification button',action,type,id);
		}
		if (!this.notificationRows || !this.notificationLookup[id]) {
			return;
		}
		var data = this.notificationLookup[id].data;
		if (this.props.app.debugNotifications) {
			debug('notification data',data);
		}
		if (type == 'game' && data.game_id) {
			switch (action) {
				case 'accept': 
					this.props.app.acceptInvite(data.game_id,data.id);
				break;
				case 'decline': 
					this.props.app.declineInvite(data.game_id,data.id);
				break;
				case 'view': 
					this.props.app.loadGame(data.game_id);
				break;
			}
		}
		else if (type == 'user' && data.user_id) {
			switch (action) {
				case 'view': 
					this.props.app.openUserProfile(data.user_id);
				break;
			}
		}
		this.close();
	}
	notificationAction(data) {
		if (this.props.app.debugNotifications) {
			debug('notification action',data);
		}
		if (!data.link_type) {
			this.close();
			return;
		}
		switch(data.link_type) {
			case 'game':
				if (!data.game_id) {
					this.close();
					return;
				}
				this.props.app.loadGame(data.game_id);
			break;
			case 'user':
				if (!data.game_id) {
					this.close();
					return;
				}
				this.props.app.loadGame(data.game_id);
			break;
		}
		this.close();
	}
	processNotifications() {
		this.notificationRows = [];
		this.notificationLookup = {};
		if (this.state.notifications.notifications) {
			for (var i in this.state.notifications.notifications) {
				var notification = this.state.notifications.notifications[i];
				var additional = JSON.parse(notification.additional);
				additional.id = notification.id;
				var text = notification.text;
				for (var key in additional) {
					text = text.replace('[%'+key+']',additional[key]);
				}
				var classes = 'notification ';
				classes += notification.seen_ts ? 'seen' : 'unseen';
				var browserItem = { 
					value: 'notification-'+notification.id, 
					name: text, 
					className: classes,
					id: notification.id,
					data: additional
				};
				browserItem.onSelect = (() => this.notificationAction(browserItem));
				this.notificationRows.push(browserItem); 
				this.notificationLookup[notification.id] = browserItem;
				if (notification.category == 'invite-sent' && additional.game_id) {
					browserItem.buttons = [
						{ action: this.notificationButton, mode: 'accept', type: 'game', label: 'Accept', id: parseInt(notification.id) },
						{ action: this.notificationButton, mode: 'decline', type: 'game', id: parseInt(notification.id), label: 'Decline' },
						{ action: this.notificationButton, mode: 'view', type: 'user', label: 'User Profile', id: parseInt(notification.id) }
					];
				}
				else if (notification.category == 'open-joined' || notification.category == 'invite-accepted') {
					browserItem.buttons = [
						{ action: this.notificationButton, mode: 'view', type: 'game', id: parseInt(notification.id), label: 'Open Game' },
						{ action: this.notificationButton, mode: 'view', type: 'user', id: parseInt(notification.id), label: 'User Profile' }
					];
				}
				else if (notification.category == 'invite-declined') {
					browserItem.buttons = [
						{ action: this.notificationButton, mode: 'view', type: 'user', id: parseInt(notification.id), label: 'User Profile' }
					];
				}
			}
		}
	}
	render() {
		var props = this.props;
		var app = props.app;
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		var dropdownItems = [
			{ value: 'options', name: 'User Options', onSelect: this.openUserOptions },
			{ value: 'logout', name: 'Log out', onSelect: this.logUserOut }
		];
		var notificationCounter = null;
		this.processNotifications();
		dropdownItems = this.notificationRows.concat(dropdownItems);
		if (this.state.notifications.unseen) {
			notificationCounter = (<span className="notification-counter">{this.state.notifications.unseen}</span>)
		}
		var loginLinks = (
			<span className="mr-2">
				[<a className="text-white anchor no-underline" onClick={app.openRegistrationMenu}>Register</a>/
				<a className="text-white anchor no-underline" onClick={app.openLoginMenu}>Login</a>]
			</span>
		);
		var userMenu = (
			<span className={userClass} id="nav-user-menu">
				<a className="anchor mr-3 md-up" onClick={app.openRulesModal}>
					Rules
				</a>
				<span className="username mr-2 sm-up">
					<p className="md-up d-md-inline">|&nbsp; </p>
					<a className="anchor" onClick={() => app.openUserProfile(app.state.currentUser.user_id)}>{username}</a> is playing.
				</span>
				<a className="text-white anchor no-underline" onClick={this.toggleUserDropdown} id="user-anchor">
					<Icon app={app} icon="user" fill="white" stroke="white" height="1rem" width="1rem" id="user-icon" />
					{notificationCounter}
				</a>
				<div id="user-dropdown-wrapper" className={this.state.userDropdownOpen ? '' : 'd-none'}>
					<DataBrowser label={null} items={dropdownItems} view="list" id="user-dropdown" />
				</div>
			</span>
		);
		return (
			<div className={props.wrapperClass}>
				{loginLinks}
				{userMenu}
			</div>
		);
	}
}

export default UserStatus;
