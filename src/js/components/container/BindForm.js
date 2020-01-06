/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
    getImportData,
    editImportData
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


class BindForm extends React.Component {

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

        if (this.state.showDetail){
            var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
            if( this.state.mac_address.match(pattern)) {
                let formOption = []
                formOption.push(this.state.inputValue)
                formOption.push(this.state.mac_address)
                formOption.push(this.state.objectName)
                formOption.push(this.state.objectType)

                console.log(formOption)
                axios.post(editImportData, {
                    formOption
                }).then(res => {
                    setTimeout(function() { 
                        this.props.handleSubmitForm()
                        this.handleClose()
                    }.bind(this),1000)
                }).catch( error => {
                    console.log(error)
                })
            } else {
                setTimeout(this.props.handleSubmitForm(),1000)
                alert("連結失敗，MAC格式錯誤");
                this.props.handleCloseForm()
                this.handleClose()
            } 
        } else {
            setTimeout(this.props.handleSubmitForm(),1000)
            alert("連結失敗，表裡沒有這個acn");
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

    handleChange(){
    //   console.log(this.state.inputValue)
    //   console.log(this.props.data)
    this.setState({showDetail : false}) 
        this.props.data.map(item => {
            if(item.asset_control_number == this.state.inputValue )
              this.setState({showDetail : true}) 
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


    render() {
        const { locale } = this.context
        let {
            data
        } = this.props
        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {locale.texts.ASSOCIATION}
                </Modal.Header >
                <Modal.Body
                    className='mb-2'
                >
                    <Formik                    
                        initialValues = {{
                           acn:''
                        }}
                        validationSchema = {
                            Yup.object().shape({
                                acn: Yup.string()
                                    .required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
                                    .test(
                                        'acn', 
                                        locale.texts.ASSET_CONTROL_NUMBER_IS_NOT_FOUND,
                                        value => {
                                            if (Object.keys(data).includes(value)) {
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
                            this.handleSubmit()
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                   <Field 
                                        type="text"
                                        name="acn"
                                        placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER}
                                        className={'text-capitalize form-control' + (errors.acn && touched.acn ? ' is-invalid' : '')} 
                                        // value={this.state.inputValue}
                                        // onChange={this.updateInput()}
                                    />
                                      <ErrorMessage name="acn" component="div" className="invalid-feedback" />
                                </div>

                                {this.state.showDetail &&
                                    <div>
                                        <div className="form-group">
                                            <small id="TextIDsmall" className="form-text text-muted">{locale.texts.NAME}</small>
                                            <input type="readOnly" className="form-control" id="TextID" placeholder="名稱" disabled = {true}  value={this.state.objectName} ></input>  
                                        </div>                                      
                                        <div className="form-group">
                                            <small id="TextTypesmall" className="form-text text-muted">{locale.texts.TYPE}</small>
                                            <input type="readOnly" className="form-control" id="TextType" placeholder="類型" disabled = {true}  value={this.state.objectType}></input>  
                                        </div>  

                                        <div className="form-group">
                                            <small id="inputMacAddresssmall" className="form-text text-muted">{locale.texts.MAC_ADDRESS}</small>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="MacAddress" 
                                                placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS} 
                                                value={this.state.mac_address}  
                                                onChange={this.handleMacAddress.bind(this)}
                                            />  
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