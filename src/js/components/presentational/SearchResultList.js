import React from 'react';
import { 
    Button,
    Col, 
    Row, 
    Image,
} from 'react-bootstrap'
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import axios from 'axios';
import InfoPrompt from './InfoPrompt';
import AccessControl from './AccessControl';
import SearchResultListGroup from '../presentational/SearchResultListGroup'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import DownloadPdfRequestForm from '../container/DownloadPdfRequestForm'
import moment from 'moment'
import config from '../../config'


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
        showDownloadPdfRequest: false,
    }

    handleSelectResultItem = (eventKey) => {
        const eventItem = eventKey.split(':');
        const isFound = parseInt(eventItem[0])
        const number = parseInt(eventItem[1])

        /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
        this.toggleSelection(number, isFound)
        this.props.highlightSearchPanel(true)
        let { stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        dispatch({
            type: 'setUpdateTrackingData',
            value: false
        })
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
        let { stateReducer } = this.context
        let [{}, dispatch] = stateReducer
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
        dispatch({
            type: 'setUpdateTrackingData',
            value: true
        })
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
            item.notes = values.notes
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
        let { auth, stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        let username = auth.user.name
        let shouldCreatePdf = config.statusToCreatePdf.includes(editedObjectPackage[0].status)
        let pdfPackage = shouldCreatePdf && this.createPdfPackage()
        axios.post(dataSrc.editObjectPackage, {
            formOption: editedObjectPackage,
            username,
            pdfPackage
        }).then(res => {
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: shouldCreatePdf,
                        // editedObjectPackage: [],
                        // selection: [],
                        // selectedObjectData: [],
                        showAddDevice: false,
                        showDownloadPdfRequest: shouldCreatePdf,
                        pdfPath: shouldCreatePdf && pdfPackage.path
                    })
                    dispatch({
                        type: 'setUpdateTrackingData',
                        value: true
                    })
                }
                .bind(this),
                1000
            )
            // toast(<Toast />, {
            //     closeOnClick: false,
            //     position: "top-right",
            // })
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

    /** Create the content of pdf */
    createPdfPackage = () => {
        let { locale, auth } = this.context
        let pdfPackage = config.getPdfPackage('editObject', auth.user, this.state.editedObjectPackage, locale)
        return pdfPackage
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

    handleFormClose = () =>{
        this.setState({
            showDownloadPdfRequest: false,
            showConfirmForm: false
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
            downloadPdfRequest: {
                zIndex: 3000,
                top: '30%',
                // left: '-10%',
                right: 'auto',
                bottom: 'auto',
                padding: 0,
            }
        }

        let foundResult = this.props.searchResult.filter(item => item.found)
        let notFoundResult = this.props.searchResult.filter(item => !item.found)

        let searchResult = this.state.showNotFoundResult 
            ? notFoundResult
            : foundResult

        let title = this.state.showNotFoundResult 
            ? locale.texts.DEVICES_NOT_FOUND
            : locale.texts.DEVICES_FOUND



        return(
            <div>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4 className='text-capitalize'>
                        {title}
                    </h4>
                </Row>
                {/* <Row className='w-100 searchResultForMobile'>
                    <InfoPrompt data={{[devicePlural]: searchResult.length}} title={title}/>
                </Row> */}
                <Row>
                    {searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                            </Col> 
                        :   
                            <Col className="searchResultListGroup mx-2 d-flex justify-content-center">
                                <AccessControl
                                    permission={'form:edit'}
                                    renderNoAccess={() => (
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            selection={this.state.selection}
                                        />
                                    )
                                    }
                                >
                                    <SearchResultListGroup 
                                        data={searchResult}
                                        handleSelectResultItem={this.handleSelectResultItem}
                                        selection={this.state.selection}
                                        action
                                    />
                                </AccessControl>
                            </Col>
                    }
                </Row>
                <Row className='d-flex justify-content-center mt-3'>
                    <Button
                        variant="link"
                        className="text-capitalize"
                        onClick={this.handleToggleNotFound}
                        size="lg"
                        disabled={false}
                    >
                        {this.state.showNotFoundResult 
                            ? locale.texts.SHOW_DEVICES_FOUND
                            : locale.texts.SHOW_DEVICES_NOT_FOUND
                        }
                    </Button>
                </Row>
                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title={'report device status'} 
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
                    title={'thank you for reporting'}
                    selectedObjectData={this.state.editedObjectPackage} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                    showDownloadPdfRequest={this.state.showDownloadPdfRequest}
                />
                {/* <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest} 
                    pdfPath={this.state.pdfPath}
                    close={this.handleFormClose}
                /> */}
            </div>
        )
    }
}

export default SearchResult
