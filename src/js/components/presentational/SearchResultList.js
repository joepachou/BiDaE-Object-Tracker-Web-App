import React from 'react';
import { 
    Button,
    Col, 
    Row, 
    Image 
} from 'react-bootstrap'
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import axios from 'axios';
import InfoPrompt from './InfoPrompt';
import AccessControl from './AccessControl';
import SearchResultListGroup from '../presentational/SearchResultListGroup'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';


const Toast = () => {

    const style = {
        column: {
            textAlign: 'center',
        },
        icon: {
            check: {
                color: 'green',
            },
            times: {
                color: 'red',
            },
            exclamation: {
                color: 'orange',
            }
        }
    }

    return (
        <Row>
            <Col className='d-flex '>
                <i className="fas fa-check " style={style.icon.check}></i>     
            </Col>
            <Col>
                view report     
            </Col>
            <Col>
                download report     
            </Col> 
        </Row>
    )
}

class SearchResult extends React.Component {

    static contextType = AppContext

    state = {
        showEditObjectForm: false,
        showConfirmForm: false,
        selectedObjectData: [],
        showNotFoundResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.searchKey !== this.props.searchKey) {
            
        }
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
        setTimeout(
            function (){
                this.setState({
                    selectedObjectData: [],
                })
            }.bind(this),
            200
        )
        // this.props.shouldUpdateTrackingData(true)
        this.props.highlightSearchPanel(false)
    }

    handleChangeObjectStatusFormSubmit = values => {
        // let selectedObjectData = _.cloneDeep(this.state.selectedObjectData)
        // let editedObjectPackage = {
        //     status: values.radioGroup.toLowerCase(),
        //     transferred_location: values.select ? values.select: '',
        //     notes: values.textarea,
        //     package: [...selectedObjectData.map(item => item.mac_address)]
        // }
        // console.log(editedObjectPackage)
        let editedObjectPackage = _.cloneDeep(this.state.selectedObjectData).map(item => {
            item.status = values.radioGroup.toLowerCase(),
            item.transferred_location = values.select ? values.select: '';
            item.notes = values.textarea 
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
        let { auth } = this.context
        let username = auth.user.name
        axios.post(dataSrc.editObjectPackage, {
            formOption: editedObjectPackage,
            username,
        }).then(res => {
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        editedObjectPackage: [],
                        selection: [],
                        selectedObjectData: [],
                        showAddDevice: false
                    })
                    // this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
            toast(<Toast />, {
                closeOnClick: false,
                position: "top-right",
            })
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
        const { locale } = this.context;
        const { searchKey } = this.props;
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
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
            ? locale.texts.NOT_FOUND
            : locale.texts.FOUND

        let devicePlural = deviceNum === 1 ? locale.texts.DEVICE : locale.texts.DEVICES


        return(
            <div className='pl-3'>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4 className='text-capitalize'>{locale.texts.SEARCH_RESULT}</h4>
                </Row>
                {/* <Row className='w-100 searchResultForMobile'>
                    <InfoPrompt data={{[devicePlural]: searchResult.length}} title={title}/>
                </Row> */}
                <Row className='searchResultListGroup'>
                    {searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                            </Col> 
                        :   
                            <Col className=''>
                                <AccessControl
                                    permission={'form:edit'}
                                    renderNoAccess={() => (
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            handleSelectResultItem={this.handleSelectResultItem}
                                            selection={this.state.selection}
                                            disabled
                                        />
                                    )
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
                            <h4 style={style.titleText} className='text-capitalize'>
                                <a href="" onClick={this.handleToggleNotFound}>
                                    {this.state.showNotFoundResult 
                                        ? locale.texts.SHOW + ' ' + deviceNum + ' ' + devicePlural + ' ' + locale.texts.FOUND
                                        : locale.texts.SHOW + ' ' + deviceNum + ' ' + devicePlural + ' ' + locale.texts.NOT_FOUND
                                    }
                                </a>
                            </h4>
                        </Row>
                }
                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title={locale.texts.REPORT_DEVICE_STATUS} 
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
                    title={locale.texts.THANK_YOU_FOR_REPORTING} 
                    selectedObjectData={this.state.editedObjectPackage} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(SearchResult);

