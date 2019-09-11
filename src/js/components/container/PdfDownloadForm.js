import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { 
    Button,
    Row,
}  from 'react-bootstrap';
import Cookies from 'js-cookie'
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import QRCode from 'qrcode.react';
import moment from 'moment'
import config from '../../config'

// need Inputs : search Result
// this component will send json to back end, backend will return a url, and the component generate a qrcode
class PdfDownloadForm extends React.Component {
    
    state = {
        show: false,
        savePath: "",
        data: null,
        alreadyUpdate: false,
        hasData: false,
        isDone: false,
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(nextProps.show || nextState.show){
            return true;
        }else{
            return true;
        }
    }

    sendSearchResultToBackend = (searchResultInfo, callBack) => {
        axios.post(dataSrc.generatePDF ,searchResultInfo)
            .then(res => {
                callBack(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    componentDidUpdate = (preProps) => {
        if(this.props.show && !this.state.show){
            var foundResult = [], notFoundResult = []
            for(var item of this.props.data){
                item.found ? foundResult.push(item) : notFoundResult.push(item)
            }

            let userInfo = this.props.userInfo
            let locale = this.context
            let contentTime = moment().format(config.shiftRecordPdfContentTimeFormat)
            let fileNameTime = moment().locale('en').format(config.shiftRecordFileNameTimeFormat)
            let pdfFormat = config.pdfFormat(userInfo, foundResult, notFoundResult, locale, contentTime, 'searchResult')

            let fileDir = config.searchResultFileDir
            let fileName = `${'search_result'}_${fileNameTime}.pdf`
            let filePath = `${fileDir}/${fileName}`

            var searResultInfo = {
                userInfo,
                pdfFormat,
                filePath
            }
            this.sendSearchResultToBackend(searResultInfo,(path) => {
                this.setState({
                    savePath : path,
                    data: this.props.data,
                    show: this.props.show,
                    alreadyUpdate: true,
                    isDone: true,
                    hasData: true
                })  
            })
        }
    }
    handleClose = () => {
        this.props.handleClose()
        this.setState({
            show: false,
            alreadyUpdate:false,
            isDone: false,
        })
    }
    PdfDownloader = () => {
        window.open(this.state.savePath);
    }

  
    render() {
        const {
            hasData, 
            show, 
            savePath, 
            isDone
        } = this.state

        const locale = this.context

        return (
            <Modal 
                show={this.state.show}  
                onHide={this.handleClose} 
                className='text-capitalize'
                size="sm" 
            >
                <Modal.Header 
                    closeButton
                >
                    {locale.texts.PRINT_SEARCH_RESULT}
                </Modal.Header>
                <Modal.Body
                    className='d-flex flex-column'
                >
                    <Row className='d-flex justify-content-center mb-2'>
                        {hasData &&
                            <QRCode
                                value={dataSrc.pdfUrl(savePath)} 
                                size={256}
                            />
                        }
                    </Row>
                    <Row className='d-flex justify-content-center'> 
                        <Button 
                            onClick={this.PdfDownloader}
                            variant='outline-secondary'
                            className='text-capitalize'
                        >
                            {locale.texts.DOWNLOAD}
                        </Button>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

PdfDownloadForm.contextType = LocaleContext;
  
export default PdfDownloadForm;