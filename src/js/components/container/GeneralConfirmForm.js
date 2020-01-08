import React from 'react';
import { 
    Modal, 
    Image, 
    Row, 
    Col,
    Button 
} from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext'
import dataSrc from '../../dataSrc'
import axios from 'axios';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'
import { AppContext } from '../../context/AppContext';

class GeneralConfirmForm extends React.Component {

    static contextType = AppContext

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
        this.props.onClose()
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
            },
            modal: {
                top: '10%',
            }
        }

        const { show } = this.state;
        const { locale } = this.context;

        return (
            <Modal 
                show={show} 
                size="sm" 
                onHide={this.handleClose}
                style={style.modal}
            >
                <Modal.Body className='text-capitalize'>
                    {/* <Row className='d-flex justify-content-center'>
                        <Image src={config.image.logo} rounded width={72} height={72} ></Image>
                    </Row> */}
                    <Row className='d-flex justify-content-center my-2 px-1'>
                        <h6 className='text-capitalize'>{locale.texts.PLEASE_ENTER_ID_AND_PASSWORD}</h6>
                    </Row>

                    <Formik
                        initialValues = {{
                            username: '',
                            password: '',
                            // radioGroup: config.shiftOption[0]
                        }}

                        validationSchema = {
                            Yup.object().shape({
                            username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                            password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                        })}

                        onSubmit={({ username, password, radioGroup }, { setStatus, setSubmitting }) => {
                            axios.post(dataSrc.confirmValidation, {
                                username,
                                password,
                            })
                            .then(res => {
                                console.log(res.data.confirmation)
                                if (!res.data.confirmation) { 
                                    setStatus(res.data.message)
                                    setSubmitting(false)
                                } else {
                                    this.props.handleConfirmFormSubmit(username)
                                }
                            }).catch(error => {
                                console.log(error)
                            })
                        }}

                        render={({ values, errors, status, touched, isSubmitting }) => (
                            <Form>
                                {status &&
                                    <div className={'alert alert-danger mb-2'}>
                                        <i className="fas fa-times-circle mr-1"/>
                                        {status}
                                    </div>
                                }
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
                                {/* <hr/>
                                <RadioButtonGroup
                                    id="radioGroup"
                                    label={locale.texts.SHIFT_SELECT}
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

                                </RadioButtonGroup> */}
                                <Modal.Footer>
                                    <Button 
                                        type="submit" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
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