import React from 'react';
import PropTypes from 'prop-types';

class Icon extends React.Component {
	static get propTypes() {
		return {
			id: PropTypes.string,
			height: PropTypes.string,
			width: PropTypes.string,
			stroke: PropTypes.string,
			fill: PropTypes.string,
			icon: PropTypes.string.isRequired,
			additionalClasses: PropTypes.string,
			app: PropTypes.object.isRequired
		};
	}
	constructor(props) {
		super(props);
		this.svgSource = this.svgSource.bind(this);
		this.getPaths = this.getPaths.bind(this);
	}
	getPaths(paths) {
		var output = [];
		for (var i in paths) {
			const d = paths[i];
			output.push(<path key={i} d={d} />)
		}
		return output;
	}
	svgSource(options) {
		if (!options || !options.icon || !this.props.app.Config) {
			return null;
		}
		const icon = options.icon;
		const iconInfo = this.props.app.Config.Icons ? this.props.app.Config.Icons[icon] : null;
		if (!iconInfo) { return null; }
		const width = options.width || iconInfo.width;
		const height = options.height || iconInfo.height;
		const viewBox = options.viewBox || iconInfo.viewBox;
		const paths = this.getPaths(iconInfo.paths);
		delete options.width;
		delete options.height;
		delete options.viewBox;
		const group = (<g {...options}>{paths}</g>);
		return (
			<svg version="1.1" id={"icon-"+icon} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				width={width} height={height} viewBox={viewBox} xmlSpace="preserve">
				{group}
			</svg>
		);
	}
	render() {
		var options = {
			width: this.props.width || null,
			height: this.props.height || null,
			stroke: this.props.stroke || null,
			fill: this.props.fill || null,
			icon: this.props.icon
		}
		const svg = this.svgSource(options);
		var wrapperClass =  this.props.additionalClasses + " icon-wrapper";
		var id = this.props.id || null;
		return (
			<span className={wrapperClass} id={id}>
				{svg}
			</span>
		)
	}
}

export default Icon;
