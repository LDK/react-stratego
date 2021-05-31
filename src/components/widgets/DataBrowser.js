import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

class DataBrowser extends React.Component {
	static get propTypes() {
		return {
			value: PropTypes.any,
			id: PropTypes.string,
			view: PropTypes.string,
			label: PropTypes.string,
			labelClass: PropTypes.string,
			className: PropTypes.string,
			items: PropTypes.array,
			links: PropTypes.array,
			parentObj: PropTypes.object,
			refName: PropTypes.string,
			beforeText: PropTypes.string,
			callback: PropTypes.func,
			afterCallback: PropTypes.func,
			afterArgKey: PropTypes.any,
			onSelect: PropTypes.func,
			emptyOption: PropTypes.string,
			deleteEmpty: PropTypes.bool,
			afterLinks: PropTypes.array,
			afterKeys: PropTypes.object,
			afterKeysSep: PropTypes.string,
			afterParentheses: PropTypes.bool,
			beforeLinks: PropTypes.bool,
			hideIfEmpty: PropTypes.bool,
			disabled: PropTypes.bool,
			emptyVal: PropTypes.any,
			additionalClasses: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.callback = this.callback.bind(this);
		this.afterCallback = this.afterCallback.bind(this);
		this.renderSelect = this.renderSelect.bind(this);
		this.renderList = this.renderList.bind(this);
		this.linkList = this.linkList.bind(this);
		this.state = {
			value: props.value || null,
			label: props.label || '',
			items: props.items || []
		};
		if (props.parentObj && props.refName) {
			props.parentObj[props.refName] = this;
		}
		else if (props.parentObj) {
			props.parentObj.dataBrowser = this;
		}
	}
	callback(event) {
		let val;
		if (event.target.hasAttribute('data-key')) {
			val = event.target.getAttribute('data-key');
		}
		else {
			val = event.target.value;
		}
		this.setState({value: val});
		if (this.props.callback) {
			this.props.callback(val);
		}
		this.render();
	}
	afterCallback() {
		// if (event.target.hasAttribute('data-key')) {
		// 	var val = event.target.getAttribute('data-key');
		// }
		// else {
		// 	var val = event.target.value;
		// }
		// this.setState({value: val});
		// if (this.props.callback) {
		// 	this.props.callback(val);
		// }
		// this.render();
	}
	renderSelect(elId,wrapperClass) {
		var cb = this.callback;
		var items = this.props.items;
		if (this.props.emptyOption) {
			items = cloneDeep(this.props.items);
			items.unshift({ id: null, name: this.props.emptyOption });
		}
		const dataItems = items.map((opt,i) => 
			<option key={i} value={opt.id || this.props.emptyVal || ''} onClick={this.props.onSelect || null}>
				{opt.name}
			</option>
		);
		return (
			<div className={wrapperClass}>
				<label className={this.props.labelClass}>{this.state.label}</label>
				<select onChange={cb} id={elId} value={this.state.value || ''}>
					{dataItems}
				</select>
			</div>
		)
	}
	linkList(property, refVal, items, itemIndex) {
		const linkItems = this.props[property].map((link,i) => 
			<li key={i} className={link.className}>
				<a className="anchor underline" onClick={() => link.action(link.argKey ? items[itemIndex][link.argKey] : refVal)}>{link.label}</a>
			</li>
		);
		return (
			<div className="d-inline">
				[<ul className="link-list px-1">{linkItems}</ul>]
			</div>
		);
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
		// @SOMEDAY: Make afterLinks, beforeLinks, afterText, beforeText all combinable.
		let dataItems;
		if (this.props.afterLinks) {
			dataItems = items.map((opt,i) => 
				<li key={i}>
					{opt.name} {this.linkList('afterLinks',opt.id,items,i)}
				</li>
			);
		}
		else if (this.props.beforeLinks) {
			dataItems = items.map((opt,i) => 
				<li key={i}>
					{opt.name} {this.linkList('beforeLinks',opt.id)}
				</li>
			);
		}
		else if (this.props.beforeText) {
			dataItems = items.map((opt,i) => 
				<li key={i}>
					{this.props.beforeText} {opt.name}
				</li>
			);
		}
		else {
			var content = null;
			dataItems=[];
			for (var j in items) {
				var opt = items[j];
				if (opt.buttons) {
					var buttons = opt.buttons.map((btn,j) => 
						<li key={j} className="mr-3 py-2">
							<a className="button" data-type={btn.type || "undefined"} data-mode={btn.mode || "undefined"} data-id={btn.id || "null"} onClick={btn.action}>{btn.label}</a>
						</li>
					);
					content = (
						<div data-key={opt.id}>
							<span>{opt.name}</span>
							<ul className="item-buttons">{buttons}</ul>
						</div>
					);
				}
				else {
					var afterText = '';
					if (this.props.afterKeys) {
						var separator = this.props.afterKeysSep || ',';
						var ct = 0;
						for (var key in this.props.afterKeys) {
							if (opt[key]) {
								if (ct) {
									afterText += separator + ' ';
								}
								ct++;
								afterText += this.props.afterKeys[key].replace('%this%',opt[key]) + ' ';
							}
							afterText = afterText.trim();
						}
						if (afterText.length) {
							var afterPrefix = '', afterSuffix = '';
							if (this.props.afterParentheses) {
								afterPrefix = '(';
								afterSuffix = ')';
							}
							afterText = ' ' + afterPrefix + afterText + afterSuffix;
						}
					}
					content = (<a onClick={opt.onSelect || cb} className="anchor underline" data-key={opt.id}>{opt.name}</a>);
					if (this.props.afterCallback) {
						afterText = (
							<a className="anchor" onClick={() => this.props.afterCallback(opt[this.props.afterArgKey || key])}>{afterText}</a>
						);
					}
				}
				dataItems.push(
					<li key={j} className={opt.className}>
					{content}{afterText}
					</li>
				);
			}
		}
		return (
			<div className={wrapperClass} id={this.props.id || null}>
				<label className={this.props.labelClass}>{this.state.label}</label>
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
		let rv;
		switch(view) {
			case 'select':
				rv = this.renderSelect(elId,wrapperClass);
				break;
			case 'list':
			default:
				rv = this.renderList(elId,wrapperClass);
				break;
		}
		return rv;
	}
}

export default DataBrowser;
