import React, { Component } from 'react';

class OptionIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.callback = this.callback.bind(this);
		this.state = {
			value: props.value || null,
			label: props.label || '',
			layout: props.layout || 'horizontal'
		};
		this.onKeyDown = this.onKeyDown.bind(this);
	}
	callback(event) {
		var val = event.currentTarget.value;
		this.setState({value: val});
		if (this.props.callback) {
			this.props.callback(event.currentTarget.value);
		}
		this.render();
	}
	onKeyDown (e) {
		if (this.props.disableArrows) {
			if (e.keyCode < 41 && e.keyCode > 36)
				e.preventDefault();
		}
	}
	render() {
		var props = this.props;
		var state = this.state;
		var cb = this.callback;
		var layout = state.layout;
		const radios = this.props.options.map((opt,i) => 
			<li className={props.liClass+" "+opt.className} key={i}>
				<label className={props.labelClass}>{opt.key}
					<input type="radio" defaultChecked={opt.value === state.value}
					tabIndex="-1" value={opt.value} name={props.name} disabled={props.disabled} onClick={cb} />
					<span className="checkmark"></span>
				</label>
			</li>
		);
		var listClass = props.ulClass + " " + layout;
		var wrapperClass = "optionIndicator text-center" +  (props.disabled ? ' disabled ' : ' ') + (this.props.className || '');
		return (
			<div className={wrapperClass} id={props.id} onKeyDown={this.onKeyDown}>
				<label>{this.state.label}</label>
				<ul className={listClass}>
					{radios}
				</ul>
			</div>
		)
	}
}

// ========================================

export default OptionIndicator;
