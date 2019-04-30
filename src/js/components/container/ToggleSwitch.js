import React from 'react';

export default class ToggleSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: 'Med'
		};
		
	  this.toggleState = this.toggleState.bind(this);

	}

	toggleState(e) {
		const value = e.target.value;
		let modifiedRssi = '';
		const { changeRssi, leftLabel, middleLabel, rightLabel } = this.props 

		switch(value) {
			case leftLabel:
				modifiedRssi = -60;
				break;
			case middleLabel:
				modifiedRssi = -55;
				break;
			case rightLabel:
				modifiedRssi = -35;
				break;
			default:
				modifiedRssi = -50;
		}

		changeRssi(modifiedRssi);

		this.setState({
			toggle: value
		});
	}

	

	render() {
		return (
			<form className="switch-field">
				<div className="switch-title">{this.props.title}</div>
				<input
					type="radio"
					id="switch_left"
					name="switchToggle"
					value={this.props.leftLabel}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.leftLabel}
				/>
				<label htmlFor="switch_left">{this.props.leftLabel}</label>

				<input
					type="radio"
					id="switch_middle"
					name="switchToggle"
					value={this.props.middleLabel}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.middleLabel}
				/>
				<label htmlFor="switch_middle">{this.props.middleLabel}</label>

				<input
					type="radio"
					id="switch_right"
					name="switchToggle"
					value={this.props.rightLabel}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.rightLabel}
				/>
				<label htmlFor="switch_right">{this.props.rightLabel}</label>
			</form>
		);
	}
}


