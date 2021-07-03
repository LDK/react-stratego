import React from 'react';

function HelpBar({ game, textClass, wrapperClass, textStyles, wrapperStyles }) {
	var hbar = '';
	var helpText = false;
	var helpSubtext = '';
	if (wrapperClass === undefined) {
		wrapperClass = "d-table";
	}
	if (textClass === undefined) {
		textClass = "d-table-cell w-100 p-0 m-0 text-center";
	}
	if (wrapperStyles === undefined) {
		wrapperStyles = { };
	}
	if (textStyles === undefined) {
		textStyles = { };
	}
	if (game.state.helpText) {
		helpText = game.state.helpText;
	}
	if (game.state.helpSubtext) {
		helpSubtext = (<p className="m-0 subtext">{game.state.helpSubtext}</p>);
	}
	if (!helpText) {
		wrapperClass += " transparent";
	}
	hbar = (
		<div>
			<div className={wrapperClass} id="help-bar" style={wrapperStyles}>
				<span className={textClass} style={textStyles}>
					{helpText}
					{helpSubtext}
				</span>
				<a className="text-white md-up" id="help-bar-close" onClick={game.closeHelpBar}>X</a>
			</div>
			<a className="circle-link text-white" id="help-bar-open" onClick={game.openHelpBar}>?</a>
		</div>
	);
	return hbar;
}

export default HelpBar;
