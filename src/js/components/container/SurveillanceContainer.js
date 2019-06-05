import React from 'react';

import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import Nav from 'react-bootstrap/Nav';
import ModalForm from './ModalForm';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';

class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: config.surveillanceMap.locationAccuracy.defaultVal,
        }

        this.adjustRssi = this.adjustRssi.bind(this);
    }

    adjustRssi(adjustedRssi) {
        this.setState({
            rssi: adjustedRssi,
        })
    }

    
    render(){
        const { rssi } = this.state;
        const { hasSearchKey, searchedObjectData } = this.props;
        const locale = this.context;

        const titleStyle = {
            color: 'grey',
            fontSize: 8,
        }

        return(
            <>
                <Surveillance 
                    rssi={rssi} 
                    retrieveTrackingData={this.props.retrieveTrackingData}
                    hasSearchKey={hasSearchKey}
                    searchedObjectData={searchedObjectData}
                />

                <Nav className='d-flex align-items-center'>
                    {/* <Nav.Item className='d-flex align-items-baseline'>
                        <small style={titleStyle}>{locale.location_accuracy.toUpperCase()}</small>
                        <ToggleSwitch adjustRssi={this.adjustRssi} leftLabel={locale.low} defaultLabel={locale.med} rightLabel={locale.high} />
                    </Nav.Item> */}
                    {/* <Nav.Item>
                        <ModalForm title='Add object'/>
                    </Nav.Item> */}
                    

                    
                </Nav>

            </>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

export default SurveillanceContainer;