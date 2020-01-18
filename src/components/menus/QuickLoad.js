import React, { Component } from 'react';
import Modal from '../widgets/Modal.js';
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
		this.closeMenu = this.closeMenu.bind(this);
		props.app.gameBoard.QuickLoadMenu = this;
		this.layoutLookup = {};
		this.previousMode = 'drag';
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
		game.setState({placementMode: this.previousMode});
		this.closeMenu();
		app.saveActiveGame();
	}
	closeMenu() {
		this.setState({ formOpen: false });
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
			const squares = layoutTiles.map((rank,i) => 
				<div className="preview-square" key={i}>
					<DragPiece color={tilerack.playerColor} rank={rank} placed={true} className="" />
				</div>
			);
			layoutPreview = (<div className="row">{squares}</div>);
		}
		var displayClass = null;
		if (!this.state.selected) {
			displayClass = ' d-none';
		}
		var presetSelector = (
			<div id="presetSelector">
				<DataBrowser 
					label="Select from Preset Layouts:" 
					// items={app.tilePresets}
					items={[{id: null, name: '', value: '[]'}].concat(layouts)}
					view="select" 
					id="presetList" 
					callback={this.selectPreset} 
				/>
				{layoutPreview}
				<a className={"button mx-auto my-3"+displayClass} tabIndex="-1" onClick={() => this.handleSubmit(layoutTiles)}>Load Preset</a>
			</div>
		);
		if (!this.state.formOpen) {
			return null;
		}
		return (
			<Modal 
				id="quickLoad-modal"
				content={presetSelector}
				closeButton={true}
				closeCallback={this.closeMenu}
				open={true}
				additionalClasses={"p-5 text-black w-75"}
			/>
		);
	}
}

export default QuickLoadMenu;
