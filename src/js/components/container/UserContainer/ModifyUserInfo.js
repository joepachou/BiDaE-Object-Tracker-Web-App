import React from 'react';
import { Col, Row, ListGroup, Modal, Button, Navbar, Nav } from 'react-bootstrap';
import LocaleContext from '../../../context/LocaleContext';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../presentational/RadioButton'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select'
import * as Yup from 'yup';
import config from '../../../config'

const Fragment = React.Fragment;

export default class ModifyUserInfo extends React.Component{

    constructor() {
        super();
        this.state = {
           userInfo: null,
           show: false
        }
        this.staticParameter = {
            userRole: null
        }
        this.API = {
            openUserInfo: (userInfo) => {
                this.state.userInfo = userInfo
                this.setState({})
            },
            closeUserInfo: () => {
                // this.staticParameter.userRole = null
                this.state.userInfo = null
                this.setState({})
            }
        }
        this.closeModifyUserInfo = this.closeModifyUserInfo.bind(this)
        this.onSelectRoleCheck = this.onSelectRoleCheck.bind(this)
        this.submitModifyUserInfo = this.submitModifyUserInfo.bind(this)
    }

    componentDidMount(){
        if(this.props.getAPI){
            this.props.getAPI(this.API)
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.show && !this.props.show){
            this.staticParameter.userRole = nextProps.userRole
            return true
        }
        return true
    }
    componentDidUpdate(prevProps, PrevState){        
    }
    
    closeModifyUserInfo(){
        this.staticParameter.userRole = null
        this.API.closeUserInfo()
        this.props.onClose()        
    }

    submitModifyUserInfo(values){
        this.staticParameter.userRole = null
        this.API.closeUserInfo()
        this.props.onSubmit(values)
    }

    onSelectRoleCheck(e){
        var name = e.target.name
        this.staticParameter.userRole = name

        this.setState({})
    }

    render(){
        const {
            show
        } = this.state
        const { userRole } = this.staticParameter
        const locale = this.context
        const {
            user
        } = this.props

        const shiftOptions = config.shiftOption.map(name => {
            return {
                value: name,
                label: locale.texts[name.toUpperCase().replace(/ /g, '_')]
            }
        })

        const colProps = {
            titleCol: {
                xs: 2,
                sm: 2
            },
            inputCol: {
                xs: 10,
                sm: 10,
            }
        }

        const style = {
            input: {
                // borderRadius: 0,
                // borderBottom: '1 solid grey',
                // borderTop: 0,
                // borderLeft: 0,
                // borderRight: 0,
                
            }
        }
        return(
            <Modal 
                show={this.props.show}
                onHide={this.closeModifyUserInfo}
                className='text-capitalize'
            >
                <Modal.Header closeButton className='font-weight-bold'>  
                    {locale.texts.EDIT_USER}
                </Modal.Header>
                <Modal.Body>
                    <Formik     
                        initialValues = {{
                            roleSelect: userRole,
                            shiftSelect: user ? user.shift : null
                        }}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.submitModifyUserInfo(values)
                        }}    
                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Row >
                                    <Col {...colProps.titleCol}>
                                        {locale.texts.NAME}
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1 text-lowercase'>
                                        {user ? user.name : ''}
                                    </Col>
                                </Row>
                                <hr/>
                                <RadioButtonGroup
                                    id="roleSelect"
                                    label={locale.texts.ROLES}
                                    value={values.roleSelect}
                                    error={errors.roleSelect}
                                    touched={touched.roleSelect}
                                >
                                {this.props.roleName
                                    .filter(roleName => roleName.name !== 'guest')
                                    .map((roleName, index) => {
                                        return (
                                            <Field
                                                component={RadioButton}
                                                key={index}
                                                name="roleSelect"
                                                id={roleName.name}
                                                label={locale.texts[roleName.name.toUpperCase()]}
                                            />
                                        )
                                })}
                                </RadioButtonGroup>
                                <hr/>
                                <Row className="form-group my-3 text-capitalize" noGutters>
                                    <Col lg={3} className='d-flex align-items-center'>
                                        <label htmlFor="type">{locale.texts.SELECT_SHIFT}</label>
                                    </Col>
                                    <Col lg={9}>
                                        <Select
                                            placeholder = {locale.texts.SELECT_SHIFT}
                                            name="shiftSelect"
                                            value={values.shiftSelect}
                                            onChange={value => setFieldValue("shiftSelect", value)}
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
                                <Modal.Footer className='d-flex bd-highlight'>
                                    <Button 
                                        variant="outline-danger" 
                                        onClick={this.props.deleteUser}
                                        className='text-capitalize mr-auto bd-highlight'
                                    >
                                        {locale.texts.DELETE}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.closeModifyUserInfo}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.SEND}
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
ModifyUserInfo.contextType = LocaleContext;