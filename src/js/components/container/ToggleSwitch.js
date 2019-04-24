import React from 'react';
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButton from 'react-bootstrap/ToggleButton';



export default class ToggleSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false
		};
		
	  this.toggleState = this.toggleState.bind(this);

	}

	toggleState(e) {
		console.log(e.target)
		this.setState({
			toggle: !this.state.toggle
		});
	}

	render() {
		return (
			<form className="switch-field">
				<div className="switch-title">{this.props.title}</div>
				{this.props.options.map((item,index) => {
					const element =  
						<>
							<input
								type="radio"
								id="switch_right"
								name="switchToggle"
								key={index}
								value={item.label}
								onChange={this.toggleState}
								checked={this.state.toggle}
							/>
							<label htmlFor="switch_left">{item.label}</label>
						</>
					return element;
				})}

				{/* <input
					type="radio"
					id="switch_left"
					name="switchToggle"
					value={this.props.leftLabel}
					onChange={this.toggleState}
					checked={!this.state.toggle}
				/>
				<label htmlFor="switch_left">Low</label>

				<input
					type="radio"
					id="switch_right"
					name="switchToggle"
					value={this.props.rightLabel}
					onChange={this.toggleState}
					checked={this.state.toggle}
				/>
				<label htmlFor="switch_right">Med</label>

				<input
					type="radio"
					id="switch_right"
					name="switchToggle"
					value={this.props.rightLabel}
					onChange={this.toggleState}
					checked={this.state.toggle}
				/>
				<label htmlFor="switch_right">High</label> */}
			</form>
			// <Form>
			// 	<div key={`custom-inline-radio`} className="mb-3">
			// 		<Form.Check
			// 			custom
			// 			inline
			// 			label="1"
			// 			type="radio"
			// 			id={`custom-inline-radio-1`}
			// 		/>
			// 		<Form.Check
			// 			custom
			// 			inline
			// 			label="2"
			// 			type="radio"
			// 			id={`custom-inline-radio-2`}
			// 		/>

			// 		</div>
			// </Form>
		// 	<ButtonToolbar>
		// 	<ToggleButtonGroup type="radio" name="options" defaultValue={1}>
		// 	  <ToggleButton value={1}>Radio 1 (pre-checked)</ToggleButton>
		// 	  <ToggleButton value={2}>Radio 2</ToggleButton>
		// 	  <ToggleButton value={3}>Radio 3</ToggleButton>
		// 	</ToggleButtonGroup>
		//   </ButtonToolbar>
		);
	}
}


