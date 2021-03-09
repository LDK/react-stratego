import React from 'react';
import { isMobile } from "react-device-detect";

function HelpBar({ app, game }) {
	var tileRack = app.tileRack;
	var board = app.gameBoard;
	var hbar = '';
	var helpText = false;
	var helpSubtext = '';
	if (game.state.placementMode == 'click' && !!board.state.selectedSpace) {
		helpText = 'Click any space to move the selected tile there.';
		helpSubtext = 'Click the rack to remove this tile from the board.';
	}
	else if (game.state.placementMode == 'click' && tileRack.remaining) {
		var placementAction = isMobile ? 'Tap' : 'Click';
		if (game.selectedRank) {
			helpText = (
				<div>{ placementAction + ' a square to place a ' }
					<div className={"d-inline-block position-relative tileFace rank-"+game.selectedRank}></div>
				</div>
			);
		}
		else {
			helpText = placementAction + ' any ' + app.tileRack.playerColor + ' tile to select that piece.';
		}
	}
	if (helpText) {
		hbar = (
			<div className="d-table d-lg-none position-fixed w-100" id="help-bar" style={{ height:'56px', backgroundColor: 'rgba(1, 1, 1, 0.75)', bottom: 0, left: 0 }}>
				<span className="d-table-cell w-100 p-0 m-0 text-white text-center" style={{ bottom: 0, left: 0, height:'48px', fontSize:'24px', backgroundColor: 'rgba(1,1,1,.75)', verticalAlign: 'middle' }}>{helpText}</span>
			</div>
		);
	}
	return hbar;
}

export default HelpBar;
