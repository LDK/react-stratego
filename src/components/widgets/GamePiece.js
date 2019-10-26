import React, { Component } from 'react';
import {PIECES} from '../Helpers.js';
import { useDrag } from 'react-dnd';

class GamePiece extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			captured: this.props.captured || false,
			placed: this.props.placed || false,
		};
		const { name, rackOrder, move, capture, defuse } = PIECES[this.props.rank];
		this.name = name;
		this.rackOrder = rackOrder;
		this.move = move;
		this.capture = capture || null;
		this.defuse = defuse || false;
	}
	render() {
		var divClass = "gamePiece text-center " + (this.props.className || '');
		var wrapperClass = "gamePiece-wrapper " + (this.props.wrapperClass || '');
		wrapperClass = wrapperClass.trim();
		divClass = divClass.trim();
		return (
			<div className={wrapperClass} data-color={this.props.color}>
				<div className={divClass}>
					<div className={"tileFace rank-"+this.props.rank}></div>
				</div>
			</div>
		)
	}
}

function DragPiece(props) {
  const [{isDragging}, drag] = useDrag({
    item: { type: 'piece', rank: props.rank, game: props.game, color: props.color, tileSpace: props.tileSpace, fromX: props.fromX, fromY: props.fromY, fromId: props.fromId },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  });
  return (
    <div
      ref={drag}
      style={{
		  color: props.color || 'black',
        opacity: isDragging ? 0 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
	  <GamePiece color={props.color} rank={props.rank} placed={props.placed || false} game={props.game} /> 
    </div>
  );
}

export default DragPiece;
