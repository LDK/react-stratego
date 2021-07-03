import React from 'react';
import PropTypes from 'prop-types';
import "./Tabs.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
			<Container fluid={true} className="tabs {wrapperClasses} h-100">
				<Row noGutters={true}>
					<Col xs={12} as="ul" className="tab-list">
						{ tabLinks }
					</Col>
				</Row>
				<Row className="content row no-gutters">
					{ tabContents[this.state.openTab] }
				</Row>
			</Container>
		);
	}
}

export default Tabs;