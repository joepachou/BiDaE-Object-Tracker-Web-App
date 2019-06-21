import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import VerticalTable from '../presentational/VerticalTable';
import ModalForm from '../container/ModalForm';
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
            selectObjectIndex:0,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
            thisComponentShouldUpdate: true
        }
        
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
    }

    handleChangeObjectStatusForm(eventKey) {
        this.props.shouldUpdateTrackingData(false)
        this.setState({
            showEditObjectForm: true,
            selectObjectIndex: eventKey,
        })
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
                        openSurveillanceUpdate: true
                    }) 
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
        const { result, searchKey, refresh } = this.props;
        const { showEditObjectForm, selectObjectIndex } = this.state;

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
                <div className='text-left'>
                    <h5>Search Result</h5>
                </div>
                {/* <Tab.Container id="left-tabs-example" defaultActiveKey="#0"> */}
                    <Row className=''style={{height:'100%'}} >
                        {result.length === 0 
                        ?   <Col className='text-left' style={style.noResultDiv}>
                                <em>no result</em>
                            </Col> 
                        
                        :   <Col className='border px-0 overflow-auto'>
                                <ListGroup variant="flush" onSelect={this.handleChangeObjectStatusForm}>
                                    {result.map((item,index) => {
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
                        {/* <Col className=' border px-0' >
                            <Tab.Content >
                                {result.map((item,index) => {
                                    let element = 
                                        <Tab.Pane eventKey={'#' + index} className=''>
                                            <img src={item.img} width='100' className='py-4' />
                                            <VerticalTable item={item}/>
                                        </Tab.Pane>
                                    return element
                                })}
                            </Tab.Content>
                        </Col> */}
                    </Row>
                {/* </Tab.Container> */}
                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={result.length ? result[selectObjectIndex] : null} 
                    searchKey={searchKey}
                    handleChangeStatusFormClose={this.handleChangeStatusFormClose}
                    handleChangeObjectStatusForm={this.handleChangeObjectStatusForm}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />
                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.formOption} 
                    handleChangeStatusFormClose={this.handleChangeStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                />
                {console.log('Rerender')}
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

