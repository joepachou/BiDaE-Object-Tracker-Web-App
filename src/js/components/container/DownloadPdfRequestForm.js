import React from 'react';
import { 
    Modal, 
    Button 
} from 'react-bootstrap'
import { 
    Formik, 
    Form 
} from 'formik';
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
                                        onClick={() => {
                                            window.open(pdfPath);
                                        }}
                                        name="viewReport"
                                    >
                                        {locale.texts.VIEW_REPORT}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => {
                                            var link = document.createElement('a');
                                            link.href = `/${pdfPath}`;
                                            link.download = "";
                                            link.click();
                                        }}
                                        name="downloadReport"
                                    >
                                        {locale.texts.DOWNLOAD_REPORT}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleClose}
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