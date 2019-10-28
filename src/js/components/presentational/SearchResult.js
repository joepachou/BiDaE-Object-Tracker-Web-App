import React from 'react';


import { Alert, Tab, ListGroup, Col, Row, Nav } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import Axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../config';


class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            showEditObjectForm: false,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
            thisComponentShouldUpdate: true,
            foundResult: [],
            showNotFoundResult: false,
            notFoundObjects: [],
        }
        
        this.handleClickResultItem = this.handleClickResultItem.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.showNotFoundResult && this.props.searchResult.filter(item => !item.found).length === 0) {
            this.setState({
                showNotFoundResult: false
            })
        }
    }

    filterNotFound() {
        let notFoundObjects = this.props.searchResult.reduce((notFoundObjects, item) => {
            !item.found ? notFoundObjects.push(item) : null
            return notFoundObjects
        }, [])
        this.setState({
            notFoundObjects
        })
    }

    filterNotFoundObject() {
        const { searchResult } = this.props
        const myDevices = config.frequentSearchOption.MY_DEVICES;
        const allDevices = config.frequentSearchOption.ALL_DEVICES;
        let notFoundObject = []
        switch(this.props.searchKey) {
            case myDevices: 
                const userDevicesACN = this.props.auth.userInfo.myDevice
                const searchObjectACNArray = searchResult.map( item => {
                    return item.asset_control_number
                })
                userDevicesACN.map(acn => {
                    if (!searchObjectACNArray.includes(acn)) {
                        notFoundObject.push(acn)
                    }
                })
                break;
            case allDevices:
                const searchObjectMacAddressArray = searchResult.map( item => {
                    return item.mac_address
                })
                this.props.objectTable.rows.map(item => {
                    if (!(searchObjectMacAddressArray.includes(item.mac_address))) {
                        notFoundObject.push(item.mac_address)
                    }
                })
                break;
            default:
                return;
        }
        this.setState({
            notFoundObject,
        })       
    }

    handleClickResultItem(eventKey) {
        const eventItem = eventKey.split(':');
        const isFound = eventItem[0]
        const number = eventItem[1]

        /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
        let selectedObjectData = isFound == true
            ? [this.props.searchResult.filter(item => item.found)[number]] 
            : [this.props.searchResult.filter(item => !item.found)[number]]
        this.setState({
            showEditObjectForm: true,
            selectedObjectData,
        })
        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
        })
        this.props.shouldUpdateTrackingData(true)
    }

    handleChangeObjectStatusFormSubmit(postOption) {
        this.setState({
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
                    formOption: postOption,
                })
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e, addedDevices) {
        const button = e.target
        const postOption = this.state.formOption;
        const { status, transferredLocation } = postOption

        const colorPanel = this.props.colorPanel ? this.props.colorPanel : null;

        let editObjectPackages = [];
        let editObjectIdSet = new Set();

        /** Add the original edit device into editObjectPackages */
        editObjectPackages.push(postOption)
        editObjectIdSet.add(postOption.mac_address)

        /** Add the added device into editObjectPackages */
        if (addedDevices) {
            addedDevices.map( item => {
                item.status = status
                delete item.transferred_location
                item.transferredLocation = transferredLocation
                editObjectPackages.push(item)
                editObjectIdSet.add(item.mac_address)
            })
        }

        let changedStatusSearchResult = this.props.searchResult.map(item => {
            if (editObjectIdSet.has(item.mac_address)) {
                item = {
                    ...item,
                    status: postOption.status,
                    transferredLocation: postOption.transferredLocation
                }
            }
            return item
        })

        Axios.post(dataSrc.editObjectPackage, {
            formOption: editObjectPackages
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    })
                    this.props.processSearchResult(changedStatusSearchResult, colorPanel )
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    } 

    handleToggleNotFound(e) {
        e.preventDefault()
        console.log(this.props.searchResult.filter(item => !item.found))
        
        this.setState({ 
            showNotFoundResult: !this.state.showNotFoundResult 
        })
    }



    render() {
        const locale = this.context;
        const { searchKey } = this.props;

        const style = {
            listItem: {
                position: 'relative',
                zIndex: 6,
            }, 
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
                fontWeight: 300
            },
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                // background: 'rgb(227, 222, 222)',
                // height: 30,
                // width: 30,
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
            },
            lastText: {
                // textAlign: 'right'
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
                // display: this.props.searchKey === 'all devices' ? null : 'none',
            }, 
            notFoundResultDiv: {
                display: this.state.showNotFoundResult ? null : 'none',
            },
            foundResultDiv: {
                display: this.state.showNotFoundResult ? 'none' : null,
                // height: '300px',
                // minHeight: '400px',
                // maxHeight: '500px',
                // overflow: 'scroll'
            },
            alertTextTitle: {
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            },
        }

        return(
            <div>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4 className='text-capitalize'>{locale.SEARCH_RESULT}</h4>
                </Row>
                <Row className='w-100 searchResultForMobile' style={style.foundResultDiv}>
                    <Alert variant='secondary' className='d-flex justify-content-start'>
                        <div style={style.alertTextTitle}>{'Found '}</div>
                        &nbsp;
                        &nbsp;

                        <div style={style.alertText}>{this.props.searchResult.filter(item => item.found).length}</div>
                        &nbsp;
                        <div style={style.alertText}>devices</div>
                        &nbsp;
                    </Alert>
                </Row>
                <Row className='' style={style.foundResultDiv}>
                
                    {this.props.searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-italic font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>No Result</div>
                            </Col> 
                        :   
                            <Col className=''>
                                <ListGroup onSelect={this.handleClickResultItem} className='searchResultListGroup'>
                                    {this.props.searchResult.filter(item => item.found).map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={1 + ':'+ index} key={index} style={{zIndex: 1060}}>
                                                <Row>
                                                    <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                    <Col xs={5} sm={5} lg={5} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={2} sm={2} lg={2} className="d-flex align-self-center text-muted" style={style.middleText}>{item.asset_control_number && item.asset_control_number.slice(10, 14)}</Col>
                                                    <Col xs={4} sm={4} lg={4} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                                        {item.status.toLowerCase() === config.objectStatus.NORMAL
                                                            ? `near ${item.location_description}`
                                                            : item.status
                                                        }
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col>
                        }
                </Row>
                {this.props.searchResult 
                && this.props.searchResult.filter(item => !item.found).length !== 0 
                && <>
                        <Row className='d-flex justify-content-center mt-3'>
                            <h4 style={style.titleText}>
                                <a href="" onClick={this.handleToggleNotFound}>
                                    {this.state.showNotFoundResult ? 'Hide' : 'Show' + ' ' + this.props.searchResult.filter(item => !item.found).length} Devices Not Found 
                                </a>
                            </h4>
                        </Row>
                        <Row className='w-100 searchResultForMobile' style={style.notFoundResultDiv}>
                            <Alert variant='secondary' className='d-flex justify-content-start'>
                                <div style={style.alertTextTitle}>{'Not Found '}</div>
                                &nbsp;
                                &nbsp;

                                <div style={style.alertText}>{this.props.searchResult.filter(item => !item.found).length}</div>
                                &nbsp;
                                <div style={style.alertText}>devices</div>
                                &nbsp;
                            </Alert>
                        </Row>
                        <Row style={style.notFoundResultDiv}>
                            <Col className=''>
                                <ListGroup onSelect={this.handleClickResultItem} className='searchResultListGroup'>
                                    {this.props.searchResult.filter(item => !item.found).map((item,index) => {
                                        let element =  
                                            <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={0 + ':' + index} key={index}>
                                                <Row className="">
                                                    <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                    <Col xs={4} sm={4} lg={4} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={1} sm={1} lg={1} className="d-flex align-self-center text-muted" style={style.middleText}>{item.asset_control_number && item.asset_control_number.slice(10, 14)}</Col>
                                                    <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                                        {item.status.toLowerCase() === config.objectStatus.NORMAL
                                                            ? item.lbeacon_uuid
                                                                ? `near ${item.location_description}`
                                                                : 'no record'
                                                            : item.status                                                                
                                                        }
                                                    </Col>
                                                    <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted text-capitalize" style={style.middleText}>
                                                        {item.lbeacon_uuid ? item.residence_time : 'no record'}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col> 
                        </Row>
                    </>
                }
                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedObjectData} 
                    searchKey={searchKey}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />
                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.formOption} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                    searchResult={this.props.searchResult}
                />
            </div>
        )
    }
}
SearchResult.contextType = LocaleContext;

const mapStateToProps = (state) => {
    return {
        objectTable: state.retrieveTrackingData.objectTable
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);

