/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { 
    getImportData,
    editImportData,
    deleteDevice
} from "../../dataSrc"

import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as preloader from "./preloader.json";
import * as success from "./success.json";
import { AppContext } from '../../context/AppContext';
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: preloader.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: success.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };


class DissociationForm extends React.Component {

    static contextType = AppContext

    state = {
        show: this.props.show,
        inputValue:'',
        showDetail : '',
        objectName:'',
        objectType:'',
        mac_address:'',
        alertText:'',
        ISuxTest:false,
        ISuxTest_success:false
    };

    componentDidUpdate = (prevProps) => {
        if (!(_.isEqual(prevProps, this.props))) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose = () => {
        this.setState({
            inputValue:'',
            showDetail : false,
            objectName:'',
            objectType:'',
            mac_address:''
    })
        this.props.handleCloseForm()
    }

    handleSubmit = (postOption) => {
        if (this.state.showDetail)  {
            axios.post(deleteDevice, {
                formOption: [postOption]
            }).then(res => {
                this.UXtest()
            }).catch( error => {
                console.log(error)
            })
        } else {
            setTimeout(this.props.handleSubmitForm(),1000)
            alert("連結失敗，表裡沒有這個ASN");
            this.props.handleCloseForm()
            this.handleClose()
        }    
    }

    handleMacAddress(event){
        this.setState({mac_address : event.target.value })
    }



    updateInput = (event) => {
     this.setState({inputValue : event.target.value })
        setTimeout(() => {
            this.handleChange()   
         }, 500);
    }

    handleChange()  {
        this.setState({
            showDetail : false
        }) 
        this.props.data.map(item => {
            if(item.asset_control_number == this.state.inputValue )
                this.setState({showDetail : true}
            ) 
        })

        this.state.showDetail ?
            axios.post(getImportData, {
                    formOption: this.state.inputValue
                }).then(res => {
                    res.data.rows.map(item => {
                        this.setState({
                                objectName: item.name,
                                objectType: item.type,
                            }) 
                    })
                }).catch( error => {
                    console.log(error)
                })
            :
            null
    }

    UXtest = () => {
        this.setState({ISuxTest: true}) 
        setTimeout(function() 
        { 
            this.setState({ISuxTest: false})
            this.setState({ISuxTest_success: true}) 
            setTimeout(function() { 
                this.setState({ISuxTest_success: false})
                this.props.handleSubmitForm()
                this.handleClose()
            }.bind(this),1000)
        }.bind(this), 1000)
    
    }

    render() {
        const { locale } = this.context


        const { 
            title, 
            data
        } = this.props;

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body
                    className='mb-2'
                >
                    <Formik                    
                        initialValues = {{
                           mac:''
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                mac: Yup.string()
                                    .required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
                                    .test(
                                        'mac', 
                                        "mac未在列表上" ,
                                        value => {
                                            if (Object.keys(data).includes(value) ||
                                                Object.keys(data).includes(value.match(/.{1,2}/g).join(':'))
                                            ) {
                                                this.setState({
                                                    objectName: data[value].name,
                                                    objectType: data[value].type,
                                                    showDetail : true,
                                                    inputValue : value
                                                }) 
                                                return true
                                            } else return false
                                        }
                                    )
                            })
                        }

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                                this.handleSubmit(values.mac)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <Field 
                                        type="text"
                                        name="mac"
                                        placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS}
                                        className={'form-control' + (errors.mac && touched.mac ? ' is-invalid' : '')} 
                                        // value={this.state.inputValue}
                                        // onChange={this.updateInput()}
                                    />
                                      <ErrorMessage name="mac" component="div" className="invalid-feedback" />
                                </div>

                                {this.state.showDetail
                                    ?   <div>
                                            <div className="form-group">
                                              
                                                <div className="form-group">
                                                <small id="TextIDsmall" className="form-text text-muted">{locale.texts.NAME}</small>
                                                    <input type="readOnly" className="form-control" id="TextID" placeholder="名稱" disabled = {true}  value={this.state.objectName} ></input>  
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                
                                                <div className="form-group">
                                                <small id="TextTypesmall" className="form-text text-muted">{locale.texts.TYPE}</small>
                                                    <input type="readOnly" className="form-control" id="TextType" placeholder="類型" disabled = {true}  value={this.state.objectType}></input>  
                                                </div>  
                                            </div>
                                        </div>
                                    :   null
                                }
                               
                                <FadeIn>
                                    <div className="d-flex justify-content-center align-items-center">
                                    {this.state.ISuxTest ? (
                                        <Lottie options={defaultOptions} height={120} width={120} /> 
                                    ) : (
                                        null
                                    )}
                                    </div>
                                </FadeIn>
                                <FadeIn>
                                    <div className="d-flex justify-content-center align-items-center">
                                    {this.state.ISuxTest_success ? (
                                        <Lottie options={defaultOptions2} height={120} width={120} /> 
                                    ) : (
                                        null
                                    )}
                                    </div>
                                </FadeIn>
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
  
export default DissociationForm;