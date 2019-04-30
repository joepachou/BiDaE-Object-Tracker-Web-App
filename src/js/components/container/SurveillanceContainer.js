import React from 'react';
import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';

class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: -55,
        }

        this.changeRssi = this.changeRssi.bind(this);
    }

    changeRssi(data) {
        console.log(data)
        this.setState({
            rssi: data || undefined,
        })
    }

    
    render(){
        const { rssi } = this.state;
        return(
            <>
                <Surveillance rssi={rssi} retrieveTrackingData={this.props.retrieveTrackingData}/>
                <ToggleSwitch changeRssi={this.changeRssi} title="Location Accuracy" leftLabel='Low' middleLabel='Med' rightLabel='High' />
            </>
        )
    }
}

export default SurveillanceContainer;