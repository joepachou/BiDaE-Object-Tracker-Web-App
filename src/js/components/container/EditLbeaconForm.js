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

  
class EditLbeaconForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: props.show,            
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }


    /**
     * EditLbeaconForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to EditLbeaconForm
     */

    componentDidUpdate(prevProps) {
        if (prevProps.show != this.props.show && this.props.show) {
            this.setState({
                show: this.props.show,
                // formOption: {
                //     low_rssi: this.state.formOption.low_rssi || this.props.selectedObjectData.low_rssi,
                //     med_rssi: this.state.formOption.med_rssi || this.props.selectedObjectData.med_rssi,
                //     high_rssi: this.state.formOption.high_rssi || this.props.selectedObjectData.high_rssi
                // }
            })
        }
    }
  
    handleClose() {
        this.props.handleCloseForm()
        this.setState({ 
            show: false,
            selectedObjectData: {},
            formOption: {
                low_rssi: '',
                med_rssi: '',
                high_rssi: '',
            }
        });
    }
  
    handleShow() {
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

        const style = {
            input: {
                // borderRadius: 0,
                // borderBottom: '1 solid grey',
                // borderTop: 0,
                // borderLeft: 0,
                // borderRight: 0,
                
            }
        }

        const { title, selectedObjectData } = this.props;
        const locale = this.context;

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
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>{title}</Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            low: this.props.selectedObjectData.low_rssi || '',
                            med: this.props.selectedObjectData.med_rssi || '',
                            high: this.props.selectedObjectData.high_rssi || '',
                            description: this.props.selectedObjectData.description
                        }}

                        validationSchema = {
                            Yup.object().shape({
                            low: Yup.number().negative('The value must be a negative number'),
                            med: Yup.number().negative('The value must be a negative number'),
                            high: Yup.number().negative('The value must be a negative number'),
                            description: Yup.string().required()

                        })}

                        onSubmit={({ low, med, high, description }, { setStatus, setSubmitting }) => {
                            let lbeaconSettingPackage = {
                                uuid: this.props.selectedObjectData.uuid,
                                low_rssi: low,
                                med_rssi: med,
                                high_rssi: high,
                                description,
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

                        render={({ errors, status, touched, isSubmitting }) => (
                            <Form>
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        UUID
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                        {selectedObjectData.uuid}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        Location
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="description" type="text" style={style.input} className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="description" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <hr/>
                                <Row>
                                    <Col className='font-weight-bold'>
                                        RSSI Threshold
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    {/* <label htmlFor="username">Username</label> */}
                                    <Col {...colProps.titleCol} className='d-flex align-items-center'>
                                        {locale.LOW}
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="low" type="text" style={style.input} className={'form-control' + (errors.low && touched.low ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="low" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="form-group">
                                    {/* <label htmlFor="username">Username</label> */}
                                    <Col {...colProps.titleCol}className='d-flex align-items-center'>
                                        {locale.MED}
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="med" type="text" style={style.input} className={'form-control' + (errors.med && touched.med ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="med" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="form-group">
                                    {/* <label htmlFor="username">Username</label> */}
                                    <Col {...colProps.titleCol} className='d-flex align-items-center'>
                                        {locale.HIGH}
                                    </Col>
                                    <Col {...colProps.inputCol}>
                                        <Field name="high" type="text" style={style.input} className={'form-control' + (errors.high && touched.high ? ' is-invalid' : '')} placeholder=''/>
                                        <ErrorMessage name="high" component="div" className="invalid-feedback" />                                    
                                    </Col>
                                </Row>
                                <br/>
                                <Modal.Footer>
                                    <Button variant="outline-secondary" onClick={this.handleClose} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        Send
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

EditLbeaconForm.contextType = LocaleContext;
  
export default EditLbeaconForm;