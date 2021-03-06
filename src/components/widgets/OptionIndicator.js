import React from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';

class OptionIndicator extends React.Component {
	static get propTypes() {
		return {
			value: PropTypes.any,
			game: PropTypes.object,
			disableArrows: PropTypes.bool,
			disabled: PropTypes.bool,
			hidden: PropTypes.bool,
			callback: PropTypes.func,
			layout: PropTypes.string,
			label: PropTypes.string,
			ulClass: PropTypes.string,
			liClass: PropTypes.string,
			labelClass: PropTypes.string,
			listLabelClass: PropTypes.string,
			name: PropTypes.string,
			options: PropTypes.array,
			className: PropTypes.string,
			id: PropTypes.any
		};
	}
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
			opt.exclude ? null : (
				<li className={props.liClass+" "+opt.className || ''} key={i} onClick={opt.onSelect} data-tip={opt.tooltip}>
					<label className={props.labelClass}>
						<p className="mt-3 mb-0">{opt.key}</p>
						<input type="radio" defaultChecked={opt.value === state.value}
						tabIndex="-1" value={opt.value} name={props.name} disabled={props.disabled} onClick={cb} />
						<span className="checkmark"></span>
					</label>
				</li>
			)
		);
		var listClass = props.ulClass + " " + layout;
		var wrapperClass = "optionIndicator text-center" +  (props.disabled ? ' disabled ' : ' ') + (this.props.className || '');
		if (props.hidden) {
			wrapperClass += ' d-none';
		}
		return (
			<div className={wrapperClass} id={props.id} onKeyDown={this.onKeyDown}>
				<label className={props.listLabelClass}>{this.state.label}</label>
				<ul className={listClass}>
					{radios}
				</ul>
				<ReactTooltip />
			</div>
		)
	}
}

// ========================================

export default OptionIndicator;
