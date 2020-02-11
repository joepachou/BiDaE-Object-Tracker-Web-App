import React from 'react';
import { 
    Modal, 
    Button 
} from 'react-bootstrap'
import { 
    Formik, 
    Form 
} from 'formik';
import { AppContext } from '../../context/AppContext';
import dataSrc from '../../dataSrc'
  
class DownloadPdfRequestForm extends React.Component {

    static contextType = AppContext
    

    handleClose = (e) => {
        this.props.handleClose();
    }

    handleChange = (e) => {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    handleClickButton = e => {
        
        let { name } = e.target
        switch(name) {
            case "viewReport":
                window.open(this.props.pdfPath);
                break;
            case "downloadReport":
            console.log(dataSrc.pdfUrl(this.props.pdfPath))
                var link = document.createElement('a');
                link.href = dataSrc.pdfUrl(this.props.pdfPath);
                link.download = "";
                link.click();
                break;
            case "close":
                this.props.handleClose()
                break;
        }
    }

    render() {

        const { locale } = this.context

        const style = {
            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            },
            downloadPdfRequest: {
                zIndex: 6000,
                padding: 0,
            },
        }

        return (
            <Modal 
                id='downloadPdfRequest' 
                show={this.props.show} 
                onHide={this.handleClose} 
                size="md"
                style={style.downloadPdfRequest}
            >
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {locale.texts.PROCESS_IS_COMPLETED}
                </Modal.Header>
                <Modal.Body className="py-2">
                    <Formik    
                        render={() => (
                            <Form>
                                <div className="mb-3">
                                    <div className="mb-3">
                                        {locale.texts.NOW_YOU_CAN_DO_THE_FOllOWING_ACTION}
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.handleClickButton}
                                            className="text-capitalize"
                                            name="viewReport"
                                        >
                                            {locale.texts.VIEW_REPORT}
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.handleClickButton}
                                            className="text-capitalize"
                                            name="downloadReport"
                                        >
                                            {locale.texts.DOWNLOAD_REPORT}
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.handleClickButton}
                                            className="text-capitalize"
                                            name="close"
                                        >
                                            {locale.texts.CLOSE}
                                    </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default DownloadPdfRequestForm;