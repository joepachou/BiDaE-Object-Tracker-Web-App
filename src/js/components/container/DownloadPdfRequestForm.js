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
import LocaleContext from '../../context/LocaleContext';
  
const DownloadPdfRequestForm = ({
    handleClose,
    pdfPath,
    show
}) => {
    
    let locale = React.useContext(LocaleContext)

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


    const handleClickButton = e => {
        
        let { name } = e.target
        console.log(name)
        switch(name) {
            case "viewReport":
                window.open(dataSrc.pdfUrl(pdfPath));
                break;
            case "downloadReport":
            console.log(dataSrc.pdfUrl(pdfPath))
                var link = document.createElement('a');
                link.href = dataSrc.pdfUrl(pdfPath);
                link.download = "";
                link.click();
                break;
            case "close":
                handleClose()
                break;
        }
    }

    
    return (
        <Modal 
            id='downloadPdfRequest' 
            show={show} 
            onHide={handleClose} 
            size="md"
            style={style.downloadPdfRequest}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
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
                                        onClick={handleClickButton}
                                        name="viewReport"
                                    >
                                        {locale.texts.VIEW_REPORT}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleClickButton}
                                        name="downloadReport"
                                    >
                                        {locale.texts.DOWNLOAD_REPORT}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleClickButton}
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
  
export default DownloadPdfRequestForm;