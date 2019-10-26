import React, { Component } from 'react';

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const content = this.props.content;
		var parentObj = this.props.parentObj;
		var props = this.props;
		var wrapperClass =  props.additionalClasses + " modal-wrapper";
		return (
			<section className={"modal-container " + (props.open ? ' open' : '')}>
				<div className="modal-overlay" />
				<div className={wrapperClass}>
					{content}
				</div>
			</section>
		)
	}
}

export default Modal;
