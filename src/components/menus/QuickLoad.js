import React, { Component } from 'react';
import MenuModal from '../widgets/MenuModal.js';
import DataBrowser from '../widgets/DataBrowser.js';
import {layouts} from '../Helpers.js';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragPiece from '../widgets/GamePiece.js';

class QuickLoadMenu extends React.Component {
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
		var app = this.props.app;
		var game = this.props.game;
		var tilerack = app.tileRack;
		var layout = [];
		var layoutPreview = '';
		if (this.layoutLookup[this.state.selected]) {
			var layoutIdx = this.layoutLookup[this.state.selected];
			var layoutTiles =  JSON.parse(layouts[layoutIdx].value);
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
					<DragPiece color={tilerack.playerColor} rank={rank} placed={true} className="" />
				</div>
			)
			var grid;
			if (tilerack.playerColor == 'red') {
				grid = squares.concat(barrierSquares);
			}
			else {
				grid = barrierSquares.concat(squares);
			}
			layoutPreview = (<div className="row no-gutters my-4">{grid}</div>);
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
					items={[{id: null, name: '', value: '[]'}].concat(layouts)}
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
				additionalClasses={"text-black"}
			/>
		);
	}
}

export default QuickLoadMenu;
