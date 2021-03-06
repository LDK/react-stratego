import React from 'react';
import PropTypes from 'prop-types';
import TileSpace from '../widgets/TileSpace.js';
import { debug } from '../Helpers.js';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class TileRack extends React.Component {
	static get propTypes() {
		return {
			remaining: PropTypes.number,
			app: PropTypes.object,
			game: PropTypes.object,
			onChange: PropTypes.func,
			suggestions: PropTypes.array,
			inputName: PropTypes.string,
			placeholder: PropTypes.string
		};
	}
	constructor(props) {
		super(props);
		this.remaining = props.remaining || 40;
		this.spaces = {};
		this.renderTileSpace = this.renderTileSpace.bind(this);
		this.tileSpaces = this.tileSpaces.bind(this);
		this.setReady = this.setReady.bind(this);
		this.resetCounts = this.resetCounts.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.app = props.app;
		this.app.tileRack = this;
		this.app.tileSpaces = {};
		this.state = { 
			allPlaced: false
		};
		if (this.app.state.currentUser.user_id == this.app.state.activeGame.props.starter) {
			this.playerColor = 'blue';
		}
		else {
			this.playerColor = 'red';
		}
	}
	componentDidMount() {
		this.app.tileRack = this;
	}
	renderTileSpace(key) {
		return <TileSpace id={"tileSpace-"+key} rack={this} key={key} rank={key} game={this.props.game} />;
	}
	resetCounts(remaining) {
		var app = this.props.app;
		let rank;
		if (!remaining || typeof remaining == 'undefined') { 
			this.remaining = 40;
			this.setState({allPlaced: false});
			for (rank in app.Config.Pieces) {
				app.tileSpaces[rank].remaining = app.Config.Pieces[rank].count;
				app.tileSpaces[rank].setState({remaining: app.Config.Pieces[rank].count});
			}
		}
		else {
			for (rank in remaining) {
				if (rank == 'total') {
					continue;
				}
				app.tileSpaces[rank].remaining = remaining[rank];
				app.tileSpaces[rank].setState({remaining: remaining[rank]});
			}
			if (typeof remaining.total != 'undefined') {
				this.remaining = remaining.total;
				this.setState({allPlaced: this.remaining < 1});
			}
		}
	}
	tileSpaces() {
		var spaces = [];
		for (var rank in this.props.app.Config.Pieces) {
			spaces.push(this.renderTileSpace(rank));
		}
		this.spaces = spaces;
		return spaces;
	}
	setReady(isReady) {
		var app = this.app;
		var game = this.props.game;
		var players = game.state.players;
		players[this.playerColor].ready = isReady;
		game.setState({players: players});
		app.saveActiveGame();
	}
	componentWillUnmount() {
		this.app.tileRack = null;
		this.app.tileSpaces = {};
	}
	returnTileToRack(game,app,spaceId) {
		var board = app.gameBoard;
		if (typeof spaceId == 'undefined') {
			spaceId = board.state.selectedSpace;
		}
		var space = board.state.spaces[spaceId];
		if (!space.props.children) {
			return;
		}
		var rank = space.props.children.props.rank;
		app.tileSpaces[rank].remaining++;
		this.remaining++;
		board.emptySpace(spaceId);
		if (game.state.placementMode == 'click') {
			board.selectSpace(null);
			board.highlightSpace(null);
		}
		app.tileSpaces[rank].setState({ remaining: app.tileSpaces[rank].remaining });
		this.setState({ allPlaced: false });
		app.saveActiveGame();
	}
	handleClick() {
		// var game = this.props.game;
		// var app = this.props.app;
		// if (game.state.placementMode == 'click' && !!app.gameBoard.state.selectedSpace) {
		// 	this.returnTileToRack(game,app);
		// }
		// Do nothing for now
	}
	render() {
		var readyButton = '';
		var startButton = '';
		var game = this.props.game;
		debug('TileRack rendering');
		if (!game.state.started) {
			if (!this.remaining && this.state.allPlaced && !game.state.players[this.playerColor].ready) {
				readyButton = (
					<Col xs={12}>
						<a className="go-button d-block blue text-white text-center mx-auto my-md-3 glowing" tabIndex="-1" onClick={() => this.setReady(true)}>I&apos;m Ready!</a>
					</Col>
				);
			}
			else if (!this.remaining && this.state.allPlaced) {
				readyButton = (
					<Col xs={12}>
						<a className="go-button d-block red text-white text-center mx-auto my-md-3" tabIndex="-1" onClick={() => this.setReady(false)}>I&apos;m Not Ready!</a>
					</Col>
				);
			}
			if (game.state.players.blue.ready && game.state.players.red.ready) {
				startButton = (
					<Col xs={12}>
						<a className="go-button d-block text-white text-center mx-auto my-3 glowing" tabIndex="-1" onClick={game.startGame}>START GAME</a>
					</Col>
				);
			}
		}
		return (
			<Container fluid={true} className="px-0" onClick={this.handleClick}>
				<Row noGutters={true} className="tileRack px-3 px-md-0 pt-2 pt-sm-3">
					{startButton}
					{readyButton}
					{this.tileSpaces()}
				</Row>
			</Container>
		)
	}
}

export default TileRack;
