import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
    addAssociation,
    addAssociation_Patient
} from "../../dataSrc"
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import config from '../../config'
import messageGenerator from '../../helper/messageGenerator'

class BindForm extends React.Component {

    static contextType = AppContext

    state = {
        mac:'',
        showDetail: false,
        objectName:'',
        objectType:'',
        alertText:'',
        bindData:'', 
    };
  
    handleClose = () => {
        this.setState({
            mac:'',
            showDetail : false,
            objectName:'',
            bindData:'',
            objectType:'',
            selectData: {},
        })
        this.props.handleClose()
    }
 
    render() {
        const { locale } = this.context

        const areaOptions = this.props.areaTable.map(area => {
            return {
                value: area.name,
                label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')],
                id: area.id
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
        let {
            data,
            objectTable,
            show
        } = this.props
        let lock = 0 
        return (
            <Modal 
                show={show} 
                onHide={this.handleClose} 
                size='md'
                className='text-capitalize'
            >
                <Modal.Header 
                    closeButton 
                >
                    {locale.texts.ASSOCIATION}
                </Modal.Header >
                <Modal.Body
                    className='mb-2'
                >
                    <Formik                    
                        initialValues = {{
                           acn:'',
                           mac:'',
                           area:"",
                        }}
                        validationSchema = {
                            Yup.object().shape({
                                acn: Yup.string() 
                                .required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
                                .test(
                                    'acn', 
                                    locale.texts.THE_ASSET_CONTROL_NUMBER_IS_ALREADY_LINK,
                                    value => {  
                                        if (value != undefined){
                                            let findFlag = true 
                                            this.props.objectTable.map(item =>{ 
                                            ( (item.asset_control_number.toUpperCase() == value.toUpperCase()) ) ? findFlag =false : null  
                                            }) 
                                            if (findFlag == false ) {lock = 0 }
                                            else {  lock = 1}
                                            return  findFlag
                                        }
                                    }
                                ) 
                                .test(
                                    'acn', 
                                    locale.texts.ASSET_CONTROL_NUMBER_IS_NOT_FOUND,
                                    value => {
                                        if (value != undefined){
                                            let findFlag = false
                                            let DeviceOrPatient= ''
                                            this.props.bindCase == 1 ? DeviceOrPatient =this.props.ImportData :  DeviceOrPatient =this.props.PatientImportData
                                            //等於１就是儀器 所以只拿object的data
                                            //等於２就是病人 拿patient的data 
                                        
                                            DeviceOrPatient.map(item =>{
                                            if( item.asset_control_number.toUpperCase() == value.toUpperCase() ){
                                                this.setState({bindData:item})
                                                findFlag = true
                                            } 
                                            })
                                            findFlag == true && lock ?  this.setState({showDetail:true}) :  this.setState({showDetail:false})
                                            return findFlag
                                        }
                                    }
                                ) ,


                                mac: Yup.string()
                                .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)

                                /** check if there are duplicated mac address in object table */
                                .test(
                                    'mac_address',
                                    locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT,
                                    value => { 
                                        if (value == undefined) return false 
                                        var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                        if(value.match(pattern)) {
                                            return (!objectTable.map(item => item.mac_address).includes(value.match(/.{1,2}/g).join(':')))
                                        } 
                                        return false
                                    }
                                ),

                                area: Yup.string().required(locale.texts.AREA_IS_REQUIRED),

                            })
                        }

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let formOption = this.state.bindData
                            formOption = {
                                ...formOption,
                                mac_address: values.mac,
                                area_id: values.area.id || 0
                            }
                            if (this.props.bindCase == 1) 
                            {
                                axios.post(addAssociation, {
                                    formOption
                                }).then(res => {
                                    setTimeout(function() {  
                                       this.props.handleSubmitForm()
                                        this.handleClose() 
                                    }.bind(this),1000)
                                }).catch( error => {
                                    console.log(error)
                                })
                            }else if (this.props.bindCase == 2){
                                axios.post(addAssociation_Patient, {
                                    formOption
                                }).then(res => {
                                    setTimeout(function() { 
                                        this.props.handleSubmitForm()
                                        this.handleClose()
                                    }.bind(this),1000)
                                }).catch( error => {
                                    console.log(error)
                                })
                            }
                        
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <small id="TextIDsmall" className="form-text text-muted">{locale.texts.ASSET_CONTROL_NUMBER}</small>
                                   <Field 
                                        type="text"
                                        name="acn"
                                        placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER}
                                        className={'text-capitalize form-control' + (errors.acn && touched.acn ? ' is-invalid' : '')} 
                                    />
                                      <ErrorMessage name="acn" component="div" className="invalid-feedback" />
                                </div>

                                {this.state.showDetail &&
                                    <div>
                                        <div className="form-group">
                                            <small id="TextIDsmall" className="form-text text-muted">{locale.texts.NAME}</small>
                                            <input type="readOnly" className="form-control" id="TextID" placeholder="名稱" disabled = {true}  value={this.state.bindData.name} ></input>  
                                        </div>                                      
                                        <div className="form-group">
                                            <small id="TextTypesmall" className="form-text text-muted">{locale.texts.TYPE}</small>
                                            <input type="readOnly" className="form-control" id="TextType" placeholder="類型" disabled = {true}  value={this.state.bindData.type}></input>  
                                        </div>  
                                        <div className="form-group">
                                            <small id="TextIDsmall" className="form-text text-muted">{locale.texts.AUTH_AREA}</small>

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
                                            <ErrorMessage name="area" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <small id="inputMacAddresssmall" className="form-text text-muted">{locale.texts.MAC_ADDRESS}</small>
                                            <Field 
                                                type="text"
                                                name="mac"
                                                placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS} 
                                                className={'text-capitalize form-control' + (errors.mac && touched.mac ? ' is-invalid' : '')} 
                                            />
                                            <ErrorMessage name="mac" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                }

                                {this.state.showDetail &&
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
                                }
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default BindForm;