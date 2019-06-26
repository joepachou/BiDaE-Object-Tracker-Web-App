import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import { deepEqual } from 'assert';



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
            notFoundResult: [],

        }
        
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
    }
    
    componentDidUpdate(prepProps) {
        if(!(_.isEqual(prepProps.searchResult, this.props.searchResult))) {
            let notFoundResult = [];
            let foundResult = [];
            this.props.searchResult.map(item => {
                if (item.status.toLowerCase() !== 'normal') {
                    notFoundResult.push(item)
                }
            })
            foundResult = this.props.searchResult.filter(item => item.status.toLowerCase() === 'normal')
            this.setState({
                foundResult: foundResult,
                notFoundResult: notFoundResult,
            })
        }        
    }

    handleChangeObjectStatusForm(eventKey) {
        const eventItem = eventKey.split(':');
        const isFound = eventItem[0]
        const number = eventItem[1]
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: isFound.toLowerCase() === 'found' ? this.state.foundResult[number] : this.state.notFoundResult[number]
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

    handleConfirmFormSubmit(e) {
        const button = e.target
        const postOption = this.state.formOption;
        const colorPanel = this.props.colorPanel ? this.props.colorPanel : null;
        let changedStatusSearchResult = this.props.searchResult.map(item => {
            if (postOption.mac_address === item.mac_address) {
                item = {
                    ...item,
                    ...postOption
                }
            }
            return item
        })

        axios.post(dataSrc.editObject, {
            formOption: postOption
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    })
                    this.props.transferSearchResult(changedStatusSearchResult, colorPanel )
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    }    

    render() {
        const locale = this.context;
        const { searchResult, searchKey} = this.props;

        const style = {
            listItem: {
                position: 'relative',
                zIndex: 6,
            }, 
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
            }

        }

        return(
            <>
                <Row className='text-left'>
                    <h5>Search Result</h5>
                </Row>
                <Row className=''style={{height:'100%'}} >
                    {this.state.foundResult.length === 0 
                    ?   <Col className='text-left' style={style.noResultDiv}>
                            <em>no searchResult</em>
                        </Col> 
                    
                    :   <Col className='border px-0 overflow-auto'>
                            <ListGroup variant="flush" onSelect={this.handleChangeObjectStatusForm}>
                                {searchResult.filter(item => item.status.toLowerCase() === 'normal').map((item,index) => {
                                    let element = 
                                        <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={'found:' + index} key={index}>
                                            <div className="d-flex justify-content-between">
                                                <div className="font-weight-bold text-left">{index + 1}.</div>
                                                <div className="font-weight-bold">{item.type}</div>
                                                <div>xxxx-xxxx-{item.access_control_number.slice(10, 14)}</div>
                                                <div>near {item.location_description}</div>
                                            </div>
                                        </ListGroup.Item>
                                    return element
                                })}
                            </ListGroup>
                        </Col> 
                    }
                </Row>
                {this.state.notFoundResult.length !== 0 
                ? 
                    <>
                        <Row className='text-left mt-3'>
                            <h5>Devices not found</h5>
                        </Row>
                        <Row>
                            <Col className='border px-0 overflow-auto'>
                                <ListGroup variant="flush" onSelect={this.handleChangeObjectStatusForm}>
                                    {this.state.notFoundResult.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={'notfound:' + index} key={index}>
                                                <div className="d-flex justify-content-between">
                                                    <div className="font-weight-bold text-left">{index + 1}.</div>
                                                    <div className="font-weight-bold">{item.type}</div>
                                                    <div>xxxx-xxxx-{item.access_control_number.slice(10, 14)}</div>
                                                    <div>near {item.location_description}</div>

                                                </div>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col> 
                        </Row>
                    </>
                : null}
            


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
                />
            </>
        )
    }
}
SearchResult.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(SearchResult);

