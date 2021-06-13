import React from 'react';
import PropTypes from 'prop-types';
import "./Tabs.scss";

class Tabs extends React.Component {
	static get propTypes() {
		return {
			contents: PropTypes.array,
			showArrows: PropTypes.bool,
			app: PropTypes.object,
			wrapperClasses: PropTypes.string,
			defaultTab: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			openTab: props.defaultTab || (props.contents[0] ? props.contents[0].id : null)
		};
		this.tabClick = this.tabClick.bind(this);
	}
	tabClick(event) {
		let tabName = null;
		if (!event.target.classList.contains("tab")) {
			tabName = event.target.parentElement.attributes.rel.value;
		}
		else {
			tabName = event.target.attributes.rel.value;
		}
		this.setState({ openTab: tabName });
	}
	render() {
		let tabLinks = [];
		let activeContent = null;
		let tabContents = {};
		for (var i in this.props.contents) {
			activeContent = this.props.contents[i];
			tabLinks.push((
				<li rel={activeContent.id} key={activeContent.id} onClick={this.tabClick} className={"tab"+(this.state.openTab == activeContent.id ? ' active' : '')}>
					<label>{ activeContent.label }</label>
				</li>
			));
			tabContents[activeContent.id] = activeContent.content;
		}
		return (
			<div className="container-fluid tabs {wrapperClasses} h-100">
				<div className="row no-gutters">
					<ul className="tab-list col-12">
						{ tabLinks }
					</ul>
				</div>
				<div className="content row no-gutters">
					{ tabContents[this.state.openTab] }
				</div>
			</div>
		);
	}
}

export default Tabs;