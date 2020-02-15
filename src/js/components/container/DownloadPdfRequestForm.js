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
            top: '2%',
        },
    }


    const handleClickButton = e => {
        
        let { name } = e.target
        switch(name) {
            case "viewReport":
                window.open(dataSrc.pdfUrl(pdfPath));
                break;
            case "downloadReport":
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
                            <div className="mb-5">
                                {locale.texts.NOW_YOU_CAN_DO_THE_FOllOWING_ACTION}
                            </div>
                            <Modal.Footer>

                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClickButton}
                                    name="close"
                                >
                                    {locale.texts.CLOSE}
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleClickButton}
                                    name="viewReport"
                                    className="mx-3"
                                >
                                    {locale.texts.VIEW_REPORT}
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleClickButton}
                                    name="downloadReport"
                                >
                                    {locale.texts.DOWNLOAD_REPORT}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
}
  
export default DownloadPdfRequestForm;