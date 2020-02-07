import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AppContext } from '../../context/AppContext';
import LocaleContext from '../../context/LocaleContext';

const DeleteConfirmationForm = ({
    handleClose,
    handleSubmit,
    show
}) => {

    const locale = React.useContext(LocaleContext);

    return (
        <Modal  
            show={show} 
            onHide={handleClose} 
            size="md" 
            id='DeleteConfirmationForm' 
            enforceFocus={false}
        >
            <Modal.Header 
                closeButton 
                className='font-weight-bold text-capitalize'
            >
                {locale.texts.WARNING}
            </Modal.Header >
            <Modal.Body>
                <Formik
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit()
                    }}
                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form className="text-capitalize">
                            <div className="mb-5">
                                {locale.texts.ARE_YOU_SURE_TO_DELETE}
                            </div>
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    className="text-capitalize" 
                                    onClick={handleClose}
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="text-capitalize" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.YES}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
    
}
  
export default DeleteConfirmationForm;
