
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { AppContext } from '../../context/AppContext';
import moment from "moment"
  
class DateTimePicker extends React.Component {

    static contextType = AppContext

    state = {
        time: "0",
        length: 24,
    }

    onChange = (value) => {
        this.props.getValue(value, this.props.name)
        this.setState({
            time: value
        })
    }

    render() {

        let options = Array.from(Array(this.state.length + 1).keys())
            .filter(index => {
                return index >= parseInt(this.props.start) && index <= parseInt(this.props.end)
            })
            .map(index => {
                return {
                    value: `${index}:00`,
                    label: `${index}:00`
                }
            })
        let defaultValue = {
            value: this.props.value,
            label: this.props.value
        }

        let { locale } = this.context

        return (
            <Select
                name="timepicker"
                value={defaultValue}
                onChange={value => this.onChange(value)}
                options={options}
                isSearchable={false}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        )
    }
}

export default DateTimePicker;