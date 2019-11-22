/**
 * EditLbeaconForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */

import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '../../context/AppContext';
import RadioButtonGroup from "./RadioButtonGroup"
import RadioButton from "../presentational/RadioButton"

  
class EditLbeaconForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,            
    };
       


    /**
     * EditLbeaconForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to EditLbeaconForm
     */
    componentDidUpdate = (prevProps) => {
        if (prevProps.show != this.props.show && this.props.show) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose = () => {
        this.props.handleCloseForm()
        this.setState({ 
            show: false,
            selectedObjectData: {},
        });
    }
  
    handleShow = () => {
        this.setState({ 
            show: true 
        });
    }

    // handleSubmit(e) {
    //     const buttonStyle = e.target.style
    //     const lbeaconSettingPackage = this.state.formOption
    //     console.log(lbeaconSettingPackage)
    //     lbeaconSettingPackage.uuid = this.props.selectedObjectData.uuid
    //     axios.post(dataSrc.editLbeacon, {
    //         formOption: lbeaconSettingPackage
    //     }).then(res => {
    //         buttonStyle.opacity = 0.4
    //         setTimeout(
    //             function() {
    //                 this.setState({
    //                     formOption: {},
    //                     show: false,
    //                 })
    //                this.props.handleSubmitForm()
    //             }
    //             .bind(this),
    //             1000
    //         )
    //     }).catch( error => {
    //         console.log(error)
    //     })
    // }



    // handleChange(e) {
    //     const target = e.target;
    //     const { name } = target;
    //     this.setState({
    //         formOption: {
    //             ...this.state.formOption,
    //             [name]: target.value
    //         }
    //     })
    // }

  
    render() {

        const { 
            title, 
            selectedObjectData 
        } = this.props;

        const {
            danger_area = '',
            room
        } = selectedObjectData
        const { locale } = this.context;

        const colProps = {
            titleCol: {
                xs: 2,
                sm: 2
            },
            inputCol: {
                xs: 10,
                sm: 10,
            }
        }
        return (
            <Modal show={this.state.show} onHide={this.handleClose} size="md">
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            description: this.props.selectedObjectData.description,
                            danger_area: danger_area 
                                ?   danger_area.toString()
                                :   '0',
                            room,
                        }}

                        validationSchema = {
                            Yup.object().shape({

                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let {
                                description,
                                danger_area,
                                room
                            } = values
                            let lbeaconSettingPackage = {
                                uuid: this.props.selectedObjectData.uuid,
                                description,
                                danger_area,
                                room,
                            }

                            axios.post(dataSrc.editLbeacon, {
                                formOption: lbeaconSettingPackage
                            }).then(res => {
                                setTimeout(
                                    function() {
                                        this.setState({
                                            show: false,
                                        })
                                       this.props.handleSubmitForm()
                                    }
                                    .bind(this),
                                    1000
                                )
                            }).catch( error => {
                                console.log(error)
                            })
                        }}

                        render={({ values, errors, status, touched, isSubmitting }) => (
                            
                            <Form
                                className='text-capitalize'
                            >
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        {locale.texts.UUID}
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                        {selectedObjectData.uuid}
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="my-3">
                                    <Col 
                                        {...colProps.titleCol} 
                                        className='d-flex align-items-center'
                                    >
                                        {locale.texts.LOCATION}
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="description" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="my-3">
                                    <Col 
                                        {...colProps.titleCol} 
                                        className='d-flex align-items-center'
                                    >
                                        {locale.texts.ROOM}
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="room" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="room" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="my-3">
                                    <Col
                                        {...colProps.titleCol} 
                                    >
                                        <RadioButtonGroup
                                                id="danger_area"
                                                label={locale.texts.DANGER_AREA}
                                                value={values.danger_area}
                                                error={errors.danger_area}
                                                touched={touched.danger_area}
                                        />
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field
                                            component={RadioButton}
                                            name="danger_area"
                                            id="1"
                                            label={locale.texts.ENABLE}
                                        />
                                        <Field
                                            component={RadioButton}
                                            name="danger_area"
                                            id="0"
                                            label={locale.texts.DISABLE}
                                        />
                                        <ErrorMessage name="danger_area" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.handleClose} 
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
  
export default EditLbeaconForm;