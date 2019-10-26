import React, { Component } from 'react';

class DataBrowser extends React.Component {
	constructor(props) {
		super(props);
		this.callback = this.callback.bind(this);
		this.renderSelect = this.renderSelect.bind(this);
		this.renderList = this.renderList.bind(this);
		this.state = {
			value: props.value || null,
			label: props.label || '',
			items: props.items || []
		};
	}
	callback(event) {
		if (event.target.hasAttribute('data-key')) {
			var val = event.target.getAttribute('data-key');
		}
		else {
			var val = event.target.value;
		}
		this.setState({value: val});
		if (this.props.callback) {
			this.props.callback(val);
		}
		this.render();
	}
	renderSelect(elId,wrapperClass) {
		var cb = this.callback;
		const dataItems = this.props.items.map((opt,i) => 
			<option key={i} value={opt.id}>
				{opt.name}
			</option>
		);
		return (
			<div className={wrapperClass}>
				<label>{this.state.label}</label>
				<select onChange={cb} id={elId} value={this.state.value || ''}>
					{dataItems}
				</select>
			</div>
		)
	}
	renderList(elId,wrapperClass) {
		var cb = this.callback;
		const dataItems = this.props.items.map((opt,i) => 
			<li key={i}>
				<a onClick={ (e) => { cb(e) }} href="javascript:;" data-key={opt.id}>{opt.name}</a>
			</li>
		);
		return (
			<div className={wrapperClass}>
				<label>{this.state.label}</label>
				<ul id={elId}>
					{dataItems}
				</ul>
			</div>
		)
	}
	render() {
		var view = this.props.view || 'list';
		var wrapperClass = "dataBrowser" +  (this.props.disabled ? ' disabled ' : ' ') + (this.props.className || '');
		var elId = this.props.id || '';
		switch(view) {
			case 'select':
				return this.renderSelect(elId,wrapperClass);
				break;
			case 'list':
			default:
				return this.renderList(elId,wrapperClass);
				break;
		}
	}
}

export default DataBrowser;
