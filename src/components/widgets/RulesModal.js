import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal.js';
import Tabs from './Tabs.js';
import GamePiece from './GamePiece.js';
import reactStringReplace from 'react-string-replace';
import './RulesModal.scss';

class RulesModal extends React.Component {
	static get propTypes() {
		return {
			content: PropTypes.any,
			styles: PropTypes.object,
			height: PropTypes.string,
			width: PropTypes.string,
			additionalClasses: PropTypes.string,
			app: PropTypes.object
		};
	}
	constructor(props) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.state = { modalOpen : false };
		props.app.RulesModal = this;
	}
	closeModal() {
		this.setState({ modalOpen: false });
	}
	onKeyDown (e) {
		if (!e.keyCode) { return; }
		switch (e.keyCode) {
			case this.props.app.Config.KeyCodes['esc']:
				this.closeModal();
			break;
		}
	}
	render() {
		var props = this.props;
		var app = props.app;
		if (!app.Config) {
			return null;
		}
		let contentPages = [];
		for (var n in app.Config.Text.Rules.pages) {
			var page = app.Config.Text.Rules.pages[n];
			let pars = [];
			let rankKey, rank;
			let pieceNames = [];
			for (var j in app.Config.Pieces) {
				pieceNames.push('**'+app.Config.Pieces[j].name+'**');
				pieceNames.push('**'+app.Config.Pieces[j].name+'s**');
			}
			for (var idx in page.paragraphs) {
				if (page.paragraphs[idx].type == 'paragraph') {
					let newPar = page.paragraphs[idx].text;
					for (rank in app.Config.Pieces) {
						rankKey = String(rank).toLowerCase();
						newPar = reactStringReplace(newPar, '**'+app.Config.Pieces[rank].name+'**', () => ( <strong key={"single-"+app.Config.Pieces[rank].name}>{app.Config.Pieces[rank].name}</strong> ));
						newPar = reactStringReplace(newPar, '**'+app.Config.Pieces[rank].name+'s**', () => ( <strong key={"plural-"+app.Config.Pieces[rank].name}>{app.Config.Pieces[rank].name+'s'}</strong> ));
						newPar = reactStringReplace(newPar, '[piece:rank-'+rankKey+']', () => ( 
							<GamePiece color="blue" key={rank+'-par'} rank={rank} wrapperClass="d-inline-block float-right mr-md-5" />
						));
					}
					pars.push(<div className="mb-3" key={idx}>{newPar}</div>);
				}
				else if (page.paragraphs[idx].type == 'list') {
					let item;
					let items = [];
					for (var i in page.paragraphs[idx].items) {
						item = page.paragraphs[idx].items[i];
						item = reactStringReplace(item, '**Bombs**', () => ( <strong key="bomb">Bombs</strong> ));
						// item = reactStringReplace(item, '**Majors**', () => ( <strong key="majors">Majors</strong> ));
						for (rank in app.Config.Pieces) {
							rankKey = String(rank).toLowerCase();
							item = reactStringReplace(item, '**'+app.Config.Pieces[rank].name+'**', () => ( <strong key={idx+'-1-'+i}>{app.Config.Pieces[rank].name}</strong> ));
							item = reactStringReplace(item, '**'+app.Config.Pieces[rank].name+'s**', () => ( <strong key={idx+'-2-'+i}>{app.Config.Pieces[rank].name+'s'}</strong> ));
							item = reactStringReplace(item, '[piece:rank-'+rankKey+']', () => ( 
								<GamePiece color="blue" rank={rank} key={rank+'-list'} wrapperClass="d-inline-block float-right mr-md-5" />
							));
						}
						items.push(<li key={idx+'-'+i} className={page.paragraphs[idx].itemClass}>{item}</li>)
					}
					pars.push(<ul className="row px-3" key={idx}>{items}</ul>);				
				}
			}
			contentPages.push({
				key: page.id,
				id: page.id,
				label: page.label,
				content: (<article><h2 className="mb-3">{page.heading}</h2>{ pars }</article>)
			});
		}
		const content = (
			<Tabs app={app} showArrows={false} contents={contentPages} />
		);
		var styles = {};
		if (props.styles) {
			styles = props.styles;
		}
		return (
			<Modal 
				id="rules-modal"
				app={app}
				content={content}
				height='xlarge'
				width='large'
				open={this.state.modalOpen}
				closeButton={true}
				closeCallback={this.closeModal}
				onKeyDown={this.onKeyDown} 
				styles={styles}
				additionalClasses={"pt-5 "+props.additionalClasses}
			/>
		)
	}
}

export default RulesModal;
