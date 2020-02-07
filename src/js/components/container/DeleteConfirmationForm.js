import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from './DateTimePicker'
import { AppContext } from '../../context/AppContext';
import Switcher from './Switcher'
import styleConfig from '../../styleConfig';
import LocaleContext from '../../context/LocaleContext';
import FormikFormGroup from '../presentational/FormikFormGroup'
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'

class DeleteConfirmationForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: false
    }

    handleClose = () => {
        this.props.handleClose()
    }
    
    render() {
        const { 
            locale,
            auth
        } = this.context



        return (
            <Modal  
                show={this.props.show} 
                onHide={this.handleClose} 
                size="md" 
                id='DeleteConfirmationForm' 
                enforceFocus={false}
                centered	

            >
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {"are you sure ? "}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{

                        }}

                        validationSchema = {
                            Yup.object().shape({

                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.props.handleSubmit()
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <div>
                                    are you sure to delete?
                                </div>
                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="text-capitalize" 
                                        onClick={this.handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                    >
                                        {locale.texts.SAVE}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default DeleteConfirmationForm;
