import React from 'react';

import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import Nav from 'react-bootstrap/Nav';
import ChangeStatusForm from './ChangeStatusForm';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';

class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: config.surveillanceMap.locationAccuracy.defaultVal,
            showEditObjectForm: false,
            selectedObjectData: [],
            shouldComponentUpdate: true,
        }

        this.adjustRssi = this.adjustRssi.bind(this);
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this);
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
    }


    adjustRssi(adjustedRssi) {
        this.setState({
            rssi: adjustedRssi,
        })
    }

    shouldComponentUpdate() {
        return this.state.shouldComponentUpdate;
    }

    handleChangeObjectStatusForm(objectData) {
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: objectData,
            shouldComponentUpdate: false
        })
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            shouldComponentUpdate: true
        })
    }

    
    render(){
        const { rssi, showEditObjectForm, selectedObjectData } = this.state;
        const { hasSearchKey, searchResult, transferSearchableObjectData} = this.props;
        const locale = this.context;

        const style = {
            title: {
                color: 'grey',
                fontSize: 8,
            },
            searchMap: {
                // height: '100vh'
            }
        }

        return(
            <>
                <Surveillance 
                    rssi={rssi} 
                    hasSearchKey={hasSearchKey}
                    searchResult={searchResult}
                    transferSearchableObjectData={transferSearchableObjectData}
                    handleChangeObjectStatusForm={this.handleChangeObjectStatusForm}
                    style={style.searchMap}

                />
                <Nav className='d-flex align-items-center'>
                    <Nav.Item className='d-flex align-items-baseline'>
                        <small style={style.title}>{locale.location_accuracy.toUpperCase()}</small>
                        <ToggleSwitch adjustRssi={this.adjustRssi} leftLabel={locale.low} defaultLabel={locale.med} rightLabel={locale.high} />
                    </Nav.Item>
                    {/* <Nav.Item>
                        <ModalForm title='Add object'/>
                    </Nav.Item> */}
                </Nav>
                {/* {console.log(selectedObjectData)} */}
                <ChangeStatusForm 
                    show={showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={selectedObjectData} 
                    searchKey={null}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                />

            </>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

export default SurveillanceContainer;