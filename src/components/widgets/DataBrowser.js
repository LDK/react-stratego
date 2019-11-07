import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';

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
		var items = this.props.items;
		if (this.props.emptyOption) {
			items = cloneDeep(this.props.items);
			items.unshift({ id: null, name: this.props.emptyOption });
		}
		const dataItems = items.map((opt,i) => 
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
		var items = this.props.items;
		if (this.props.deleteEmpty) {
			for (var i in items) {
				if (!items[i].name) {
					delete items[i];
				}
			}
		}
		var dataItems = null;
		if (this.props.afterLink) {
			dataItems = items.map((opt,i) => 
				<li key={i}>
					{opt.name} <a onClick={cb} className="anchor underline" data-key={opt.id}>{this.props.afterLink}</a>
				</li>
			);
		}
		else if (this.props.beforeLink) {
			 dataItems = items.map((opt,i) => 
				<li key={i}>
					<a onClick={cb} className="anchor underline" data-key={opt.id}>{this.props.beforeLink}</a> {opt.name}
				</li>
			);
		}
		else {
			 dataItems = items.map((opt,i) => 
				<li key={i}>
					<a onClick={cb} className="anchor underline" data-key={opt.id}>{opt.name}</a>
				</li>
			);
		}
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
		if (this.props.hideIfEmpty && (!this.props.items || !this.props.items.length)) {
			return null;
		}
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
