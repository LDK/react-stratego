import React from 'react';
import UserLink from './UserLink.js';
import OptionIndicator from './OptionIndicator.js';
import TileRack from '../sections/TileRack.js';
import HelpBar from './HelpBar.js';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function InfoPanel({ game, app, playerColor }) {
	let panel = '';
	let mobileTileRack = '';
	let tileRack = <TileRack game={game} app={app} />;
	if (app.isMobile) {
		mobileTileRack = <TileRack game={game} app={app} />;
		tileRack = '';
	}
	if (app.gameLoading) {
		panel = (
			<Col xs={{ span: 12, order: 3 }} lg={{ span: 3, order: 2 }} className="px-0 tileRack-col bg-md-white mt-lg-3 mr-xl-auto game-loading">
			</Col>
		);
	}
	else if (!game.state.started) {
		panel = (
			<Col xs={{ span: 12, order: 3 }} lg={{ span: 3, order: 2 }} className="px-0 tileRack-col bg-md-white mt-lg-3 mr-xl-auto">
				<Row noGutters={true} className="pt-1 pt-md-3">
					<OptionIndicator id="placementMode" className="col-12 px-0 mb-md-3" layout="horizontal" 
						value={game.state.placementMode}
						disableArrows={true}
						ulClass="text-center px-0 pt-3 pt-md-0 mb-2 mb-md-0"
						liClass="col-4 col-md-6 p-0 mx-auto h-50"
						disabled={game.state.players[playerColor].ready}
						labelClass="px-2 px-md-3"
						listLabelClass="pb-2 md-up"
						options={[
							{key: 'Click & Place', value: 'click' },
							{key: 'Keyboard', value: 'keyboard', exclude: app.isMobile },
							{key: 'Quick Load', value: 'quick', onSelect: game.openQuickLoadModal},
							{key: 'Erase', value: 'erase' }
						]} 
						name="placementMode" 
						label="Placement Mode"
						callback={game.modeChange} 
					/>
					{mobileTileRack}
					<Col xs={12} className="mx-auto">
						{tileRack}
					</Col>
				</Row>
			</Col>
		);
	}
	else {
		var turnLabel, winLabel;
		if (game.state.turn && game.state.status && game.state.status != 'done') {
			turnLabel = (<h6 className="text-center mx-auto my-3 col-12 pt-3">Current Turn: <br className="sm-down" /><span className={"text-"+game.state.turn}>{game.state.players[game.state.turn].name}</span></h6>);
		}
		else if (game.state.status && game.state.status == 'done') {
			var winnerName, winnerClass;
			if (game.state.winner_uid == game.props.starter) {
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
			<Col xs={{ span: 12, order: 1 }} sm="4" lg={{ span: 3, order: 2 }} className="px-0 info-panel text-center mt-lg-3 mr-xl-auto h-sm-auto">
				<Row noGutters={true}>
					<Col xs={4} sm={12}>
						{winLabel}
						{turnLabel}
					</Col>
					<Col xs={8} sm={12}>
						<Row noGutters={true}>
							<h4 className="mx-auto d-sm-block mt-3 my-sm-3 col-12">Captured</h4>
							<Col xs={6} className="px-3">
								<span className="text-red">
									<UserLink app={app} user={game.state.players.red} className="anchor" />
								</span>
								<div className="captured-tiles player-red mt-3 md-up">
									{captured.red.length ? captured.red : 'None'}
								</div>
								<div className="captured-tiles player-red sm-down">
									{captured.red.length}
								</div>
							</Col>
							<Col xs={6} className="px-3">
								<span className="text-blue">
									<UserLink app={app} user={game.state.players.blue} className="anchor" />
								</span>
								<div className="captured-tiles player-blue mt-3 md-up">
									{captured.blue.length ? captured.blue : 'None'}
								</div>
								<div className="captured-tiles player-blue sm-down">
									{captured.blue.length}
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<HelpBar game={game} app={app} wrapperClass={"d-none d-sm-table w-100"} wrapperStyles={{ height: '8rem' }} />
				<div className="d-none">
					<TileRack game={game} app={app} />
				</div>
			</Col>
		);
	}
	return panel;

}

export default InfoPanel;
