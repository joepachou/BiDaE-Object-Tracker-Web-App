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



class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            showEditObjectForm: false,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
            thisComponentShouldUpdate: true
        }
        
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
    }

    handleChangeObjectStatusForm(eventKey) {
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: this.props.searchResult[eventKey],
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
        const { searchResult, searchKey, refresh } = this.props;
        const { showEditObjectForm } = this.state;

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
                    {console.log(this.props)}
                </Row>
                <Row className=''style={{height:'100%'}} >
                    {searchResult.length === 0 
                    ?   <Col className='text-left' style={style.noResultDiv}>
                            <em>no searchResult</em>
                        </Col> 
                    
                    :   <Col className='border px-0 overflow-auto'>
                            <ListGroup variant="flush" onSelect={this.handleChangeObjectStatusForm}>
                                {searchResult.map((item,index) => {
                                    let element = 
                                        <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={index} key={index}>
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
                {this.props.notFoundList.length !== 0 
                ? 
                    <>
                        <Row className='text-left mt-3'>
                            <h5>Devices not found</h5>
                        </Row>
                        <Row>
                            <Col className='border px-0 overflow-auto'>
                                <ListGroup variant="flush" onSelect={this.handleChangeObjectStatusForm}>
                                    {this.props.notFoundList.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={index} key={index}>
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

