import React from 'react';
import PropTypes from 'prop-types';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import DragPiece from '../widgets/DragPiece.js';
import Row from "react-bootstrap/Row";

class QuickLoadMenu extends React.Component {
	static get propTypes() {
		return {
			app: PropTypes.object,
			game: PropTypes.object
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			selected: null,
			formOpen: false
		};
		this.selectPreset = this.selectPreset.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		props.app.gameBoard.QuickLoadMenu = this;
		this.layoutLookup = {};
		this.previousMode = 'drag';
		this.id="quickLoad-modal";
		const layouts = props.app.Config.Layouts;
		for (var i in layouts) {
			this.layoutLookup[layouts[i].id] = i;
		}
	}
	handleSubmit(tiles) {
		var app = this.props.app;
		var game = this.props.game;
		var playerColor = app.tileRack.playerColor;
		app.gameBoard.clearBoard();
		for (var i in tiles) {
			var rank = tiles[i];
			var idOffset = parseInt(i) + 1;
			if (playerColor == 'blue') {
				idOffset += 60;
			}
			var targetSpace = app.tileSpaces[rank];
			app.gameBoard.placePiece({ rank: rank, color: playerColor, tileSpace: targetSpace }, idOffset, true);
		}
		game.setState({ placementMode: this.previousMode });
		this.setState({ formOpen: false });
		app.saveActiveGame();
	}
	selectPreset(value){
		this.setState({selected: value});
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var { app, game } = this.props;
		var tilerack = app.tileRack;
		var layoutPreview = '';
		if (this.layoutLookup[this.state.selected]) {
			var layoutIdx = this.layoutLookup[this.state.selected];
			var layoutTiles =  JSON.parse(app.Config.Layouts[layoutIdx].value);
			if (tilerack.playerColor == 'blue') {
				// The presets were compiled from the perspective of the red player in this game.
				// For the blue player, we have to invert the rows.
				var row1 = layoutTiles.slice(30,40);
				var row2 = layoutTiles.slice(20,30);
				var row3 = layoutTiles.slice(10,20);
				var row4 = layoutTiles.slice(0,10);
				layoutTiles = row1.concat(row2).concat(row3).concat(row4);
			}
			var barrierTiles = [3,4,7,8];
			var barrierSquares = [];
			for (var i = 1;i<11;i++) {
				var obstacle = '';
				if (barrierTiles.indexOf(i) != -1) {
					obstacle = 'X';
				}
				barrierSquares.push(
					<div className="preview-square text-center" key={i-11}>
						{obstacle}
					</div>
				);
			}
			const squares = layoutTiles.map((rank,i) => 
				<div className="preview-square" key={i}>
					<DragPiece app={app} game={game} color={tilerack.playerColor} rank={rank} placed={true} className="" />
				</div>
			)
			var grid;
			if (tilerack.playerColor == 'red') {
				grid = squares.concat(barrierSquares);
			}
			else {
				grid = barrierSquares.concat(squares);
			}
			layoutPreview = (<Row noGutters={true} className="my-4">{grid}</Row>);
		}
		var displayClass = ' d-inline-block';
		if (!this.state.selected) {
			displayClass = ' d-none';
		}
		var presetSelector = (
			<div id="presetSelector">
				<h3 className="mt-0">QUICK LOAD</h3>
				<DataBrowser 
					label="Select from Preset Layouts:" 
					// items={app.tilePresets}
					items={[{id: null, name: '', value: '[]'}].concat(this.props.app.Config.Layouts)}
					view="select" 
					id="presetList" 
					callback={this.selectPreset} 
					labelClass="d-block mb-2"
				/>
				{layoutPreview}
				<a className={"text-white text-center go-button blue float-right"+displayClass} tabIndex="-1" onClick={() => this.handleSubmit(layoutTiles)}>Load Preset</a>
			</div>
		);
		if (!this.state.formOpen) {
			return null;
		}
		return (
			<MenuModal 
				parentMenu={this}
				height="auto"
				content={presetSelector}
				styles={{ backgroundColor: 'var(--sand)' }}
				additionalClasses={"text-black py-5 px-1"}
			/>
		);
	}
}

export default QuickLoadMenu;
