import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object,
			open: PropTypes.bool,
			onKeyDown: PropTypes.func,
			closeButton: PropTypes.any,
			content: PropTypes.element,
			closeCallback: PropTypes.func,
			styles: PropTypes.object,
			height: PropTypes.string,
			width: PropTypes.string,
			additionalClasses: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.state = {};
		this.onKeyDown = this.onKeyDown.bind(this);
		props.app.activeModal = this;
	}
	onKeyDown(event) {
		if (!this.props.onKeyDown) {
			return;
		}
		return this.props.onKeyDown(event);
	}
	componentDidMount(){
		this.modalContainer.focus();
	}
	componentWillUnmount(){
		this.props.app.activeModal = null;
	}
	render() {
		const content = this.props.content;
		var props = this.props;
		var wrapperClass =  props.additionalClasses + " modal-wrapper";
		if (props.height) {
			wrapperClass += " height-"+props.height;
		}
		if (props.width) {
			wrapperClass += " width-"+props.width;
		}
		var closeButton = '';
		if (props.closeButton) {
			closeButton = (<a className="close-button button" onClick={props.closeCallback}>X</a>);
		}
		var styles = {};
		if (props.styles) {
			styles = props.styles;
		}
		return (
			<section ref={(section) => { this.modalContainer = section; }} className={"modal-container " + (props.open ? ' open' : '')} onKeyDown={this.onKeyDown}>
				<div className="modal-overlay" />
				<div className={wrapperClass} style={styles}>
					{closeButton}
					{content}
				</div>
			</section>
		)
	}
}

export default Modal;
