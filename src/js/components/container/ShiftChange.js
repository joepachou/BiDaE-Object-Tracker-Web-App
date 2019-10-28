import React, {Fragment} from 'react';
import { 
    Modal, 
    Image, 
    Row, 
    Col,
    Button,
    Container
} from 'react-bootstrap';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import SearchResultTable from './SearchResultTable'
import GetResultData from './GetResultData'
import PdfDownloadForm from './PdfDownloadForm'
import moment from 'moment'
import config from '../../config';
import SearchResultListGroup from '../presentational/SearchResultListGroup'
import { AppContext } from '../../context/AppContext'


class ShiftChange extends React.Component {

    static contextType = AppContext

    state = {
            show: false,
            searchResult: {
                foundResult: [],
                notFoundResult: [],
            },
            fileURL: '',
            showPdfDownloadForm: false,
            APIforTableDone: false,
        }
        APIforTable = null


    getAPIfromTable = (API) => {
        // console.log('API')
        this.APIforTable = API

        this.APIforTable.setOnClick(this.onClickTableItem)

        setTimeout(
            () => {
                this.APIforTable.updateSearchResult(this.state.searchResult)
            }, 100
        )

    }

    onClickTableItem(e){       

    }

    componentDidMount = () => {
        this.getTrackingData(true)
    }

    componentDidUpdate = (preProps) => {
        if (preProps != this.props){
            this.getTrackingData()
            this.setState({
                show: this.props.show,
            })
        }
    }

    handleClose = () => {
        this.props.handleShiftChangeRecordClose()
        this.setState({
            show: false
        })
    }


    getTrackingData = (update) => {
        let { 
            locale, 
            auth, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getTrackingData, {
            rssiThreshold: config.surveillanceMap.locationAccuracyMapToDefault[1],
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
        let userInfo = this.props.userInfo
        let { locale } = this.context
        let contentTime = moment().locale(locale.abbr).format(config.shiftChangeRecordTimeFormat)
        let fileNameTime = moment().locale('en').format(config.shiftRecordFileNameTimeFormat)
        const { foundResult, notFoundResult } = this.state.searchResult
        let pdfFormat = config.pdfFormat(userInfo, foundResult, notFoundResult, locale, contentTime, 'shiftChange')
        let fileDir = config.shiftRecordFolderPath
        let fileName = `${userInfo.name}_${userInfo.shift.replace(/ /g, '_')}_${fileNameTime}.pdf`
        let filePath = `${fileDir}/${fileName}`
        axios.post(dataSrc.addShiftChangeRecord, {
            userInfo,
            pdfFormat,
            filePath,
        }).then(res => {
            this.setState({
                fileURL: res.data
            })
            this.refs.download.click()
        }).catch(err => {
            console.log(err)
        })

        // const url = window.URL.createObjectURL(new Blob([res.data]));
        // const fileName = res.data.split('/')[1].toString()
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', fileName);
        // document.body.appendChild(link);
        // link.click();
    }

    render() {
        const { show } = this.state;
        const { userInfo } = this.props
        const { foundResult, notFoundResult } = this.state.searchResult
        const { locale, auth } = this.context
        const style = {
            row: {
                width: '100%'
            },
            modalBody: {
                height: '60vh',
                overflow: 'hidden scroll'
            }
        }
        const hasFoundResult = foundResult.length !== 0;
        const hasNotFoundResult = notFoundResult.length !== 0;
        return (
            <Fragment>
                <Modal show={show} size="md" onHide={this.handleClose}>
                    <Modal.Header
                        className='d-flex flex-column'
                    >
                        <Row>
                            <Col className='text-capitalize'>
                                {/* <h5>{locale.texts.SHIFT_CHANGE_RECORD}-{locale.texts.CONFIRM_BY}</h5> */}                                
                                <h5>{userInfo.name}{locale.texts.WHOSE_DEVICES}</h5>
                            </Col>
                        </Row>
                        <Row style={style.row} className='text-capitalize'> 
                            <Col>
                                <div>{locale.texts.DATE_TIME}: {moment().locale(locale.abbr).format(config.shiftChangeRecordTimeFormat)}</div>
                            </Col>
                        </Row>
                        <Row style={style.row} className='text-capitalize'>
                            <Col>
                                <div>{locale.texts.SHIFT}: {locale.texts[auth.user.shift.toUpperCase().replace(/ /g, '_')]} </div>
                            </Col>
                        </Row>
                        {/* <Row style={style.row} className='text-capitalize'> 
                            <Col>
                                <div>{locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: </div>
                            </Col>
                        </Row> */}
                    </Modal.Header>
                    <Modal.Body  
                        style ={style.modalBody}
                        id="shiftChange"
                        className='pt-1'
                     >        
                        {!hasFoundResult && !hasNotFoundResult && 
                            <div className="d-flex justify-content-center">
                                <p className="font-italic ">{locale.texts.NOT_ASSIGNED_TO_ANY_DEVICES}</p>
                            </div>
                        }     

                        <div>
                            {hasFoundResult && 

                            <h6 className="text-capitalize">{locale.texts.DEVICES_FOUND_IN} {auth.user.areas_id.map(id => {
                                    return locale.texts[config.mapConfig.areaOptions[id]]
                                })}
                            </h6>}                    
                            {hasFoundResult && foundResult.map((item, index) => {
                                return (
                                    <div key={index} className="pb-1">
                                        {index + 1}.{item.name}, 
                                        {locale.texts.LAST_FOUR_DIGITS_IN_ACN}: {item.last_four_acn}, 
                                        {locale.texts.NEAR}{item.location_description}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='my-2'>
                            { hasNotFoundResult && 
                            
                            <h6 className="text-capitalize"> {locale.texts.DEVICES_NOT_FOUND_IN} {auth.user.areas_id.map(id => {
                                    return locale.texts[config.mapConfig.areaOptions[id]]
                                })}
                            </h6>}
                            { hasNotFoundResult && notFoundResult.map((item, index) => {
                                return (
                                    <div key={index} className="pb-1">
                                        {index + 1}.{item.name}, 
                                        {locale.texts.ASSET_CONTROL_NUMBER}: {config.ACNOmitsymbol}{item.last_four_acn},
                                        {locale.texts.NEAR}{item.location_description}
                                    </div>
                                )
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                            {locale.texts.CANCEL}
                        </Button>
                        <Button 
                            type="submit" 
                            className="text-capitalize" 
                            variant="primary" 
                            onClick = {this.confirmShift}
                            disabled={!hasFoundResult && !hasNotFoundResult}
                        >
                            {locale.texts.CONFIRM}
                        </Button>
                        <a href={this.state.fileURL} ref="download" download style={{display: 'none'}}>hi</a>
                    </Modal.Footer>
                </Modal>
            </Fragment>

        )
    }
}

export default ShiftChange