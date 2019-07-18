import React from 'react';

import config from '../../config';
import LocaleContext from '../../context/LocaleContext';

class ToggleSwitch extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			toggle: props.defaultLabel,
	};
		
	this.toggleState = this.toggleState.bind(this);

	}

	toggleState(e) {
		const name = e.target.name;
		this.props.adjustRssi(e.target.value);
		this.setState({
			toggle: name,
		});
	}

	

	render() {

		const locale = this.context
		return (
			<form className="switch-field text-capitalize">
				<input
					type="radio"
					id="switch_left"
					name={this.props.leftLabel}
					value={0}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.leftLabel}
				/>
				<label htmlFor="switch_left">{locale[this.props.leftLabel]}</label>

				<input
					type="radio"
					id="switch_middle"
					name={this.props.defaultLabel}
					value={1}
					onChange={this.toggleState}
					checked={this.state.toggle === this.props.defaultLabel}
				/>
				<label htmlFor="switch_middle">{locale[this.props.defaultLabel]}</label>

				<input
					type="radio"
					id="switch_right"
					name={this.props.rightLabel}
					value={2}
					onChange={this.toggleState}
					checked={this.state.toggle === this.props.rightLabel}
				/>
				<label htmlFor="switch_right">{locale[this.props.rightLabel]}</label>
			</form>
		);
	}
}

ToggleSwitch.contextType = LocaleContext;

export default ToggleSwitch;