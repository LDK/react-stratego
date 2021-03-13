import React from 'react';
import UserLink from './UserLink.js';
import OptionIndicator from './OptionIndicator.js';
import TileRack from '../sections/TileRack.js';
import HelpBar from './HelpBar.js';

function InfoPanel({ game, app, playerColor }) {
	var panel = '';
	if (!game.state.started) {
		panel = (
			<div className="col-12 col-lg-3 px-0 tileRack-col order-3 order-lg-2 bg-md-white mt-lg-3 mr-xl-auto">
				<div className="row no-gutters pt-1 pt-md-3">
					<OptionIndicator id="placementMode" className="col-12 px-0 lg-up mb-3" layout="horizontal" 
						value={game.state.placementMode}
						disableArrows={true}
						ulClass="text-center px-0 mt-3"
						liClass="col-4 col-md-6 px-0 mx-2 pt-3 mx-auto"
						disabled={game.state.players[playerColor].ready}
						labelClass="px-2 px-md-3"
						listLabelClass="pb-2"
						options={[
							// {key: 'Drag & Drop', value: 'drag', className: 'lg-up', tooltip: 'Drag & drop tiles from the rack to the board'},
							{key: 'Tap & Place', value: 'click', className: 'md-down', tooltip: 'Tap the tile on the rack you want to place, then tap the space(s) where you want to place it'},
							{key: 'Click & Place', value: 'click', className: 'lg-up', tooltip: 'Click the tile on the rack you want to place, then click the space(s) where you want to place it'},
							{key: 'Keyboard', value: 'keyboard', className: 'lg-up', tooltip: 'Use the arrow keys to select a square and place tiles by typing the rank'},
							{key: 'Quick Load', value: 'quick', tooltip: 'Choose from a list of preset tile layouts', onSelect: game.openQuickLoadModal},
							{key: 'Erase', value: 'erase', tooltip: 'Click to remove tiles you have placed' }
						]} 
						name="placementMode" label="Placement Mode"
						callback={game.modeChange} 
					/>
					<div className="col-12 mx-auto">
						<TileRack game={game} app={app} />
					</div>
				</div>
			</div>
		);
	}
	else {
		var turnLabel, winLabel;
		if (game.state.turn && game.state.status && game.state.status != 'done') {
			turnLabel = (<h6 className="text-center mx-auto my-3">Current Turn: <br className="sm-down" /><span className={"text-"+game.state.turn}>{game.state.players[game.state.turn].name}</span></h6>);
		}
		else if (game.state.status && game.state.status == 'done') {
			var winnerName, winnerClass;
			if (game.state.winner_uid == starterUid) {
				winnerName = game.props.starterName;
				winnerClass = 'text-blue';
			}
			else {
				winnerName = game.props.opponentName;
				winnerClass = 'text-red';
			}
			var winnerInfo = { name: winnerName, id: game.state.winner_uid};
			var winnerLink = (<UserLink app={app} user={winnerInfo} className={"anchor "+winnerClass} />);
			winLabel = (<h5 className="text-center mx-auto mt-4">{winnerLink} is the winner!</h5>);
		}
		var captured = { red: [], blue: [] };
		for (var color in game.state.captured) {
			for (var rank in game.state.captured[color]) {
				captured[color].push(game.state.captured[color][rank]);
			}
		}
		panel = (
			<div className="sm-up col-4 col-lg-3 px-0 gameStatus-col bg-md-white text-center order-1 order-lg-2 mt-lg-3 mr-xl-auto">
				<div className="row no-gutters">
					{winLabel}
					{turnLabel}
					<h4 className="mx-auto d-block my-3 col-12">Captured</h4>
					<div className="col-6 px-3">
						<span className="text-red">
							<UserLink app={app} user={game.state.players.red} className="anchor" />
						</span>
						<div className="captured-tiles player-red mt-3">
							{captured.red.length ? captured.red : 'None'}
						</div>
					</div>
					<div className="col-6 px-3">
						<span className="text-blue">
							<UserLink app={app} user={game.state.players.blue} className="anchor" />
						</span>
						<div className="captured-tiles player-blue mt-3">
							{captured.blue.length ? captured.blue : 'None'}
						</div>
					</div>
				</div>
				<HelpBar game={game} app={app} wrapperClass={"d-none d-md-table w-100"} wrapperStyles={{ height: 'auto' }} />
				<div className="d-none">
					<TileRack game={game} app={app} />
				</div>
			</div>
		);
	}
	return panel;

}

export default InfoPanel;
