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
import Cookies from 'js-cookie'
import SearchResultTable from './SearchResultTable'
import GetResultData from './GetResultData'
import PdfDownloadForm from './PdfDownloadForm'
import moment from 'moment'
import AuthenticationContext from '../../context/AuthenticationContext'
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import SearchResultListGroup from '../presentational/SearchResultListGroup'


class ShiftChange extends React.Component {
    state = {
            show: false,
            searchResult: {
                foundResult: [],
                notFoundResult: [],
            },
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
        axios.post(dataSrc.getTrackingData, {
            rssiThreshold: config.surveillanceMap.locationAccuracyMapToDefault[1]
        }).then(res => {
            var data = res.data.rows
            GetResultData('my devices', data).then(result=>{
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
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
    }

    confirmShift = () => {
        let userInfo = this.props.userInfo
        let locale = this.context
        let contentTime = moment().format(config.shiftRecordPdfContentTimeFormat)
        let fileNameTime = moment().locale('en').format(config.shiftRecordFileNameTimeFormat)
        const { foundResult, notFoundResult } = this.state.searchResult
        let pdfFormat = config.pdfFormat(userInfo, foundResult, notFoundResult, locale, contentTime, 'shiftChange')
        let fileDir = config.shiftRecordFileDir
        let fileName = `${userInfo.name}_${userInfo.shift.replace(/ /g, '_')}_${fileNameTime}.pdf`
        let filePath = `${fileDir}/${fileName}`
        axios.post(dataSrc.generatePDF, {
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
        const locale = this.context
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
                                <h5>{userInfo.name}{locale.texts.WHOSE}{locale.texts.DEVICES}</h5>
                            </Col>
                        </Row>
                        <Row style={style.row} className='text-capitalize'> 
                            <Col>
                                <div>{locale.texts.DATE_TIME}: {moment().format('LLL')}</div>
                            </Col>
                        </Row>
                        {/* <Row style={style.row} className='text-capitalize'> 
                            <Col>
                                <div>{locale.texts.SHIFT}: </div>
                            </Col>
                        </Row>
                        <Row style={style.row} className='text-capitalize'> 
                            <Col>
                                <div>{locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: </div>
                            </Col>
                        </Row> */}
                    </Modal.Header>
                    <Modal.Body  
                        style ={style.modalBody}
                        className='text-capitalize'
                     >                       
                        <div>
                            {hasFoundResult && <h6>{locale.texts.DEVICES_IN} {locale.texts[config.site.toUpperCase().replace(/ /g, '_')]}</h6>}                    
                            {hasFoundResult && foundResult.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {index + 1}.{item.name}, 
                                        {locale.texts.LAST_FOUR_DIGITS_IN_ACN}: {item.last_four_acn}, 
                                        {locale.texts.NEAR}{item.location_description}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='my-3'>
                            { hasNotFoundResult && <h6>{locale.texts.DEVICES_NOT_IN} {locale.texts[config.site.toUpperCase().replace(/ /g, '_')]}</h6>}
                            { hasNotFoundResult && notFoundResult.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {index + 1}.{item.name}, 
                                        {locale.texts.LAST_FOUR_DIGITS_IN_ACN}: {item.last_four_acn}, 
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

ShiftChange.contextType = LocaleContext
export default ShiftChange