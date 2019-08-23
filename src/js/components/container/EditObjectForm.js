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
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment'
import CheckboxGroup from './CheckboxGroup'
import Checkbox from '../presentational/Checkbox'
import RadioButtonGroup from './RadioButtonGroup'
import RadioButton from '../presentational/RadioButton'
import dataSrc from '../../dataSrc'

const options = config.transferredLocation.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})

const objectTypeOptions = config.surveillanceMap.objectType.map(type => {
    let objectTypeObj = {};
    objectTypeObj["value"] = type;
    objectTypeObj["label"] = type;
    return objectTypeObj
})

let monitorTypeMap = {};

Object.keys(config.monitorType).forEach(key => {
    monitorTypeMap[config.monitorType[key]] = key
})
  
class EditObjectForm extends React.Component {
    state = {
        show: this.props.show,
    };

    /**
     * EditObjectForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to EditObjectForm
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

    handleSubmit = (postOption) => {
        const path = this.props.formPath
        axios.post(path, {
            formOption: postOption
        }).then(res => {
            setTimeout(this.props.handleSubmitForm(),1000)
        }).catch( error => {
            console.log(error)
        })
    }

    render() {
        const locale = this.context

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
            errorMessage: {
                width: '100%',
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
                fontSize: '80%',
                color: '#dc3545'
            },
        }

        const { title, selectedObjectData } = this.props;

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {title}
                </Modal.Header >
                <Modal.Body>
                    <Formik                    
                        initialValues = {{
                            name: selectedObjectData.name || '' ,
                            type: selectedObjectData.type || '',
                            access_control_number: selectedObjectData.access_control_number || '',
                            mac_address: selectedObjectData.mac_address || '',
                            radioGroup: selectedObjectData.status || '',
                            select: selectedObjectData.status === config.objectStatus.TRANSFERRED 
                                ? selectedObjectData.transferred_location
                                : '',
                            checkboxGroup: selectedObjectData.length !== 0 ? selectedObjectData.monitor_type.split(',') : []
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                name: Yup.string().required(locale.NAME_IS_REQUIRED),
                                type: Yup.string().required(locale.TYPE_IS_REQUIRED),
                                access_control_number: Yup.string()
                                    .required(locale.ACCESS_CONTROL_NUMBER_IS_REQUIRED)
                                    .test(
                                        'access_control_number', 
                                        'The access control number is already used',
                                        value => {
                                            return value === selectedObjectData.access_control_number || 
                                                !this.props.data.map(item => item.access_control_number).includes(value)
                                        }
                                    ),
                                mac_address: Yup.string()
                                    .required(locale.MAC_ADDRESS_IS_REQUIRED)
                                    .test(
                                        'mac_address',
                                        'The Mac Address is already used',
                                        value => {
                                            return value === selectedObjectData.mac_address ||
                                                !this.props.data.map(item => item.mac_address).includes(value)
                                        }
                                    ),
                                radioGroup: Yup.string().required(locale.STATUS_IS_REQUIRED),

                                select: Yup.string()
                                    .when('radioGroup', {
                                        is: config.objectStatus.TRANSFERRED,
                                        then: Yup.string().required('Location is required')
                                    })
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let monitor_type = values.checkboxGroup
                                    .filter(item => item)
                                    .reduce((sum, item) => {
                                        sum += parseInt(monitorTypeMap[item])
                                        return sum
                                    },0)
                            const postOption = {
                                ...values,
                                status: values.radioGroup,
                                transferredLocation: values.radioGroup === config.objectStatus.TRANSFERRED 
                                    ? values.select.value || values.select
                                    : '',
                                registered_timestamp: moment(),
                                monitor_type: monitor_type
                            }
                            this.handleSubmit(postOption)                            
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <label htmlFor="name">{locale.NAME}*</label>
                                    <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="type">{locale.TYPE}*</label>
                                    <Field name="type" type="text" className={'form-control' + (errors.type && touched.type ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="type" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="access_control_number" className='text-uppercase'>{locale.ACN}*</label>
                                    <Field name="access_control_number" type="text" className={'form-control' + (errors.access_control_number && touched.access_control_number ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="access_control_number" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="mac_address">{locale.MAC_ADDRESS}*</label>
                                    <Field 
                                        name="mac_address" 
                                        type="text" 
                                        className={'form-control' + (errors.mac_address && touched.mac_address ? ' is-invalid' : '')} 
                                        disabled={title.toLowerCase() === locale.EDIT_OBJECT}
                                    />
                                    <ErrorMessage name="mac_address" component="div" className="invalid-feedback" />
                                </div>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <RadioButtonGroup
                                            id="radioGroup"
                                            label={locale.STATUS}
                                            value={values.radioGroup}
                                            error={errors.radioGroup}
                                            touched={touched.radioGroup}
                                        >
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
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.TRANSFERRED}
                                                label={locale.TRANSFERRED}
                                            />
                                            <Select
                                                name="select"
                                                value = {values.select}
                                                onChange={value => setFieldValue("select", value)}
                                                options={options}
                                                isSearchable={false}
                                                isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                                                style={style.select}
                                                placeholder={selectedObjectData.transferred_location || locale.SELECT_LOCATION}
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                        </RadioButtonGroup>
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.radioGroup && errors.radioGroup &&
                                                <div style={style.errorMessage}>{errors.radioGroup}</div>}
                                                {touched.select && errors.select &&
                                                <div style={style.errorMessage}>{errors.select}</div>}
                                            </Col>
                                        </Row>                                                
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <CheckboxGroup
                                            id="checkboxGroup"
                                            label={locale.MONITOR_TYPE}
                                            value={values.checkboxGroup}
                                            error={errors.checkboxGroup}
                                            touched={touched.checkboxGroup}
                                            onChange={setFieldValue}
                                            // onBlur={setFieldTouched}
                                        >
                                        {Object.values(config.monitorType).map((item,index) => {
                                            return <Field
                                                key={index}
                                                component={Checkbox}
                                                name="checkboxGroup"
                                                id={item}
                                                label={item}
                                            />
                                        })}
                                        </CheckboxGroup>
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