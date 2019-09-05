import React from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext'
import { authenticationService } from '../../authenticationService';
import { signin } from '../../dataSrc'
import axios from 'axios';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'

class SigninPage extends React.Component {

    state = {
        show: false,
        isSignin: false,
    }


    componentDidUpdate = (preProps) => {

        if (preProps != this.props) {
            this.setState({
                show: this.props.show,
            })
        }
    }

    handleClose = () => {
        this.props.handleSignFormClose()
        this.setState({
            show: false
        })
    }


    handleSignupFormShowUp = () => {
        this.props.handleSignupFormShowUp()
    }

    render() {

        const style = {
            input: {
                padding: 10
            }
        }

        const { show } = this.state;
        const locale = this.context;

        return (
            <Modal show={show} size="sm" onHide={this.handleClose}>
                <Modal.Body className='text-capitalize'>
                    <Row className='d-flex justify-content-center'>
                        <Image src={config.image.logo} rounded width={72} height={72} ></Image>
                    </Row>
                    <Row className='d-flex justify-content-center mb-2 mt-1'>
                        <h4 className='text-capitalize'>{locale.texts.SIGN_IN}</h4>
                    </Row>
                    <Formik
                        initialValues = {{
                            username: '',
                            password: '',
                            radioGroup: config.shiftOption[0]
                        }}

                        validationSchema = {
                            Yup.object().shape({
                            username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                            password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                        })}

                        onSubmit={({ username, password, radioGroup }, { setStatus, setSubmitting }) => {
                            axios.post(signin, {
                                username,
                                password,
                                shift: radioGroup, 
                            })
                            .then(res => {
                                if (!res.data.authentication) {  
                                    setStatus(res.data.message)
                                    setSubmitting(false)
                                } else {
                                    this.props.signin(res.data.userInfo)
                                    this.props.handleSigninFormSubmit()
                                }
                            }).catch(error => {
                                console.log(error)
                            })
                        }}

                        render={({ values, errors, status, touched, isSubmitting }) => (
                            <Form>
                                <div className="form-group text-capitalize">
                                    {/* <label htmlFor="username">Username</label> */}
                                    <Field 
                                        name="username" 
                                        type="text" 
                                        style={style.input} 
                                        className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.USERNAME}
                                    />
                                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group text-capitalize">
                                    {/* <label htmlFor="password">Password</label> */}
                                    <Field 
                                        name="password" 
                                        type="password" 
                                        className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.PASSWORD}
                                    />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                <RadioButtonGroup
                                    id="radioGroup"
                                    label={locale.texts.SHIFT}
                                    value={values.radioGroup}
                                    error={errors.radioGroup}
                                    touched={touched.radioGroup}
                                >
                                    {config.shiftOption.map((opt, index) => {
                                        return (                                    
                                            <Field
                                                component={RadioButton}
                                                key={index}
                                                name="radioGroup"
                                                id={opt}
                                                label={locale.texts[opt.toUpperCase().replace(/ /g, '_')]}
                                            />
                                        )
                                    })}

                                </RadioButtonGroup>
                                <div className="form-group pt-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-block text-capitalize"  
                                        disabled={isSubmitting}
                                    >
                                        {locale.texts.SIGN_IN}
                                    </button>
                                </div>
                                {status &&
                                    <div className={'alert alert-danger'}>{status}</div>
                                }
                                <div className='d-flex justify-content-center'>
                                    <button 
                                        type='button' 
                                        className='btn btn-link text-capitalize' 
                                        onClick={this.handleSignupFormShowUp}
                                    >
                                        {locale.texts.SIGN_UP}
                                    </button>
                                </div>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        )
    }


}

SigninPage.contextType = LocaleContext;

export default SigninPage