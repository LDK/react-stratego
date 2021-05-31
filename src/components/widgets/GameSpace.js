import React from 'react';
import PropTypes from 'prop-types';

class GameSpace extends React.Component {
	static get propTypes() {
		return {
			passable: PropTypes.bool,
			x: PropTypes.number,
			y: PropTypes.number,
			territory: PropTypes.string,
			spaceKey: PropTypes.any,
			id: PropTypes.number,
			children: PropTypes.element
		};
	}
	constructor(props) {
		super(props);
		this.passable = this.props.passable || true;
		this.x = props.x;
		this.y = props.y;
		this.state = {
			extraClass: ''
		};
	}
	render() {
		return (
			<div id={"gameSpace-"+this.props.id} 
				data-col={this.props.x} 
				data-row={this.props.y} 
				data-territory={this.props.territory}
				className={"gameSpace col " + (this.props.spaceKey || '') + (this.props.passable ? ' passable' : '') + ' ' + this.state.extraClass}
			>
				{this.props.children}
			</div>
		)
	}
}

export default GameSpace;
