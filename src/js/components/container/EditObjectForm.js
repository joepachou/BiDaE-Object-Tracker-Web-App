/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
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
import RadioButton from '../presentational/RadioButton'
import moment from 'moment'


const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class EditObjectForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            isShowForm: false,
            formOption: {
                name: '',
                type: '',
                status: '', 
                access_control_number: '',
                transferredLocation: null,
            }
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    /**
     * EditObjectForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to EditObjectForm
     */

    componentDidUpdate(prevProps) {
        const { name, type, status, transferred_location, access_control_number } = this.props.selectedObjectData;
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
                formOption: {
                    name: name,
                    type: type,
                    status: status,
                    access_control_number: access_control_number,
                    transferredLocation: transferred_location ? {
                        'value': transferred_location, 
                        'label': transferred_location
                    } : null,
                }
            })
        }
    }
  
    handleClose() {
        this.setState({ 
            show: false,
            formOption: {}
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    handleSubmit(postOption) {
        const path = this.props.formPath
        console.log(path)
        axios.post(path, {
            formOption: postOption
        }).then(res => {
            setTimeout(
                function() {
                   this.setState ({
                       show: false,
                   })
                   this.props.handleSubmitForm();
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    }

    handleCheck(e) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                status: e.target.value,
            }
        })
    }

    handleSelect(selectedOption) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                transferredLocation: selectedOption,
            }
        })
    }

    handleChange(e) {
        const target = e.target;
        const { name } = target;
        this.setState({
            formOption: {
                ...this.state.formOption,
                [name]: target.value
            }
        })
    }

  
    render() {

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            }
        }

        const { title, selectedObjectData } = this.props;

        const locale = this.context

        const colProps = {
            titleCol: {
                xs: 5,
                sm: 5
            },
            inputCol: {
                xs: 7,
                sm: 7,
            }
        }

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>{title}</Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            name: selectedObjectData.name || '' ,
                            type: selectedObjectData.type || '',
                            access_control_number: selectedObjectData.access_control_number || '',
                            mac_address: selectedObjectData.mac_address || '',
                            radioGroup: selectedObjectData.status || '',
                            select: this.props.selectedObjectData.status === config.objectStatus.TRANSFERRED 
                                ? this.props.selectedObjectData.transferred_location
                                : '',
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                radioGroup: Yup.string().required('Object status is required'),

                                select: Yup.string()
                                    .when('radioGroup', {
                                        is: config.objectStatus.TRANSFERRED,
                                        then: Yup.string().required('Location is required')
                                    })
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            const postOption = {
                                ...values,
                                status: values.radioGroup,
                                transferredLocation: values.radioGroup === config.objectStatus.TRANSFERRED ? values.select.value : '',
                                registered_timestamp: moment()
                            }

                            delete postOption.radioGroup
                            delete postOption.select
                            this.handleSubmit(postOption)
                            
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="name">Device Name</label>
                                    <Field name="name" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="type">Device Type</label>
                                    <Field name="type" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="type" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="access_control_number">ACN</label>
                                    <Field name="access_control_number" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="access_control_number" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="mac_address">Mac Address</label>
                                    <Field name="mac_address" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} disabled={title.toLowerCase() === locale.EDIT_OBJECT}/>
                                    <ErrorMessage name="mac_address" component="div" className="invalid-feedback" />
                                </div>
                                <hr/>
                                <Row className="form-group my-3">
                                    <Col sm={2} className='d-flex'>
                                        <label htmlFor="status">{locale.STATUS}</label>
                                    </Col>
                                    <Col sm={10}>
                                        <Field
                                            component={RadioButton}
                                            name="radioGroup"
                                            id={config.objectStatus.NORMAL}
                                            label={locale.NORMAL}
                                        />
                                    
                                        <Field
                                            component={RadioButton}
                                            name="radioGroup"
                                            id={config.objectStatus.BROKEN}
                                            label={locale.BROKEN}
                                        />

                                        <Field
                                            component={RadioButton}
                                            name="radioGroup"
                                            id={config.objectStatus.RESERVE}
                                            label={locale.RESERVE}
                                        />

                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col sm={4} className='d-flex align-self-center'>
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.TRANSFERRED}
                                                    label={locale.TRANSFERRED}
                                                />
                                            </Col>
                                            <Col sm={8}>
                                                <Select
                                                    placeholder = "Select Location"
                                                    name="select"
                                                    value = {values.select}
                                                    onChange={value => setFieldValue("select", value)}
                                                    options={options}
                                                    isSearchable={false}
                                                    isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                                                    style={style.select}
                                                    placeholder={selectedObjectData.transferred_location}
                                                    components={{
                                                        IndicatorSeparator: () => null
                                                    }}
                                                />
                                                {touched.select && errors.select &&
                                                <div style={style.errorMessage}>{errors.select}</div>}
                                            </Col>
                                        </Row>                                                
                                    </Col>
                                </Row>
                                <Modal.Footer>
                                    <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                                        {locale.CANCEL}
                                    </Button>
                                    <Button type="submit" className="text-capitalize" variant="primary" disabled={isSubmitting}>
                                        {locale.SAVE}
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

EditObjectForm.contextType = LocaleContext;
  
export default EditObjectForm;