import React from 'react';
import PropTypes from 'prop-types';
import UserLink from '../widgets/UserLink.js';
import HamburgerMenu from 'react-hamburger-menu';
import './MobileMenu.scss';
class MobileMenu extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object,
			menuOpen: PropTypes.bool
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: props.menuOpen || false
		};
		this.id = "mobile-menu";
		this.toggleMenu = this.toggleMenu.bind(this);
		props.app.MobileMenu = this;
	}
	toggleMenu() {
		this.setState({ menuOpen: !this.state.menuOpen });
	}
	render() {
		var app = this.props.app;
		var uid = app.state.currentUser.user_id || null;
		let menuItems = [];
		if (this.state.menuOpen) {
			menuItems.push(
				<a key="1" className="anchor underline text-white d-block" onClick={() => { this.toggleMenu(); app.openRulesModal(); }}>View Rules</a>
			);
			menuItems.push(
				<a key="2" className="anchor underline text-white d-block" onClick={() => { this.toggleMenu(); app.openNewGameMenu(); }}>New Game</a>
			);
			menuItems.push(
				<UserLink key="3" app={app} className="anchor underline text-white d-block" user={{ id: uid, name: 'My Profile' }} />
			);
		}
		var mobileMenu = (
			<div id={this.id} className={this.state.menuOpen ? 'active' : null}>
				<HamburgerMenu
					isOpen={this.state.menuOpen}
					menuClicked={this.toggleMenu}
					width={18}
					height={15}
					strokeWidth={1}
					rotate={0}
					color='black'
					borderRadius={0}
					animationDuration={0.5}
				/>
				<section className="mobile-menu-items pt-4">
					{menuItems}
				</section>
			</div>
		);
		return mobileMenu;
	}
}

export default MobileMenu;
