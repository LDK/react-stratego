import React from 'react';
import PropTypes from 'prop-types';

class UserLink extends React.Component {
	static get propTypes() {
		return {
			user: PropTypes.object,
			app: PropTypes.object,
			id: PropTypes.number,
			className: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
	}
	render() {
		if (!this.props.user || !this.props.user.id || !this.props.user.name) {
			return '';
		}
		var app = this.props.app;
		return (
			<a className={"userLink " + this.props.className} id={this.props.id} onClick={() => app.openUserProfile(this.props.user.id)}>
			{this.props.user.name}
			</a>
		)
	}
}

export default UserLink;
