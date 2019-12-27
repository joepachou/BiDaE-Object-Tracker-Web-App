
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
import { 
    addPatient,
} from "../../dataSrc"
let monitorTypeMap = {};

Object.keys(config.monitorType).forEach(key => {
    monitorTypeMap[config.monitorType[key]] = key
})
  
class EditPatientForm extends React.Component {
    state = {
        show: this.props.show,
    };


    componentDidMount = () => {
    }

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
       
        }).catch( error => {
            console.log(error)
        })
       this.props.handleSubmitForm()
    }


        


    render() {

   



        const locale = this.context


        const { 
            title, 
            selectedObjectData,
            physicianList = []
        } = this.props;

        const { 
            name,
            physician_id,
            area_name,
            room_number,
            id,
            mac_address,
            asset_control_number,
            object_type,
            physician_name,
            monitor_type = [],
            room,
            physicianName
        } = selectedObjectData
     
        const areaOptions = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')]
            };
        })


      

        const genderOptions = [
            { 
                value: '1', 
                label: locale.texts.MALE
            },
            { 
                value: '2', 
                label: locale.texts.FEMALE 
            },
        ]



      


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
        let physicianListOptions = physicianList.map(user => {
            return {
                value: user.id,
                label: user.name
            }
        }) 

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik              
                        initialValues = {{
                            area: area_name || '',
                            name: name || '' ,
                            // roomNumber: room_number || '',
                            mac_address: mac_address || '',
                            asset_control_number:asset_control_number|| '',
                            gender :  object_type === 'Female' 
                                ?   genderOptions[1] 
                                : object_type === '女' 
                                ?   genderOptions[1]
                                : genderOptions[0]
                              ,
                            monitorType: selectedObjectData.length !== 0 ? monitor_type.split('/') : [],
                            room: room 
                                ? {
                                    value: room,
                                    label: room
                                }
                                : null,

                             physician : this.props.physicianName ?
                             {
                                    value: this.props.physicianName,
                                    label:this.props.physicianName
                             }
                             : null
                        }}
                       
                        validationSchema = {
                            
                            Yup.object().shape({
                               
                                
                                name: Yup.string().required(locale.texts.NAME_IS_REQUIRED),
                                // roomNumber: Yup.string().required(locale.texts.ROOMNUMBER_IS_REQUIRED),
                               
                                // physician: Yup.string()
                                // .required(locale.texts.ATTENDING_IS_REQUIRED)
                                // .test(
                                //         'physician',
                                //         locale.texts.THE_ATTENDINGPHYSICIAN_IS_WRONG,
                                //         value => {
                                //             if( isNaN(value) == false) return true
                                //             if (isNaN(value) == true) return false
                                //         }
                                //     ),

                                area: Yup.string().required(locale.texts.AREA_IS_REQUIRED),
                                gender: Yup.string().required(locale.texts.GENDER_IS_REQUIRED),
                                
                                asset_control_number: Yup.string()
                                .required(locale.texts.NUMBER_IS_REQUIRED)
                                .test(
                                    'asset_control_number',
                                    locale.texts.THE_Patient_Number_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.asset_control_number ||
                                                !this.props.data.map(item => item.asset_control_number).includes(value)
                                    }
                                )
                                .test(
                                    'asset_control_number',
                                    locale.texts.THE_Patient_Number_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.asset_control_number ||
                                                !this.props.objectData.map(item => item.asset_control_number).includes(value)
                                    }
                                )
                                ,


                                mac_address: Yup.string()
                                    .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
                                    .test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.mac_address ||
                                                !this.props.data.map(item => item.mac_address.toUpperCase().replace(/:/g, '')).includes(value.toUpperCase().replace(/:/g, ''))
                                        }
                                        
                                    ).test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED,
                                        value => {
                                            return value === selectedObjectData.mac_address ||
                                                !this.props.objectData.map(item => item.mac_address.toUpperCase().replace(/:/g, '')).includes(value.toUpperCase().replace(/:/g, ''))
                                        }
                                        
                                    ).test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_FORM_IS_WRONG,
                                        value => {
                                            if (value == undefined) return false
                                            var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                            if( value.match(pattern)) return true
                                            return false
                                        }
                                    ),
                        })}


                        onSubmit={(values, { setStatus, setSubmitting }) => {
               
                           
                            let monitor_type = values.monitorType
                            .filter(item => item)
                            .reduce((sum, item) => {
                                sum += parseInt(monitorTypeMap[item])
                                return sum
                            },0)
                           
                            const postOption = {
                                ...values,
                                area_id: config.mapConfig.areaModules[values.area.value].id,
                                gender_id : values.gender.value,
                                physician: values.physician ? values.physician.value : 0,
                                monitor_type, 
                                room: values.room ? values.room.label : '',
                                object_type:values.gender.value,
                                physicianIDNumber : this.props.physicianIDNumber
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
                                    <label htmlFor="asset_control_number">{locale.texts.PATIENT_NUMBER}*</label>
                                    <Field disabled={true} name="asset_control_number" type="text" className={'form-control' + (errors.asset_control_number && touched.asset_control_number ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="asset_control_number" component="div" className="invalid-feedback" />
                                </div>
                                
{/* 
                                <div className="form-group">
                                    <label htmlFor="roomNumber">{locale.texts.ROOM_NUMBER}*</label>
                                    <Field name="roomNumber" type="text" className={'form-control' + (errors.roomNumber && touched.roomNumber ? ' is-invalid' : '')} placeholder=''/>
                                    <ErrorMessage name="roomNumber" component="div" className="invalid-feedback" />
                                </div> */}
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
                                <Row className="text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="physician">{locale.texts.ATTENDING_PHYSICIAN}*</label>
                                    </Col>
                                    <Col lg={9}>
                                        <Select
                                            placeholder = {locale.texts.SELECT_PHYSICIAN}
                                            name="physician"
                                            value = {values.physician}
                                            onChange={value => setFieldValue("physician", value)}
                                            options={physicianListOptions}
                                            style={style.select}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="text-capitalize" noGutters>
                                   <Col lg={9}>
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.physician && errors.physician &&
                                                <div style={style.errorMessage}>{errors.physician}</div>}
                                            </Col>
                                        </Row>        
                                    </Col> 
                                </Row>
                                <hr/>
                                <Row className="text-capitalize" noGutters>
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
                                <Row className="text-capitalize" noGutters>
                                   <Col lg={9}>
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.area && errors.area &&
                                                <div style={style.errorMessage}>{errors.area}</div>}
                                            </Col>
                                        </Row>        
                                    </Col> 
                                </Row>
                                <hr/>
                                <Row className="text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.PATIENT_GENDER}</label>
                                    </Col>
                                    <Col lg={9}>
                                        <Select 
                                            placeholder = {locale.texts.CHOOSE_GENDER}
                                            name ="gender"
                                            onChange={this.change} 
                                            onChange={value => setFieldValue("gender", value)}
                                            value={values.gender}
                                            options={genderOptions}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    </Col> 
                                </Row>
                                <hr/>
                                <Row className="text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.ROOM}</label>
                                    </Col>
                                    <Col lg={9}>
                                        <Select 
                                            placeholder = {locale.texts.SELECT_ROOM}
                                            name ="room"
                                            onChange={value => setFieldValue("room", value)}
                                            value={values.room}
                                            options={this.props.roomOptions}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    </Col> 
                                </Row>
                                <Row className="text-capitalize mb-1" noGutters>
                                   <Col lg={9}>
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.room && errors.room &&
                                                <div style={style.errorMessage}>{errors.room}</div>}
                                            </Col>
                                        </Row>        
                                    </Col> 
                                       
                                </Row>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <CheckboxGroup
                                            id="monitorType"
                                            label={locale.texts.MONITOR_TYPE}
                                            value={values.monitorType}
                                            error={errors.monitorType}
                                            touched={touched.monitorType}
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
                                    <Button type="submit" className="text-capitalize" variant="primary" onClick={this.handleSubmit} disabled={isSubmitting}>
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