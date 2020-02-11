import React from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dataSrc from '../../dataSrc'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

class GeneralConfirmForm extends React.Component {

    static contextType = AppContext
    
    state = {
        isShowDialog:false,
        dialogText:''
    }

    handleSignupFormShowUp = () => {
        this.props.handleSignupFormShowUp()
    }

   

    render() {
        const { locale } = this.context;

        const {
            show,
            handleClose,
            handleSubmit
        } = this.props

        const {
            dialogText
        } = this.state

        const style = {

            modal: {
                top: '10%',
            },
            alertTextTitle: {
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'rgba(101, 111, 121, 0.78)',
            }
        }
        
        return (
            <Modal 
                show={show} 
                size="sm" 
                onHide={handleClose}
                style={style.modal}
                className='text-capitalize'
            >
                <Modal.Body>
                    <div className='d-flex justify-content-center'>
                        <div className="subtitle my-1">{locale.texts.PLEASE_ENTER_ID_AND_PASSWORD}</div>
                    </div>

                    <Formik
                        initialValues = {{
                            username: '',
                            password: '',
                        }}

                        validationSchema = {
                            Yup.object().shape({
                            username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                            password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                        })}
                    
                        onSubmit={({ username, password, radioGroup }, { setStatus, setSubmitting }) => {
                            this.setState({isShowDialog : false,dialogText:''})

                            axios.post(dataSrc.confirmValidation, {
                                username,
                                password,
                                locale,
                            })
                            .then(res => {
                                if (!res.data.confirmation) { 
                                    this.setState({
                                        isShowDialog : true,
                                        dialogText:res.data.message
                                    })
                                    // setStatus(res.data.message)
                                    setSubmitting(false)
                                } else {   
                                    let areaFlag = false
                                    res.data.areas_id.map(item =>{ //屬不屬於此區域
                                        item == this.props.stateReducer ? areaFlag = true :null
                                    })
                                    if (areaFlag) {  //屬於此區域
                                        res.data.role_id >= 3 
                                                //權限夠嗎
                                            ?   handleSubmit(username)
                                            :   this.setState({
                                                    isShowDialog : true,
                                                    dialogText:locale.texts.AUTHORITY_NOT_ENOUGH
                                                })
                                        
                                    } else { //不屬於此區域
                                        this.setState({
                                            isShowDialog : true,
                                            dialogText:locale.texts.ACCOUNT_NOT_BELONG_THIS_AREA
                                        })
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            })
                        }}

                        render={({ values, errors, status, touched, isSubmitting }) => (
                            <Form>
                                {dialogText &&
                                    <div 
                                        className={'alert alert-danger mb-2 warning'}
                                    >
                                        <i className="fas fa-times-circle mr-2"/>
                                        {dialogText}
                                    </div>
                                }
                                <div className="form-group">
                                    <Field 
                                        name="username" 
                                        type="text" 
                                        className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.USERNAME}
                                    />
                                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <Field 
                                        name="password" 
                                        type="password" 
                                        className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.PASSWORD}
                                    />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                
                                <Modal.Footer>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={isSubmitting && !this.state.isShowDialog}
                                    >
                                        {locale.texts.CONFIRM}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}

export default GeneralConfirmForm