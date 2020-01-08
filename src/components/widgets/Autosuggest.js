// Autosuggest component adapted from https://alligator.io/react/react-autocomplete/

import React, { Component, Fragment } from 'react';

class Autosuggest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// The active selection's index
			activeSuggestion: 0,
			// The suggestions that match the user's input
			filteredSuggestions: [],
			// Whether or not the suggestion list is shown
			showSuggestions: false,
			// What the user has entered
			userInput: ""
		};
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.selectOption = this.selectOption.bind(this);
	}
	selectOption(activeSuggestion, filteredSuggestions) {
		var userInput = activeSuggestion ? filteredSuggestions[activeSuggestion-1] : this.state.userInput;
		this.setState({
			activeSuggestion: 0,
			showSuggestions: !!this.state.userInput && !this.state.activeSuggestion,
			userInput: userInput
		});
		if (this.props.onSelect && typeof this.props.onSelect == 'function') {
			this.props.onSelect(userInput)
		}
	}
	// Event fired when the input value is changed
	onChange(e) {
		const { suggestions } = this.props;
		const userInput = e.currentTarget.value;
		// Filter our suggestions that don't contain the user's input
		const filteredSuggestions = suggestions.filter(
			suggestion =>
			suggestion.toLowerCase().indexOf(userInput.toLowerCase()) === 0
		);

		// Update the user input and filtered suggestions, reset the active
		// suggestion and make sure the suggestions are shown
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: filteredSuggestions,
			showSuggestions: true,
			userInput: e.currentTarget.value
		});

		if (this.props.onChange && typeof this.props.onChange == 'function') {
			this.props.onChange(e.currentTarget.value)
		}
	};
	// Event fired when the user clicks on a suggestion
	onClick(e) {
		// Update the user input and reset the rest of the state
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: e.currentTarget.innerText
		});
		if (this.props.onSelect && typeof this.props.onSelect == 'function') {
			this.props.onSelect(e.currentTarget.innerText)
		}
	};
	// Event fired when the user presses a key down
	onKeyDown (e) {
		const { activeSuggestion, filteredSuggestions } = this.state;

		// User pressed the enter key, update the input and close the
		// suggestions
		if (e.keyCode === 13) {
			e.preventDefault();
			this.selectOption(activeSuggestion, filteredSuggestions);
		}
		// User pressed the up arrow, decrement the index
		else if (e.keyCode === 38) {
			e.preventDefault();
			if (activeSuggestion === 0) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion - 1 });
		}
		// User pressed the down arrow, increment the index
		else if (e.keyCode === 40) {
			e.preventDefault();
			if (activeSuggestion === filteredSuggestions.length) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}
	};
	render() {
		const {
			onChange,
			onClick,
			onKeyDown,
			state: {
				activeSuggestion,
				filteredSuggestions,
				showSuggestions,
				userInput
			},
			props: {
				inputName,
				placeholder
			}
		} = this;
		let suggestionsListComponent;

		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				suggestionsListComponent = (
					<ul className="suggestions">
					{filteredSuggestions.map((suggestion, index) => {
						let className;
						// Flag the active suggestion with a class
						if (index + 1 === activeSuggestion) {
							className = "suggestion-active";
						}

						return (
							<li
							className={className}
							key={suggestion}
							onClick={onClick}
							>
								{suggestion}
							</li>
						);
					})}
					</ul>
				);
			}
			else {
				suggestionsListComponent = (
					<div className="no-suggestions">
						<em>No suggestions</em>
					</div>
				);
			}
		}
		return (
			<Fragment>
				<input type="text" autoComplete="off" name={inputName} onChange={onChange} onKeyDown={onKeyDown} value={userInput} placeholder={placeholder} />
				{suggestionsListComponent}
			</Fragment>
		);
	}
}

Autosuggest.defaultProps = {
	suggestions: []
};

export default Autosuggest;
