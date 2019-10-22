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
import CheckboxGroup from './CheckboxGroup'
import Checkbox from '../presentational/Checkbox'
import RadioButtonGroup from './RadioButtonGroup'
import RadioButton from '../presentational/RadioButton'
import { toast } from 'react-toastify';

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

        const options = Object.keys(config.transferredLocation).map(location => {
            return {
                value: location,
                label: locale.texts[location.toUpperCase().replace(/ /g, '_')],
                options: config.transferredLocation[location].map(branch => {
                    return {
                        value: `${location}, ${branch}`,
                        label: locale.texts[branch.toUpperCase().replace(/ /g, '_')],

                    }
                })
            }
        })

        const areaOptions = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')]
            };
        })

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
        const { 
            name,
            type,
            status = '',
            access_control_number,
            mac_address,
            transferred_location,
            area_name,
        } = selectedObjectData

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik                    
                        initialValues = {{
                            name: name || '' ,
                            type: type || '',
                            access_control_number: access_control_number || '',
                            mac_address: mac_address || '',
                            radioGroup: status.value,
                            area: area_name || '',
                            select: status.value === config.objectStatus.TRANSFERRED 
                                ? transferred_location
                                : '',
                            checkboxGroup: selectedObjectData.length !== 0 ? selectedObjectData.monitor_type.split(',') : []
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                name: Yup.string().required(locale.texts.NAME_IS_REQUIRED),
                                type: Yup.string().required(locale.texts.TYPE_IS_REQUIRED),
                                access_control_number: Yup.string()
                                    .required(locale.texts.ACCESS_CONTROL_NUMBER_IS_REQUIRED)
                                    .test(
                                        'access_control_number', 
                                        locale.texts.THE_ACCESS_CONTROL_NUMBER_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.access_control_number || 
                                                !this.props.data.map(item => item.access_control_number).includes(value)
                                        }
                                    ),
                                mac_address: Yup.string()
                                    .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
                                    .test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.mac_address ||
                                                !this.props.data.map(item => item.mac_address).includes(value)
                                        }
                                    ),
                                radioGroup: Yup.string().required(locale.texts.STATUS_IS_REQUIRED),

                                select: Yup.string()
                                    .when('radioGroup', {
                                        is: config.objectStatus.TRANSFERRED,
                                        then: Yup.string().required(locale.texts.LOCATION_IS_REQUIRED)
                                    }),
                                area: Yup.string().required(locale.texts.AREA_IS_REQUIRED),
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
                                transferred_location: values.radioGroup === config.objectStatus.TRANSFERRED 
                                    ? values.select
                                    : '',
                                monitor_type: monitor_type,
                                area: values.area
                            }
                            this.handleSubmit(postOption)                            
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <label htmlFor="name">{locale.texts.NAME}*</label>
                                    <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">{locale.texts.TYPE}*</label>
                                    <Field name="type" type="text" className={'form-control' + (errors.type && touched.type ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="type" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="access_control_number" className='text-uppercase'>{locale.texts.ACN}*</label>
                                    <Field 
                                        name="access_control_number" 
                                        type="text" 
                                        className={'form-control' + (errors.access_control_number && touched.access_control_number ? ' is-invalid' : '')} 
                                        placeholder=''
                                    />
                                    <ErrorMessage name="access_control_number" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mac_address">{locale.texts.MAC_ADDRESS}*</label>
                                    <Field 
                                        name="mac_address" 
                                        type="text" 
                                        className={'form-control' + (errors.mac_address && touched.mac_address ? ' is-invalid' : '')} 
                                        disabled={title.toLowerCase() === locale.texts.EDIT_OBJECT}
                                    />
                                    <ErrorMessage name="mac_address" component="div" className="invalid-feedback" />
                                </div>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.AUTH_AREA}</label>
                                    </Col>
                                    <Col lg={9}>
                                        <Select
                                            placeholder = {locale.texts.SELECT_LOCATION}
                                            name="area"
                                            value = {values.area}
                                            onChange={value => setFieldValue("area", value)}
                                            options={areaOptions}
                                            style={style.select}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.area && errors.area &&
                                                <div style={style.errorMessage}>{errors.area}</div>}
                                            </Col>
                                        </Row>        
                                    </Col>                                        
                                </Row>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <RadioButtonGroup
                                            id="radioGroup"
                                            label={locale.texts.STATUS}
                                            value={values.radioGroup}
                                            error={errors.radioGroup}
                                            touched={touched.radioGroup}
                                        >
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.NORMAL}
                                                label={locale.texts.NORMAL}
                                            />
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.BROKEN}
                                                label={locale.texts.BROKEN}
                                            />
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.RESERVE}
                                                label={locale.texts.RESERVE}
                                            />
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.TRANSFERRED}
                                                label={locale.texts.TRANSFERRED}
                                            />
                                            <Select
                                                name = "select"
                                                value = {values.select}
                                                onChange={value => setFieldValue("select", value)}
                                                options={options}
                                                isSearchable={false}
                                                isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                                                style={style.select}
                                                placeholder={locale.texts.SELECT_LOCATION}
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
                                            label={locale.texts.MONITOR_TYPE}
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
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button type="submit" className="text-capitalize" variant="primary" disabled={isSubmitting}>
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

EditObjectForm.contextType = LocaleContext;
  
export default EditObjectForm;