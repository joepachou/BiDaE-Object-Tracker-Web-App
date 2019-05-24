import React from 'react';

import config from '../../config';
import LocaleContext from '../../context/LocaleContext';

class ToggleSwitch extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			toggle: config.surveillanceMap.locationAccuracy.defaultVal,
	};
		
	this.toggleState = this.toggleState.bind(this);

	}

	toggleState(e) {
		const value = e.target.value;
		const { adjustRssi } = this.props 

		adjustRssi(value);

		this.setState({
			toggle: value,
		});
	}

	

	render() {
		return (
			<form className="switch-field">
				<input
					type="radio"
					id="switch_left"
					name={this.props.leftLabel}
					value={config.surveillanceMap.locationAccuracy.lowVal}
					onChange={this.toggleState}
					checked={this.state.toggle == config.surveillanceMap.locationAccuracy.lowVal}
				/>
				<label htmlFor="switch_left">{this.props.leftLabel}</label>

				<input
					type="radio"
					id="switch_middle"
					name={this.props.defaultLabel}
					value={config.surveillanceMap.locationAccuracy.defaultVal}
					onChange={this.toggleState}
					checked={this.state.toggle == config.surveillanceMap.locationAccuracy.defaultVal}
				/>
				<label htmlFor="switch_middle">{this.props.defaultLabel}</label>

				<input
					type="radio"
					id="switch_right"
					name={this.props.rightLabel}
					value={config.surveillanceMap.locationAccuracy.highVal}
					onChange={this.toggleState}
					checked={this.state.toggle == config.surveillanceMap.locationAccuracy.highVal}
				/>
				<label htmlFor="switch_right">{this.props.rightLabel}</label>
			</form>
		);
	}
}

ToggleSwitch.contextType = LocaleContext;

export default ToggleSwitch;