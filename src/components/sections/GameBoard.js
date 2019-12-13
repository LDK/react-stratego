import React, { Component } from 'react';
import DropSpace from '../widgets/GameSpace.js';
import DragPiece from '../widgets/GamePiece.js';
import Modal from '../widgets/Modal.js';
import { PIECES } from '../Helpers.js';

class GameBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spaces: {},
			battleContent: (
				<div className="row">
					<h3 className="col-12 text-center">Attacking...</h3>
				</div>
			),
			battleModalOpen: false
		};
		this.obscuredSpaces = { 43: true, 44: true, 47: true, 48: true, 53: true, 54: true, 57: true, 58: true };
		this.renderGameSpace = this.renderGameSpace.bind(this);
		this.gameSpaceRow = this.gameSpaceRow.bind(this);
		this.gameSpaceRows = this.gameSpaceRows.bind(this);
		this.placePiece = this.placePiece.bind(this);
		this.emptySpace = this.emptySpace.bind(this);
		this.openBattleModal = this.openBattleModal.bind(this);
		this.closeBattleModal = this.closeBattleModal.bind(this);
		this.getBattleContent = this.getBattleContent.bind(this);
		this.props.app.gameBoard = this;
	}
	componentDidMount() {
		var app = this.props.app;
		var game = this.props.game;
		var spaces = this.props.game.props.spaces;
		var uid = app.state.currentUser.user_id;

		if (app.tileRack) {
			if (game.props.starter == uid) {
				app.tileRack.playerColor = 'blue';
			}
			else {
				app.tileRack.playerColor = 'red';
			}
		}
		if (spaces && spaces.length && app.tileSpaces) {
			for (var i in spaces) {
				var space = spaces[i];
				var targetSpace = null;
				if (space.rank && app.tileSpaces[space.rank]) {
					targetSpace = app.tileSpaces[space.rank];
				}
				this.placePiece({ rank: space.rank, color: space.color, tileSpace: targetSpace }, space.id, true);
				if (targetSpace) {
					targetSpace.setState({ remaining: targetSpace.remaining });
				}
			}
		}
	}
	openBattleModal() {
		this.setState({ battleModalOpen: true });
	}
	closeBattleModal() {
		this.setState({ battleModalOpen: false });
	}
	getBattleContent(result) {
		var app = this.props.app;
		var attackRank = PIECES[result.attack_rank].name;
		var defendRank = PIECES[result.defend_rank].name;
		var playerColor = app.tileRack.playerColor;
		var attacking = result.attack_color == playerColor;
		var playerRank = attacking ? attackRank : defendRank;
		var defeated = result.defeated;
		var oppColor = (playerColor == 'red') ? 'blue' : 'red';
		var oppRank = attacking ? defendRank : attackRank;
		var starterId = parseInt(this.props.game.props.starter);
		var uid = parseInt(app.state.currentUser.user_id);
		var oppName = (starterId == uid) ? this.props.game.props.opponentName : this.props.game.props.starterName;
		var outcome = '';
		var resultText = '';
		if (defendRank == 'Bomb') {
			this.emptySpace(result.space_id);
			this.emptySpace(result.from_space_id);
		}
		if (defeated == 'both') {
			this.emptySpace(result.space_id);
			this.emptySpace(result.from_space_id);
			outcome = 'Draw!';
			resultText = (<span>Your <strong>{playerRank}</strong> and <strong className='text-opponent-color'>{oppName}&apos;s</strong> <strong>{oppRank}</strong> defeated each other!</span>)
		}
		else if (defeated == playerColor) {
			outcome = 'Defeat!';
			var action = 'defeated';
			if (defendRank == 'Bomb' && attacking) {
				outcome = 'Catastrope!';
				action = 'blown up';
			}
			else if (defendRank == 'Bomb') {
				outcome = 'Sabotage!';
				action = 'defused';
			}
			resultText = (<span>Your <strong>{playerRank}</strong> was {action} by <strong className='text-opponent-color'>{oppName}&apos;s</strong> <strong>{oppRank}</strong>!</span>)
		}
		else {
			outcome = 'Victory!';
			var action = 'defeated';
			if (defendRank == 'Bomb' && attacking) {
				outcome = 'Success!';
				action = 'defused';
			}
			else if (defendRank == 'Bomb') {
				outcome = 'Success!';
				action = 'blew up';
			}
			else if (defendRank == 'Flag') {
				action = 'captured';
				// OH ALSO YOU WIN THE GAME
			}
			resultText = (<span>Your <strong>{playerRank}</strong> {action} <strong className='text-opponent-color'>{oppName}&apos;s</strong> <strong>{oppRank}</strong>!</span>)
		}
		var content = (
			<div className="row">
				<h3 className="col-12 text-center battle-heading">{outcome}</h3>
				<p className="col-12 battle-text text-center">{resultText}</p>
				<div className="col-6">
					<DragPiece color={result.attack_color} rank={result.attack_rank} placed={true} className="float-right" />
				</div>
				<div className="col-6">
					<DragPiece color={result.defend_color} rank={result.defend_rank} placed={true} className="" />
				</div>
			</div>
		);
		this.setState({ battleContent: content });
	}
	renderGameSpace(row,col,key,piece) {
		var occupied = (piece !== undefined);
		return <DropSpace id={key} board={this} y={row} x={col} occupied={occupied} key={key} passable={!(this.obscuredSpaces[key] || false)} game={this.props.game}>
				{piece}
			</DropSpace>;
	}
	emptySpace(id) {
		var spaces = this.state.spaces;
		var app = this.props.app;
		var playerColor = app.tileRack.playerColor;
		var space = spaces[id];
		var newSpace = this.renderGameSpace(space.props.y,space.props.x,id);
		spaces[id] = newSpace;
		this.setState({ spaces: spaces });
		return newSpace;
	}
	// 'id' in placePiece refers to the board square id
	placePiece(pieceInfo,id,loading) {
		var spaces = this.state.spaces;
		var app = this.props.app;
		var game = this.props.game;
		var battle = false;
		var playerColor = app.tileRack.playerColor;
		var { x, y, territory } = spaces[id].props;
		var { rank, color, tileSpace } = pieceInfo;
		if (x == pieceInfo.fromX && y == pieceInfo.fromY) {
			return;
		}
		if (pieceInfo.fromId) {
			if (!this.props.game.state.started) {
				if (!spaces[id].props.occupied) {
					// Render the target space with the piece in it, and empty the source space.
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId);
				}
				else {
					// Swap the pieces
					var occupantInfo = spaces[id].props.children.props;
					var fromPiece =  (<DragPiece color={pieceInfo.color} rank={pieceInfo.rank} fromX={x} fromY={y} fromId={id} placed={true} />);
					var toPiece =  (<DragPiece color={occupantInfo.color} rank={occupantInfo.rank} fromX={pieceInfo.fromX} fromY={pieceInfo.fromY} fromId={pieceInfo.fromId} placed={true} />);
					spaces[id] = this.renderGameSpace(y,x,id,fromPiece);
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId,toPiece);
					this.setState({spaces: spaces});
					app.saveActiveGame();
					return;
				}
			}
			else {
				if (!spaces[id].props.occupied) {
					// Render the target space with the piece in it, and empty the source space.
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId);
					this.props.game.toggleTurn();
				}
				else {
					// BATTLE
					var attacks = game.state.attacks + 1;
					battle = true;
					this.openBattleModal();
					var uid = app.state.currentUser.user_id;
					var userKey = app.state.currentUser.userKey;
					if (!uid || !userKey) {
						return [];
					}
					var gameId = app.state.activeGame.props.id;
					var formData = new FormData();
					var app = this.props.app;
					spaces[pieceInfo.fromId] = this.renderGameSpace(pieceInfo.fromY,pieceInfo.fromX,pieceInfo.fromId);
					formData.append('game_id',gameId);
					formData.append('user_id',uid);
					formData.append('userKey',userKey);
					formData.append('from_space_id',pieceInfo.fromId);
					formData.append('space_id',id);
					formData.append('spaces',spaces);
					formData.append('attack_rank',rank);
					formData.append('attack_color',color);
					var board = this;
					window.fetch(app.gameServer+'battle', {
						method: 'POST', 
						body: formData
					}).then(function(data){
						data.text().then(function(text) {
							if (!text.length) {
								return;
							}
							var result = JSON.parse(text);
							board.getBattleContent(result);
							game.setState({ attacks: attacks });
						});
					});
				}
			}
		}
		if (tileSpace) {
			if (!tileSpace.remaining) {
				return;
			}
			if (spaces[id].props.occupied) {
				var occupantInfo = spaces[id].props.children.props;
				if (occupantInfo.color == color && occupantInfo.rank == rank) {
					return;
				}
				else if (occupantInfo.color == color) {
					this.props.app.tileSpaces[occupantInfo.rank].remaining++;
				}
			}
			if (color == playerColor) 
			{
				tileSpace.remaining--;
				app.tileRack.remaining--;
				if (!app.tileRack.remaining) {
					app.tileRack.setState({ allPlaced: true });
				}
			}
			tileSpace.setState({ remaining: tileSpace.remaining });
		}
		spaces[id] = this.renderGameSpace(y,x,id,<DragPiece color={color} fromX={x} fromY={y} fromId={id} rank={rank} placed={true} game={this.props.game} />);
		this.setState({spaces: spaces});
		if (!loading && !battle) {
			app.saveActiveGame();
		}
	}
	gameSpaceRow(row,start,end,colSize) {
		var offset = (row - 1) * (colSize || 10);
		var gameSpaces = [];
		for (var i = start; i <= end; i++) {
			var newSpace = null;
			if (!this.state.spaces[offset+i]) {
				newSpace = this.renderGameSpace(row,i,offset+i);
				this.state.spaces[offset+i] = newSpace;
			}
			else {
				newSpace = this.state.spaces[offset+i];
			}
			gameSpaces.push(newSpace);
		}
		return (
			<div className="row" key={row}>
				{gameSpaces}
			</div>
		);
	}
	gameSpaceRows(start,end,cols) {
		var rows = [];
		for (var i = start; i <= end; i++) {
			rows.push(this.gameSpaceRow(i,1,10,10));
		}
		return rows;
	}
	render() {
		var game = this.props.game;
		var app = game.app;
		return (
			<div className="gameBoard">
				<Modal
					closeButton={true}
					closeCallback={this.closeBattleModal}
					id="battle-modal"
					content={this.state.battleContent}
					open={this.state.battleModalOpen}
					additionalClasses={"p-5 text-black"}
				/>
				{this.gameSpaceRows(1,10,10)}
			</div>
		)
	}
}

export default GameBoard;
