import React from 'react';

import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import { Nav, Row, ButtonToolbar, Button, ToggleButton}  from 'react-bootstrap';
import ChangeStatusForm from './ChangeStatusForm';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import ConfirmForm from './ConfirmForm'
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux'
import { 
    shouldUpdateTrackingData,
    changeLocationAccuracy
} from '../../action/action'
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import GridButton from '../container/GridButton';


class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: config.surveillanceMap.locationAccuracy.defaultVal,
            showEditObjectForm: false,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
            showDevice: false,
            searchableObjectData: [],
            isClear: false,
        }

        this.adjustRssi = this.adjustRssi.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this);
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this)
        this.transferSearchableObjectData = this.transferSearchableObjectData.bind(this)
        this.handleClearGridButtonStatus = this.handleClearGridButtonStatus.bind(this)
    }


    adjustRssi(adjustedRssi) {
        this.props.changeLocationAccuracy(adjustedRssi)
        this.setState({
            rssi: adjustedRssi,
        })
    }


    handleMarkerClick(objectList) {
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: objectList,
        })
        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
        })
        this.props.shouldUpdateTrackingData(true);
    }

    handleChangeObjectStatusFormSubmit(postOption) {
        this.setState({
            formOption: postOption,
            selectedObjectData: {
                ...this.state.selectedObjectData,
                ...postOption,
            },
            showEditObjectForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    showConfirmForm: true,
                })
                this.props.shouldUpdateTrackingData(false)
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e, addedDevices) {
        const button = e.target
        const postOption = this.state.formOption;

        const { status, transferredLocation } = postOption
        let editObjectPackages = []
        editObjectPackages.push(postOption)
        if (addedDevices) {
            addedDevices.map( item => {
                item.status = status
                delete item.transferred_location
                item.transferredLocation = transferredLocation
                editObjectPackages.push(item)
            })
        }
        axios.post(dataSrc.editObject, {
            formOption: editObjectPackages
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    }) 
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    }

    handleClickButton(e) {
        const button = e.target;
        const buttonName = button.innerText
        switch(buttonName.toLowerCase()) {
            case 'show devices':
            case 'hide devices':
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case 'clear':
                this.props.handleClearButton();
                this.handleClearGridButtonStatus();
        }

    }

    handleClearGridButtonStatus() {
        this.setState({
            isClear: true,
        })
    }

    transferSearchableObjectData(processData) {
        this.props.transferSearchableObjectData(processData)
        this.setState({
            searchableObjectData: processData,
        })
    }

    capitalFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.substring(1)
    }
    
    render(){
        const { rssi, 
                showEditObjectForm, 
                showConfirmForm, 
                selectedObjectData, 
                formOption, 
            } = this.state;
        const { hasSearchKey, 
                searchResult,
                searchType, 
                transferSearchableObjectData
            } = this.props;
        const locale = this.context;

        const style = {
            title: {
                color: 'grey',
                fontSize: 8,
                wordWrap: 'break-word',
            },
            // surveillanceContainer: {
            //     height: '100vh'
            // },
            navBlock: {
                height: '40%'
            }, 
            mapBlock: {
                height: '60%',
                border: 'solid 2px rgba(227, 222, 222, 0.619)',
                padding: '5px',
            },
            gridButton: {
                display: this.state.showDevice ? null : 'none'
            }
        }

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className='overflow-hidden'>
                <div style={style.mapBlock}>
                    <Surveillance 
                        rssi={rssi} 
                        hasSearchKey={hasSearchKey}
                        searchResult={searchResult}
                        searchType={searchType}
                        transferSearchableObjectData={this.transferSearchableObjectData}
                        handleMarkerClick={this.handleMarkerClick}
                        style={style.searchMap}
                        colorPanel={this.props.colorPanel}

                    />
                </div>
                <div style={style.navBlock}>

                    <Nav className='d-flex align-items-center'>
                        <Nav.Item>
                            <div style={style.title}>Location</div>
                            <div style={style.title}>Accuracy</div>
                        </Nav.Item>
                        <Nav.Item className='pt-2'  >
                            <ToggleSwitch 
                                adjustRssi={this.adjustRssi} 
                                leftLabel={this.capitalFirstLetter(locale.low)} 
                                defaultLabel={this.capitalFirstLetter(locale.med)} 
                                rightLabel={this.capitalFirstLetter(locale.high)} 
                            />
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="outline-primary" className='mr-1 ml-2' onClick={this.handleClickButton}>Clear</Button>
                        </Nav.Item>
                        <Nav.Item >
                            <Button variant="outline-primary" className='mr-1' onClick={this.handleClickButton}>Save</Button>

                        </Nav.Item>
                        <Nav.Item >
                            <Button variant="outline-primary" className='mr-1' onClick={this.handleClickButton} active={this.state.showDevice}>
                                {this.state.showDevice ? 'Hide devices' : 'Show devices' }
                            </Button>
                        </Nav.Item>
                        <div style={style.gridButton}>
                            <GridButton
                                searchableObjectData={this.state.searchableObjectData} 
                                transferSearchResult={this.props.transferSearchResult}
                                clearColorPanel={this.props.clearColorPanel}
                                isClear={this.state.isClear}
                            />
                        </div>
                    </Nav>

                </div>

                <ChangeStatusForm 
                    show={showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={selectedObjectData} 
                    searchKey={null}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />
                <ConfirmForm 
                    show={showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={formOption} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                    searchableObjectData={this.state.searchableObjectData}
                />
            </div>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value)),
        changeLocationAccuracy: value => dispatch(changeLocationAccuracy(value))
    }
}

export default connect(null, mapDispatchToProps)(SurveillanceContainer)