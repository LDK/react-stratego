import React from 'react';
import PropTypes from 'prop-types';
import {keyCodes} from '../Helpers.js';
import Modal from './Modal.js';

class ModalMenu extends React.Component {
	static get propTypes() {
		return {
			parentMenu: PropTypes.object,
			content: PropTypes.any,
			styles: PropTypes.object,
			height: PropTypes.string,
			width: PropTypes.string,
			additionalClasses: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.closeForm = this.closeForm.bind(this);
	}
	closeForm() {
		if (this.props.parentMenu.closeForm) {
			this.props.parentMenu.closeForm();
			return;
		}
		this.props.parentMenu.setState({ formOpen: false });
	}
	onKeyDown (e) {
		if (!e.keyCode) { return; }
		switch (e.keyCode) {
			case keyCodes['esc']:
				this.closeForm();
			break;
		}
	}
	render() {
		var props = this.props;
		const content = props.content;
		var app = props.parentMenu.props.app;
		var styles = {};
		if (props.styles) {
			styles = props.styles;
		}
		return (
			<Modal 
				id={props.parentMenu.id}
				app={app}
				content={content}
				height={props.height || 'medium'}
				width={props.width || 'medium'}
				open={props.parentMenu.state.formOpen}
				closeButton={true}
				closeCallback={this.closeForm}
				onKeyDown={this.onKeyDown} 
				styles={styles}
				additionalClasses={"p-5 "+props.additionalClasses}
			/>
		)
	}
}

export default ModalMenu;
