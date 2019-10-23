import React from 'react';
import { 
    Modal, 
    Row, 
    Col,
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Field, 
    Form, 
    ErrorMessage 
} from 'formik';
import Select from 'react-select';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'
import CheckBoxGroup from './CheckboxGroup';
import CheckBox from '../presentational/Checkbox';
import * as Yup from 'yup';
import config from '../../config';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { AppContext } from '../../context/AppContext'


class AddUserForm extends React.Component {

    static contextType = AppContext;

    state = {
        show: false,
        isSignin: false,
    }
    
    componentDidUpdate = (preProps) => {

        if (preProps != this.props)
        this.setState({
            show: this.props.show,
        })
    }

    handleClose = () => {
        this.props.onClose()
    }

    changeHandler = () => {

    }

    render() {

        const { locale, auth } = this.context;

        const areaOptions = Object.values(config.mapConfig.areaOptions).map(name => {
            return {
                value: name,
                label: locale.texts[name.toUpperCase().replace(/ /g, '_')]
            };
        })
        const shiftOptions = config.shiftOption.map(name => {
            return {
                value: name,
                label: locale.texts[name.toUpperCase().replace(/ /g, '_')]
            }
        })

        const style = {
            input: {
                padding: 10
            },
                        errorMessage: {
                width: '100%',
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
                fontSize: '80%',
                color: '#dc3545'
            },
        }
        const { title } = this.props
        const { show } = this.state;
        return (
            <Modal show={show} size="sm" onHide={this.handleClose}>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik                    
                        initialValues = {{
                            username: '',
                            password: '',
                            role: config.defaultRole,
                            areaSelect: '',
                            shiftSelect: '',

                        }}

                        validationSchema = {
                            Yup.object().shape({
                                username: Yup.string()
                                    .required(locale.texts.USERNAME_IS_REQUIRED)
                                    .test({
                                        name: 'username', 
                                        message: locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
                                        test: value => {
                                            return value !== undefined && new Promise((resolve, reject) => {
                                                axios.post(dataSrc.validateUsername, {
                                                    username: value.toLowerCase()
                                                })
                                                .then(res => {
                                                    resolve(res.data.precheck)
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                })
                                            })
                                        },
                                    }),
                                areaSelect: Yup.string().required(locale.texts.AREA_IS_REQUIRED),
                                password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED),
                            })
                        }

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            auth.signup(values)
                                .then(res => {
                                    this.props.onClose()
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <label htmlFor="name">{locale.texts.NAME}*</label>
                                    <Field 
                                        name="username" 
                                        type="text" 
                                        style={style.input} 
                                        className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.USERNAME}
                                    />
                                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">{locale.texts.PASSWORD}*</label>
                                    <Field 
                                        name="password" 
                                        type="password" 
                                        className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.PASSWORD}
                                    />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                <hr/>
                                {/* <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <CheckBoxGroup
                                            id="roles"
                                            label={locale.texts.ROLES}
                                            value={values.roles}
                                            error={errors.roles}
                                            touched={touched.roles}
                                            onChange={setFieldValue}
                                        >

                                            {this.props.roleName
                                                .filter(roleName => roleName.name !== 'guest')
                                                .map((roleName, index) => {
                                                    return (
                                                        <Field
                                                            component={CheckBox}
                                                            key={index}
                                                            name="roles"
                                                            id={roleName.name}
                                                            label={locale.texts[roleName.name.toUpperCase()]}
                                                        />
                                                    )
                                            })}
                                        </CheckBoxGroup>
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.radioGroup && errors.radioGroup &&
                                                <div style={style.errorMessage}>{errors.radioGroup}</div>}
                                                {touched.select && errors.select &&
                                                <div style={style.errorMessage}>{errors.select}</div>}
                                            </Col>
                                        </Row>                                                
                                    </Col>
                                </Row> */}
                                <Row className="form-group my-3 text-capitalize">
                                    <Col>
                                        <RadioButtonGroup
                                            id="role"
                                            label={locale.texts.ROLES}
                                            value={values.radioGroup}
                                            error={errors.radioGroup}
                                            touched={touched.radioGroup}
                                        >
                                        {this.props.roleName
                                            .filter(roleName => roleName.name !== 'guest')
                                            .map((roleName, index) => {
                                                return (
                                                    <Field
                                                        component={RadioButton}
                                                        key={index}
                                                        name="role"
                                                        id={roleName.name}
                                                        label={locale.texts[roleName.name.toUpperCase()]}
                                                    />
                                                )
                                        })}
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
                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={4} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.AUTH_AREA}</label>
                                    </Col>
                                    <Col lg={8}>
                                        <Select
                                            placeholder = {locale.texts.SELECT_AREA}
                                            name="areaSelect"
                                            value = {values.areaSelect.value}
                                            onChange={value => setFieldValue("areaSelect", value.value)}
                                            options={areaOptions}
                                            style={style.select}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.areaSelect && errors.areaSelect &&
                                                <div style={style.errorMessage}>{errors.areaSelect}</div>}
                                            </Col>
                                        </Row>        
                                    </Col>                                        
                                </Row>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={4} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.SELECT_SHIFT}</label>
                                    </Col>
                                    <Col lg={8}>
                                        <Select
                                            placeholder = {locale.texts.SELECT_SHIFT}
                                            name="shiftSelect"
                                            value = {values.shiftSelect.value}
                                            onChange={value => setFieldValue("shiftSelect", value.value)}
                                            options={shiftOptions}
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
        )
    }
}

export default AddUserForm