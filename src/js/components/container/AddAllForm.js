/**
 * AddAllForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import config from '../../config';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AppContext } from '../../context/AppContext';
import dataSrc from "../../dataSrc"
import * as d3 from "d3";

  
class AddAllForm extends React.Component {

    static contextType = AppContext

    state = {
        show: this.props.show,
    };

    /**
     * AddAllForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to AddAllForm
     */
    componentDidUpdate = (prevProps) => {
        if (!(_.isEqual(prevProps, this.props))) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose = () => {
        this.props.handleCloseForm()
    }

    handleSubmit = (values) => {
        let formData = new FormData();
        formData.append("file", values.file)
        axios.post(dataSrc.addBulkObject, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            this.handleClose() 
            this.handleSubmit()
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        const { locale } = this.context

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
                <Modal.Body>
                    <Formik     
                        initialValues={{ 
                            file: null 
                        }}

                        onSubmit={(values) => {
                            this.handleSubmit(values)
                        }}    
                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <label htmlFor="file">File upload</label>
                                <input 
                                    id="file" 
                                    name="file" 
                                    type="file" 
                                    className="form-control" 
                                    onChange={(event) => {
                                        setFieldValue("file", event.currentTarget.files[0]);
                                    }} 
                                />

                                <Modal.Footer className='d-flex bd-highlight'>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.closeModifyUserInfo}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.SEND}
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
  
export default AddAllForm;