import React, {Fragment} from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import GetResultData from './GetResultData'
import moment from 'moment'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import GeneralConfirmForm from '../container/GeneralConfirmForm'
import DownloadPdfRequestForm from './DownloadPdfRequestForm'

class ShiftChange extends React.Component {

    static contextType = AppContext

    state = {
        searchResult: {
            foundResult: [],
            notFoundResult: [],
        },
        fileUrl: '',
        showPdfDownloadForm: false,
        APIforTableDone: false,
        showConfirmForm: false,
        showDownloadPdfRequest: false,
    }
    APIforTable = null


    getAPIfromTable = (API) => {
        this.APIforTable = API
        this.APIforTable.setOnClick(this.onClickTableItem)
        setTimeout(
            () => {
                this.APIforTable.updateSearchResult(this.state.searchResult)
            }, 100
        )
    }

    componentDidMount = () => {
        this.getTrackingData(true)
    }

    getTrackingData = (update) => {
        let { 
            locale, 
            auth, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getTrackingData, {
            rssiThreshold: config.mapConfig.locationAccuracyMapToDefault[1],
            locale: locale.abbr,
            user: auth.user,
            areaId,
        }).then(res => {
            GetResultData('my devices', res.data, auth.user)
                .then(result => {
                    var foundResult = []
                    var notFoundResult = []
                    for(var i in result){
                        if(result[i].found){
                            foundResult.push(result[i])
                        }else{
                            notFoundResult.push(result[i])
                        }
                    }
                    
                    this.setState({
                        searchResult: {
                            foundResult: foundResult,
                            notFoundResult: notFoundResult,
                        }
                    })
                }) 
                .catch(err => {
                    console.log(`get myDevice data fail: ${err}`)
                })
        })
        .catch(err => {
            console.log(`get tracking data fail: ${err}`)
        })
    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
    }

    confirmShift = () => {
        this.setState({
            showConfirmForm: true
        })
    }

    handleConfirmFormSubmit = (name) => {
        let { locale, auth } = this.context   
      
        let pdfPackage = config.getPdfPackage('shiftChange', auth.user, this.state.searchResult ,locale,'', name)
        axios.post(dataSrc.addShiftChangeRecord, {
            userInfo: auth.user,
            pdfPackage,
        }).then(res => {
            this.props.handleSubmit()
            this.setState({
                fileUrl: pdfPackage.path,
                showConfirmForm: false,
                showDownloadPdfRequest: true
            })

            // this.refs.download.click()
        }).catch(err => {
            console.log(err)
        })
    }

    handleSignFormClose = () => {
        this.setState({
            showConfirmForm: false
        })
    }
    handlePdfDownloadFormClose = () => {
        this.setState({
            showDownloadPdfRequest: false
        })
    }
    render() {

        const { 
            userInfo,
            show,
            handleClose
        } = this.props
        const { foundResult, notFoundResult } = this.state.searchResult
        const { locale, auth,stateReducer } = this.context
        const style = {
            modalBody: {
                height: '60vh',
                overflow: 'hidden scroll'
            },
            row: {
                wordBreak: 'break-all'
            }
        }
        const nowTime = moment().locale(locale.abbr)
        const hasFoundResult = foundResult.length !== 0;
        const hasNotFoundResult = notFoundResult.length !== 0;
        return (
            <Fragment>
                <Modal 
                    show={show} 
                    size="md" 
                    onHide={handleClose}
                    className='text-capitalize'
                >
                    <Modal.Header
                        className='d-flex flex-column'
                    >
                        <div className="title">
                            {locale.texts.SHIFT_CHANGE_RECORD}
                        </div>                                
                        <div>
                            {locale.texts.DATE_TIME}: {nowTime.format(config.shiftChangeRecordTimeFormat)}
                        </div>
                        <div 
                        >
                            {locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: {auth.user.name}
                        </div>
                        <div 
                        >
                            {locale.texts.SHIFT}: {locale.texts[config.getShift(locale.abbr).toUpperCase().replace(/ /g, '_')]}
                        </div>

                    </Modal.Header>
                    <Modal.Body  
                        style ={style.modalBody}
                        id="shiftChange"
                     >        
                        {!hasFoundResult && !hasNotFoundResult && 
                            <div className="d-flex justify-content-center">
                                <p className="font-italic ">{locale.texts.NOT_ASSIGNED_TO_ANY_DEVICES}</p>
                            </div>
                        }     

                        <div>
                            {hasFoundResult && 
                                <div
                                    className="subtitle"
                                >
                                    {locale.texts.DEVICES_FOUND_IN} {auth.user.areas_id.map(id => {
                                        return locale.texts[config.mapConfig.areaOptions[id]]
                                    })}
                                </div>
                            }     
                            {hasFoundResult && foundResult.map((item, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className="pb-1"
                                        style={style.row}
                                    >
                                        {index + 1}.{item.name}, 
                                        {locale.texts.LAST_FOUR_DIGITS_IN_ACN}: {item.last_four_acn}, 
                                        {locale.texts.NEAR}{item.location_description}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='my-2'>
                            { hasNotFoundResult && 
                                <div 
                                    className="subtitle"
                                > 
                                    {locale.texts.DEVICES_NOT_FOUND_IN} {auth.user.areas_id.map(id => {
                                        return locale.texts[config.mapConfig.areaOptions[id]]
                                    })}
                                </div>
                            }
                            { hasNotFoundResult && notFoundResult.map((item, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className="pb-1 text-break"
                                    >
                                        {index + 1}.{item.name}, 
                                        {locale.texts.ASSET_CONTROL_NUMBER}: {config.ACNOmitsymbol}{item.last_four_acn},
                                        {locale.texts.NEAR}{item.location_description}
                                    </div>
                                )
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleClose}
                        >
                            {locale.texts.CANCEL}
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            onClick = {this.confirmShift}
                            disabled={!hasFoundResult && !hasNotFoundResult}
                        >
                            {locale.texts.CONFIRM}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    handleSubmit={this.handleConfirmFormSubmit}
                    handleClose={this.handleSignFormClose}
                    signin={auth.signin}
                    stateReducer ={stateReducer[0].areaId}
                    auth={auth}
                />
                <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest} 
                    pdfPath={this.state.fileUrl}
                    handleClose={this.handlePdfDownloadFormClose}
                />
            </Fragment>
        )
    }
}

export default ShiftChange