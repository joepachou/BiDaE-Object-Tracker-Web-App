import React from 'react';


import { Alert, Tab, ListGroup, Col, Row, Image } from 'react-bootstrap'
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
            showNotFoundResult: false,
            selection: [],
            editedObjectPackage: [],
            showAddDevice: false
        }
        
        this.handleSelectResultItem = this.handleSelectResultItem.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);
        this.handleAdditionalButton = this.handleAdditionalButton.bind(this);
        this.handleRemoveButton = this.handleRemoveButton.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {

        // if (this.state.showNotFoundResult && this.props.searchResult.filter(item => !item.found).length === 0) {
        //     this.setState({
        //         showNotFoundResult: false
        //     })
        // }
    }
    
    // shouldComponentUpdate() {
    //     console.log('should update');
    //     return true
    // }

    handleSelectResultItem(eventKey) {
        const eventItem = eventKey.split(':');
        const isFound = parseInt(eventItem[0])
        const number = parseInt(eventItem[1])

        /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
        this.toggleSelection(number, isFound)
        this.props.highlightSearchPanel(true)

        // this.props.shouldUpdateTrackingData(false)
    }

    toggleSelection(number, isFound) {
        let selection = [...this.state.selection]
        let selectItem = isFound ? this.props.searchResult.filter(item => item.found)[number]
                                : this.props.searchResult.filter(item => !item.found)[number]
        let mac = selectItem.mac_address
        const index = selection.indexOf(mac);

        let selectedObjectData = [...this.state.selectedObjectData]
        if (isFound) {
            if (this.state.showAddDevice) {
                if (index >= 0) {
                    if (selection.length === 1) return;
                    selection = [...selection.slice(0, index), ...selection.slice(index + 1)];
                    selectedObjectData = [...selectedObjectData.slice(0, index), ...selectedObjectData.slice(index + 1)]
                } else {
                    selection.push(mac)
                    selectedObjectData.push(selectItem)
                }
            } else {
                selection = [mac]
                selectedObjectData = [selectItem]
            }
        } else {
            selectedObjectData = [selectItem]
        }
        // console.log(selection)

        this.setState({
            showEditObjectForm: true,
            selection,
            selectedObjectData
        })
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
            selection: [],
            selectedObjectData: [],
            showAddDevice: false
        })
        // this.props.shouldUpdateTrackingData(true)
        this.props.highlightSearchPanel(false)
    }

    handleChangeObjectStatusFormSubmit(radioGroup, select) {
        let editedObjectPackage = _.cloneDeep(this.state.selectedObjectData).map(item => {
            item.status = radioGroup
            item.transferred_location = select.value || ''
            return item
        })
        this.setState({
            showEditObjectForm: false,
            editedObjectPackage,
        })
        setTimeout(
            function() {
                this.setState({
                    showConfirmForm: true,
                })
                this.props.highlightSearchPanel(false)
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e) {
        let { editedObjectPackage } = this.state;

        Axios.post(dataSrc.editObjectPackage, {
            formOption: editedObjectPackage
        }).then(res => {
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        editedObjectPackage: [],
                        selection: [],
                        selectedObjectData: [],
                    })
                    // this.props.shouldUpdateTrackingData(true)
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
        this.setState({ 
            showNotFoundResult: !this.state.showNotFoundResult 
        })
    }

    handleAdditionalButton(text) {
        let selection = []
        let selectedObjectData = []
        if (this.state.showAddDevice) {
            selection.push(this.state.selection[0])
            selectedObjectData.push(this.state.selectedObjectData[0])
        }
        this.setState({
            showAddDevice: !this.state.showAddDevice,
            selection: this.state.showAddDevice ? selection : this.state.selection,
            selectedObjectData: this.state.showAddDevice ? selectedObjectData : this.state.selectedObjectData
        })
    }

    handleRemoveButton(e) {
        let mac = e.target.getAttribute('name')
        let selection = [...this.state.selection]
        let selectedObjectData = [...this.state.selectedObjectData]
        let index = selection.indexOf(mac)
        if (index > -1) {
            selection = [...selection.slice(0, index), ...selection.slice(index + 1)]
            selectedObjectData = [...selectedObjectData.slice(0, index), ...selectedObjectData.slice(index + 1)]
        } else {
            return 
        }
        this.setState({
            selection,
            selectedObjectData
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
            listgroupItem: {
                cursor: this.state.showConfirmForm ? 'not-drop': null
            }, 
            icon: {
                color: '#007bff'
            }
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
                <Row className='searchResultListGroup' style={style.foundResultDiv}>
                
                    {this.props.searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-italic font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>No Result</div>
                            </Col> 
                        :   
                            <Col className=''>
                                <ListGroup onSelect={this.handleSelectResultItem} className='searchResultListGroup'>
                                    {this.props.searchResult.filter(item => item.found).map((item,index) => {
                                        let element = 
                                            <ListGroup.Item 
                                                href={'#' + index} 
                                                style={style.listItem} 
                                                className='searchResultList' 
                                                eventKey={item.found + ':'+ index} 
                                                key={index} 
                                                style={style.listgroupItem} 
                                                action
                                            >
                                                <Row>
                                                    {this.state.selection.indexOf(item.mac_address) >= 0 
                                                        ? 
                                                            <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>
                                                                <i className="fas fa-check" style={style.icon}></i> 
                                                            </Col>
                                                        :
                                                            <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>
                                                                {index + 1}
                                                            </Col>
                                                    }
                                                    <Col xs={5} sm={5} lg={5} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={2} sm={2} lg={2} className="d-flex align-self-center text-muted" style={style.middleText}>{item.last_four_acn}</Col>
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
                                <ListGroup onSelect={this.handleSelectResultItem} className='searchResultListGroup'>
                                    {this.props.searchResult.filter(item => !item.found).map((item,index) => {
                                        let element =  
                                            <ListGroup.Item 
                                                href={'#' + index} 
                                                action 
                                                style={style.listItem} 
                                                className='searchResultList' 
                                                eventKey={item.found + ':' + index} 
                                                key={index}
                                            >
                                                <Row className="">
                                                    <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                    <Col xs={5} sm={5} lg={5} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={1} sm={1} lg={1} className="d-flex align-self-center text-muted" style={style.middleText}>{item.last_four_acn}</Col>
                                                    <Col xs={2} sm={2} lg={2} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                                        {item.lbeacon_uuid
                                                            ? `near ${item.location_description}`
                                                            : 'N/A'
                                                        }
                                                    </Col>
                                                    <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                                        {item.lbeacon_uuid
                                                            ? item.residence_time
                                                            : ''
                                                        }
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
                    handleAdditionalButton={this.handleAdditionalButton}
                    showAddDevice={this.state.showAddDevice}
                    handleRemoveButton={this.handleRemoveButton}
                />
                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.editedObjectPackage} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
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

