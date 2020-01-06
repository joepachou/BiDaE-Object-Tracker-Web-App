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
import { isNull } from 'util';
import { AppContext } from '../../context/AppContext';
import dataSrc from '../../dataSrc'


let monitorTypeMap = {};

Object.keys(config.monitorType)
    .forEach(key => {
        monitorTypeMap[config.monitorType[key]] = key
})

class EditObjectForm extends React.Component {

    static contextType = AppContext

    state = {
        show: this.props.show,
        transferredLocationOptions: [],
    };

    componentDidMount = () => {
        this.getTransferredLocation();
      
     }

    
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
           
        }).catch( error => {
            console.log(error)
        })
        this.props.handleSubmitForm()
    }
        


    getTransferredLocation = () => {
        let { locale } = this.context
        axios.get(dataSrc.getTransferredLocation)
        .then(res => {
            const transferredLocationOptions = res.data.map(loc => {
                return {          
                    value: loc.transferred_location,
                    label: locale.texts[loc.transferred_location.toUpperCase().replace(/ /g, '_')],
                    options: Object.values(loc)
                        .filter((item, index) => index > 0)
                        .map(branch => {
                            return {
                                value: `${loc.transferred_location},${branch}`,
                                label: locale.texts[branch.toUpperCase().replace(/ /g, '_')],
                            }
                    })
                }

            })
            this.setState({
                transferredLocationOptions
            })
        })
    }


    render() {
        const { locale } = this.context

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

        const { 
            title, 
            selectedObjectData,
            importData,
            objectTable
        } = this.props;

        const { 
            id,
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
                            radioGroup: status.value ,
                            area: area_name || '',
                            select: status.value === config.objectStatus.TRANSFERRED 
                                ? transferred_location 
                                : '',
                            checkboxGroup: selectedObjectData.length !== 0 
                                ?   selectedObjectData.monitor_type == 0 
                                    ? null
                                    : selectedObjectData.monitor_type.split('/') 
                                : []
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
                                            if (this.props.selectedObjectData.length == 0) {
                                                return (!(importData.map(item => item.asset_control_number).includes(value)))
                                            } 
                                            return true
                                        }
                                    ),
                                mac_address: Yup.string()
                                    .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)

                                    /** check if there are duplicated mac address in object table */
                                    .test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT,
                                        value => {
                                            if (value == undefined) return false

                                            if (this.props.selectedObjectData.length != 0) {
                                                return true
                                            } else {

                                                var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                                if(value.match(pattern)) {
                                                    return (!objectTable.map(item => item.mac_address).includes(value.match(/.{1,2}/g).join(':')))
                                                } 
                                                return false
                                            }
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
                            let monitor_type  = 0
                            if ( isNull(values.checkboxGroup)){

                            }else{
                                monitor_type = values.checkboxGroup
                                    .filter(item => item)
                                    .reduce((sum, item) => {
                                        sum += parseInt(monitorTypeMap[item])
                                        return sum
                                    },0)      
                            }
                            const postOption = {
                                id,
                                ...values,
                                status: values.radioGroup,
                                transferred_location: values.radioGroup === config.objectStatus.TRANSFERRED 
                                    ? values.select.value
                                    : '',
                                monitor_type: monitor_type || 0,
                                area_id: config.mapConfig.areaModules[values.area.value].id || 0
                            }

                            while(postOption.type[postOption.type.length-1] == " "){
                                postOption.type = postOption.type.substring(0,postOption.type.length-1);       
                            }
                            while(postOption.name[postOption.name.length-1] == " "){
                                postOption.name = postOption.name.substring(0,postOption.name.length-1);       
                            }
                            this.handleSubmit(postOption)                            
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
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
                                    <label htmlFor="asset_control_number" className='text-uppercase'>{locale.texts.ACN}*</label>
                            
                                    <Field 
                                        disabled= {this.props.disableASN ? 1 : 0}
                                        name="asset_control_number" 
                                        type="text" 
                                        className={'form-control' + (errors.asset_control_number && touched.asset_control_number ? ' is-invalid' : '')} 
                                        placeholder=''
                                    />
                                    <ErrorMessage name="asset_control_number" component="div" className="invalid-feedback" />
                                </div>


                                
                                <div className="form-group">
                                    <label htmlFor="mac_address">{locale.texts.MAC_ADDRESS}*</label>
                                    <Field 
                                        disabled =  {this.props.disableASN? 1 : 0}
                                        name="mac_address" 
                                        type="text" 
                                        className={'form-control' + (errors.mac_address && touched.mac_address ? ' is-invalid' : '')} 
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
                                                options={this.state.transferredLocationOptions}
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
                                            value={values.checkboxGroup || ''}
                                            error={errors.checkboxGroup}
                                            touched={touched.checkboxGroup}
                                            onChange={setFieldValue}
                                            // onBlur={setFieldTouched}
                                        >
                                            {Object.keys(config.monitorType)
                                                .filter(key => config.monitorTypeMap.object.includes(parseInt(key)))
                                                .map((key,index) => {
                                                    return <Field
                                                        key={index}
                                                        component={Checkbox}
                                                        name="checkboxGroup"
                                                        id={config.monitorType[key]}
                                                        label={config.monitorType[key]}
                                                    />
                                            })}
                                        </CheckboxGroup>
                                    </Col>
                                </Row>

                                <Modal.Footer>
                                    <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                        onClick={submitForm}
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
  
export default EditObjectForm;