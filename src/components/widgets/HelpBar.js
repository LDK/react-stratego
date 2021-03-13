import React from 'react';

function HelpBar({ app, game, textClass, wrapperClass, textStyles, wrapperStyles }) {
	var tileRack = app.tileRack;
	var board = app.gameBoard;
	var hbar = '';
	var helpText = false;
	var helpSubtext = '';
	if (wrapperClass === undefined) {
		wrapperClass = "d-table";
	}
	if (textClass === undefined) {
		textClass = "d-table-cell w-100 p-0 m-0 text-white text-center";
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
	if (helpText) {
		hbar = (
			<div className={wrapperClass} id="help-bar" style={wrapperStyles}>
				<span className={textClass} style={textStyles}>
					{helpText}
					{helpSubtext}
				</span>
			</div>
		);
	}
	return hbar;
}

export default HelpBar;
