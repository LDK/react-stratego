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
		props.app.QuickLoadMenu = this;
		this.layoutLookup = {};
		for (var i in layouts) {
			this.layoutLookup[layouts[i].id] = i;
		}
	}
	handleSubmit(event) {
		event.preventDefault();
		var app = this.props.app;
	}
	selectPreset(value){
		this.setState({selected: value});
	}
	render() {
		if (!this.state.formOpen) {
			return null;
		}
		var app = this.props.app;
		var tilerack = app.tileRack;
		var layout = [];
		var layoutPreview = '';
		if (this.layoutLookup[this.state.selected]) {
			var layoutIdx = this.layoutLookup[this.state.selected];
			var layoutTiles =  JSON.parse(layouts[layoutIdx].value);
			const squares = layoutTiles.map((rank,i) => 
				<div className="preview-square" key={i}>
					<DragPiece color={tilerack.playerColor} rank={rank} placed={true} className="" />
				</div>
			);
			layoutPreview = (<div className="row">{squares}</div>);
		}
		var presetSelector = (
			<div id="presetSelector">
				<DataBrowser 
					label="Select from Preset Layouts:" 
					// items={app.tilePresets}
					items={layouts}
					view="select" 
					id="presetList" 
					callback={this.selectPreset} 
				/>
				{layoutPreview}
				<button onClick={this.handleSubmit} value="Load Preset" />
			</div>
		);
		if (!this.state.formOpen) {
			return null;
		}
		return (
			<DndProvider backend={HTML5Backend}>
				<Modal 
					id="quickLoad-modal"
					content={presetSelector}
					open={true}
					additionalClasses={"p-5 text-black w-75"}
				/>
			</DndProvider>
		);
	}
}

export default QuickLoadMenu;
