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
import InfoPrompt from './InfoPrompt';
import AccessControl from './AccessControl';
import SearchResultListGroup from '../presentational/SearchResultListGroup'

class SearchResult extends React.Component {

    state = {
        showEditObjectForm: false,
        showConfirmForm: false,
        selectedObjectData: [],
        showNotFoundResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
    }

    handleSelectResultItem = (eventKey) => {
        const eventItem = eventKey.split(':');
        const isFound = parseInt(eventItem[0])
        const number = parseInt(eventItem[1])

        /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
        this.toggleSelection(number, isFound)
        this.props.highlightSearchPanel(true)

        // this.props.shouldUpdateTrackingData(false)
    }

    toggleSelection = (number, isFound) => {
        let selection = [...this.state.selection]
        let selectItem = isFound ? this.props.searchResult.filter(item => item.found)[number]
                                : this.props.searchResult.filter(item => !item.found)[number]
        let mac = selectItem.mac_address
        const index = selection.indexOf(mac);

        let selectedObjectData = [...this.state.selectedObjectData]
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
        this.setState({
            showEditObjectForm: true,
            selection,
            selectedObjectData
        })
    }

    handleChangeObjectStatusFormClose = () => {
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

    handleChangeObjectStatusFormSubmit = (radioGroup, select) => {
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

    handleConfirmFormSubmit = (e) => {
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

    handleToggleNotFound = (e) => {
        e.preventDefault()
        this.setState({ 
            showNotFoundResult: !this.state.showNotFoundResult 
        })
    }

    handleAdditionalButton = (text) => {
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

    handleRemoveButton = (e) => {
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
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
                fontWeight: 300
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
            }, 
            alertTextTitle: {
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            },
        }

        let searchResult = this.state.showNotFoundResult 
            ? this.props.searchResult.filter(item => !item.found) 
            : this.props.searchResult.filter(item => item.found)

        let deviceNum = this.state.showNotFoundResult
            ? this.props.searchResult.filter(item => item.found).length
            : this.props.searchResult.filter(item => !item.found).length

        let title = this.state.showNotFoundResult 
            ? 'not found'
            : 'found'

        return(
            <>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4 className='text-capitalize'>{locale.SEARCH_RESULT}</h4>
                </Row>
                <Row className='w-100 searchResultForMobile'>
                    <InfoPrompt data={{devices: searchResult.length}} title={title}/>
                </Row>
                <Row className='searchResultListGroup'>
                    {searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-italic font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>No Result</div>
                            </Col> 
                        :   
                            <Col>
                                <AccessControl
                                    permission={'form:edit'}
                                    renderNoAccess={() => (
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            handleSelectResultItem={this.handleSelectResultItem}
                                            selection={this.state.selection}
                                            disabled
                                        />)
                                    }
                                >
                                    <SearchResultListGroup 
                                        data={searchResult}
                                        handleSelectResultItem={this.handleSelectResultItem}
                                        selection={this.state.selection}
                                    />
                                </AccessControl>
                            </Col>
                    }
                </Row>
                { deviceNum !== 0 
                    && 
                        <Row className='d-flex justify-content-center mt-3'>
                            <h4 style={style.titleText}>
                                <a href="" onClick={this.handleToggleNotFound}>
                                    {'Show' + ' ' + deviceNum + ' Devices '}{this.state.showNotFoundResult ? null : 'not' } Found 
                                </a>
                            </h4>
                        </Row>
                    
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

