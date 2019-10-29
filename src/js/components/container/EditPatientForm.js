
import React from 'react';
import { Modal, Image,Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
// import axios from 'axios';
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
  
class EditPatientForm extends React.Component {
    state = {
        show: this.props.show,
    };


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

    // handleSubmit = (postOption) => {
    //     const path = this.props.formPath
    //     axios.post(path, {
    //         formOption: postOption
    //     }).then(res => {
    //         setTimeout(this.props.handleSubmitForm(),1000)
    //     }).catch( error => {
    //         console.log(error)
    //     })
    // }

    render() {
        const locale = this.context

        const options = Object.keys(config.transferredLocation).map(location => {
            return {
                value: location,
                label: locale.texts[location.toUpperCase().replace(/ /g, '_')],
                options: config.transferredLocation[location].map(branch => {
                    return {
                        value: `${location},${branch}`,
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

        var patientPosition = [
            { value: 'one', label: locale.texts.MOVING },
            { value: 'two', label: locale.texts.STATIONARY }
        ];

        const { title, selectedObjectData } = this.props;
        const { 
            name,
            type,
            status = '',
            asset_control_number,
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
                            asset_control_number: asset_control_number || '',
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
                                asset_control_number: Yup.string()
                                    .required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
                                    .test(
                                        'asset_control_number', 
                                        locale.texts.THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.asset_control_number || 
                                                !this.props.data.map(item => item.asset_control_number).includes(value)
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
                                    ).test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_FORM_IS_WRONG,
                                        value => {
                                            var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                            //console.log(value)
                                            if( value.match(pattern)) return true
                                            return false
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
                                area_id: config.mapConfig.areaModules[values.area.value].id
                            }
                            this.handleSubmit(postOption)                            
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                           
                            
                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.AUTH_AREA}</label>
                                    </Col>
                                    <Col lg={9}>
                                <Select
                                            placeholder = {locale.texts.SELECT_AREA}
                                            name="area"
                                            value = {values.area}
                                            onChange={value => setFieldValue("area", value)}
                                            options={areaOptions}
                                            style={style.select}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                />
                                    </Col>
                                </Row>


                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.POSITION}</label>
                                    </Col>


                                    <Col lg={9}>
                                        <Select
                                            placeholder = {locale.texts.POSITION_UNDEFINE}
                                            name="patientPositionName"
                                            value = {values.area.patientPositionName}
                                            onChange={value => setFieldValue("patientPositionName", value)}
                                            options = {patientPosition}
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
                                <div className="form-group">
                                    <label htmlFor="type">{locale.texts.LAST_KNOWN_LOCATION}*</label>
                                    <Field name="type" type="text" className={'form-control' + (errors.type && touched.type ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="type" component="div" className="invalid-feedback" />
                                </div>

                             




                                <div className="form-group">
                                    <label htmlFor="name">{locale.texts.NAME}*</label>
                                    <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="roomNumber">{locale.texts.ROOM_NUMBER}*</label>
                                    <Field name="roomNumber" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="roomNumber" component="div" className="invalid-feedback" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="attendingPhysician">{locale.texts.ATTENDING_PHYSICIAN}*</label>
                                    <Field name="attendingPhysician" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="attendingPhysician" component="div" className="invalid-feedback" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="patientStatus">{locale.texts.STATUS}*</label>
                                    <Field name="patientStatus" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="patientStatus" component="div" className="invalid-feedback" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="patientStatus">{locale.texts.PICTURE}</label>
                                </div>

                                <Image src={config.patientPicture.logo} rounded width={470} height={200} ></Image>

<hr/>








                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <RadioButtonGroup
                                            id="radioGroup"
                                            label={locale.texts.BATTERY_ALERT}
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


                                <Col lg={3} className='text-capitalize'>
                                        <label htmlFor="type">{'UUID' + '+' + 'MAC_Address:'}</label>
                                </Col>



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

EditPatientForm.contextType = LocaleContext;
  
export default EditPatientForm;