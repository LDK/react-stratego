import React, { Component } from 'react';
import Icon from '../widgets/Icon.js';
import cloneDeep from 'lodash/cloneDeep';
import DataBrowser from '../widgets/DataBrowser.js';
import Cookies from 'universal-cookie';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInput: '',
			passInput: '',
			notifications: {},
			userDropdownOpen: !!props.open,
			newest_notification_ts: null
		};
		this.sendLogin = this.sendLogin.bind(this);
		this.updateUserInput = this.updateUserInput.bind(this);
		this.updatePassInput = this.updatePassInput.bind(this);
		this.openRegistrationMenu = this.openRegistrationMenu.bind(this);
		this.openUserOptions = this.openUserOptions.bind(this);
		this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
		this.closeUserDropdown = this.closeUserDropdown.bind(this);
		this.logUserOut = this.logUserOut.bind(this);
		this.markVisibleSeen = this.markVisibleSeen.bind(this);
		this.processNotifications = this.processNotifications.bind(this);
		this.notificationAction = this.notificationAction.bind(this);
		this.notificationButton = this.notificationButton.bind(this);
		
		this.close = this.close.bind(this);
		props.app.LoginForm = this;
		props.app.nav.subItems.LoginForm = this;
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
			});
		}).catch(function(error) {
			console.log('Request failed', error);
		});
	}
	logUserOut() {
		const cookies = new Cookies();
		cookies.remove("stratego-user");
		this.props.app.setState({currentUser: false, activeGame: null, games: []});
		this.closeUserDropdown();
	}
	updateUserInput(event) {
		this.setState({userInput: event.target.value});
		this.props.app.RegistrationMenu.setState({userInput: event.target.value});
	}
	updatePassInput(event) {
		this.setState({passInput: event.target.value});
		this.props.app.RegistrationMenu.setState({passInput: event.target.value});
	}
	openUserOptions() {
		var app = this.props.app;
		app.nav.closeAll();
		app.UserOptions.setState({ formOpen: true });
	}
	toggleUserDropdown() {
		var isOpen = this.state.userDropdownOpen;
		if (isOpen) {
			this.markVisibleSeen();
		}
		this.setState({ userDropdownOpen: !isOpen });
		this.props.app.nav.setState({ dropdownOpen: !isOpen });
	}
	closeUserDropdown() {
		this.setState({ userDropdownOpen: false });
	}
	sendLogin(event) {
		event.preventDefault();
		var app = this.props.app;
		var state = this.state;
		var props = this.props;
		var payload = { username: state.userInput, password: state.passInput };
		window.fetch(app.gameServer+'login', {
			method: 'POST',
			headers: { "Accept": "application/json", 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		.then(function(data) {
			data.text().then(function(text) {
				var res = JSON.parse(text);
				if (res.error) {
					if (res.error == 'no-user') {
						app.RegistrationMenu.setState({formOpen: true});
					}
				}
				else if (props.loginCallback) {
					props.loginCallback(res);
				}
			});
		}).catch(function(error) {
			console.log('Request failed', error);
		});
	}
	openRegistrationMenu() {
		this.props.app.RegistrationMenu.setState({ formOpen: true });
	}
	getNotifications() {
		var app = this.props.app;
		var uid = app.state.currentUser.user_id;
		var userKey = app.state.currentUser.userKey;
		if (!uid || !userKey) {
			return [];
		}
		var nav = app.nav;
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
				else {

				}
			});
		});
	}
	notificationButton(action,type,data) {
		if (type == 'game' && data.game_id) {
			switch (action) {
				case 'accept': 
					this.props.app.acceptInvite(data.game_id);
				break;
				case 'decline': 
					this.props.app.declineInvite(data.game_id);
				break;
			}
		}
		this.close();
	}
	notificationAction(data) {
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
		}
		this.close();
	}
	processNotifications() {
		var notificationRows = [];
		if (this.state.notifications.notifications) {
			for (var i in this.state.notifications.notifications) {
				var notification = this.state.notifications.notifications[i];
				var additional = JSON.parse(notification.additional);
				var text = notification.text;
				for (var key in additional) {
					text = text.replace('[%'+key+']',additional[key]);
				}
				var classes = 'notification ';
				classes += notification.seen_ts ? 'seen' : 'unseen';
				var browserItem = { 
					value: 'notification-'+notification.id, 
					name: text, 
					onSelect: () => this.notificationAction(additional),
					className: classes 
				};
				if (notification.category == 'invite-sent' && additional.game_id) {
					browserItem.buttons = [
						{ action: () => this.notificationButton('accept','game',additional), label: 'Accept' },
						{ action: () => this.notificationButton('decline','game',additional), label: 'Decline' }
					];
				}
				notificationRows.push(browserItem);
			}
		}
		return notificationRows;
	}
	render() {
		var app = this.props.app;
		var formClass = app.state.currentUser ? 'd-none' : '';
		var userClass = !app.state.currentUser ? 'd-none' : '';
		var username = app.state.currentUser.username;
		var dropdownItems = [
			{ value: 'options', name: 'User Options', onSelect: this.openUserOptions },
			{ value: 'logout', name: 'Log out', onSelect: this.logUserOut }
		];
		var notificationCounter = null;
		var notificationRows = this.processNotifications();
		dropdownItems = notificationRows.concat(dropdownItems);
		if (this.state.notifications.unseen) {
			notificationCounter = (<span className="notification-counter">{this.state.notifications.unseen}</span>)
		}
		return (
			<div className={this.props.wrapperClass}>
				<form onSubmit={this.sendLogin} className={formClass}>
					<span className="lg-up mr-2">[<a className="text-white anchor no-underline" onClick={this.openRegistrationMenu}>New User? Register!</a>]</span>
					<span className="md-down mr-2">[<a className="text-white anchor no-underline" onClick={this.openRegistrationMenu}>Register</a>]</span>
					<label className="mr-2">Login:</label>
					<input type="text" value={this.state.userInput} onChange={this.updateUserInput} size="14" className="mr-2" name="username" placeholder="Username" />
					<input type="password" value={this.state.passInput} onChange={this.updatePassInput} name="password" size="14" className="mr-2" placeholder="Password" />
					<input type="submit" value="Go" size="3" onClick={this.sendLogin} />
				</form>
				<div className={userClass} id="nav-user-menu">
					<span className="username mr-2">{username} is playing.</span>
					<a className="text-white anchor no-underline" onClick={this.toggleUserDropdown} id="user-anchor">
						<Icon icon="user" fill="white" stroke="white" height="1rem" width="1rem" additionalClasses="mr-3" id="user-icon" />
						{notificationCounter}
					</a>
					<div id="user-dropdown-wrapper" className={this.state.userDropdownOpen ? '' : 'd-none'}>
						<DataBrowser label={null} items={dropdownItems} view="list" id="user-dropdown" />
					</div>
				</div>
			</div>
		);
	}
}

export default LoginForm;
