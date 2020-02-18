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
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import CheckboxGroup from './CheckboxGroup'
import Checkbox from '../presentational/Checkbox'
import RadioButtonGroup from './RadioButtonGroup'
import RadioButton from '../presentational/RadioButton'
import { isNull } from 'util';
import { AppContext } from '../../context/AppContext';
import dataSrc from '../../dataSrc'
import styleConfig from '../../styleConfig';
import FormikFormGroup from '../presentational/FormikFormGroup'


let monitorTypeMap = {};

Object.keys(config.monitorType)
    .forEach(key => {
        monitorTypeMap[config.monitorType[key]] = key
})

class EditObjectForm extends React.Component {

    static contextType = AppContext

    state = {
        transferredLocationOptions: [],
    };

    componentDidMount = () => {
        this.getTransferredLocation();
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
            const transferredLocationOptions = res.data.map(branch => {
                return {          
                    label: branch.branch_name,
                    value: branch,
                    options: branch.department
                        .map((department, index) => {
                            return {
                                label: `${department},${branch.branch_name}`,
                                value: {
                                    branch,
                                    departmentId: index,
                                }
                            }
                    }),
                    id: branch.id
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

        const { 
            title, 
            selectedObjectData,
            importData,
            objectTable,
            show,
            handleClose
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
            <Modal 
                show={show} 
                onHide={handleClose} 
                size='md'
                className='text-capitalize'
            >
                <Modal.Header 
                    closeButton 
                >
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik                    
                        initialValues = {{
                            name: name || '' ,
                            type: type || '',
                            asset_control_number: asset_control_number || '',
                            mac_address: mac_address || '',
                            status: status.value ,
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
                                        locale.texts.THE_MAC_ADDRESS_FORM_IS_WRONG,
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
                                        
                                    )
                                    .test(
                                        'mac_address',
                                        locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED ,
                                        value =>{
                                            let repeatFlag = false
                                            this.props.data.map(item => {
                                                if (item.asset_control_number != this.props.selectedObjectData.asset_control_number){
                                                     item.mac_address == value ?  repeatFlag = true : null
                                                }
                                            })
                                            return !repeatFlag
                                           
                                        }
                                    ),

                                status: Yup.string().required(locale.texts.STATUS_IS_REQUIRED),

                                transferred_location: Yup.string()
                                    .when('status', {
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
                            console.log(values.transferred_location)
                            const postOption = {
                                id,
                                ...values,
                                status: values.status,
                                transferred_location: values.status === config.objectStatus.TRANSFERRED 
                                    ? `${values.transferred_location.value.branch.id},${values.transferred_location.value.departmentId}`
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
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="name"
                                            label={locale.texts.NAME}
                                            error={errors.name}
                                            touched={touched.name}
                                            placeholder=""
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="type"
                                            label={locale.texts.TYPE}
                                            error={errors.type}
                                            touched={touched.type}
                                            placeholder=""
                                        />
                                    </Col>
                                </Row>
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="mac_address"
                                            label={locale.texts.MAC_ADDRESS}
                                            error={errors.mac_address}
                                            touched={touched.mac_address}
                                            placeholder=""
                                            disabled={this.props.disableASN ? 1 : 0}
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="area"
                                            label={locale.texts.AUTH_AREA}
                                            error={errors.area}
                                            touched={touched.area}
                                            placeholder=""
                                            component={() => ( 
                                                <Select
                                                    placeholder={locale.texts.SELECT_AREA}
                                                    name="area"
                                                    value = {values.area}
                                                    onChange={value => setFieldValue("area", value)}
                                                    options={areaOptions}
                                                    styles={styleConfig.reactSelect}
                                                    components={{
                                                        IndicatorSeparator: () => null
                                                    }}
                                                />
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <FormikFormGroup 
                                    type="text"
                                    name="asset_control_number"
                                    label={locale.texts.ACN}
                                    error={errors.asset_control_number}
                                    touched={touched.asset_control_number}
                                    placeholder=""
                                    disabled= {this.props.disableASN ? 1 : 0}
                                />
                                <hr/>
                                <FormikFormGroup 
                                    name="status"
                                    label={locale.texts.STATUS}
                                    error={errors.status}
                                    touched={touched.status}
                                    placeholder=""
                                    component={() => (
                                        <RadioButtonGroup
                                            value={values.status}
                                            error={errors.status}
                                            touched={touched.status}
                                        >
                                            <div className="d-flex justify-content-between form-group my-1">
                                                <Field  
                                                    component={RadioButton}
                                                    name="status"
                                                    id={config.objectStatus.NORMAL}
                                                    label={locale.texts.NORMAL}
                                                />
        
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={config.objectStatus.BROKEN}
                                                    label={locale.texts.BROKEN}
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={config.objectStatus.RESERVE}
                                                    label={locale.texts.RESERVE}
                                                />
                                                
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={config.objectStatus.TRANSFERRED}
                                                    label={locale.texts.TRANSFERRED}
                                                />
                                            </div>
                                        </RadioButtonGroup>  
                                    )}

                                />  
                                <FormikFormGroup 
                                    name="select"
                                    label={locale.texts.AREA}
                                    error={errors.transferred_location}
                                    touched={touched.transferred_location}
                                    placeholder=""
                                    display={values.status == 'transferred'}
                                    component={() => (
                                        <Select
                                            name="select"
                                            value = {values.transferred_location}
                                            className="my-1"
                                            onChange={value => setFieldValue("transferred_location", value)}
                                            options={this.state.transferredLocationOptions}
                                            isSearchable={false}
                                            isDisabled={values.status !== config.objectStatus.TRANSFERRED}
                                            styles={styleConfig.reactSelect}
                                            placeholder={locale.texts.SELECT_LOCATION}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    )}
                                />
                                <hr/> 
                                <FormikFormGroup 
                                    name="asset_control_number"
                                    label={locale.texts.MONITOR_TYPE}
                                    error={errors.checkboxGroup}
                                    touched={touched.checkboxGroup}
                                    placeholder=""
                                    component={() => (
                                        <CheckboxGroup
                                            id="checkboxGroup"
                                            label={locale.texts.MONITOR_TYPE}
                                            value={values.checkboxGroup || ''}
                                            error={errors.checkboxGroup}
                                            touched={touched.checkboxGroup}
                                            onChange={setFieldValue}
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
                                    )}
                                />                                           
                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="button" 
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