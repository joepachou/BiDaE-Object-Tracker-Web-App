import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar, ToggleButton} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RadioButton from '../presentational/RadioButton';
import RadioButtonGroup from './RadioButtonGroup';
import { AppContext } from '../../context/AppContext';

class ChangeStatusForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,
        isShowForm: false,
    };

    handleClose = (e) => {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false 
        });
    }
  
    handleShow = () =>  {
        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props && this.props.selectedObjectData.length !== 0) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    handleClick = (e) => {
        const item = e.target.name
        switch(item) {
            case 'add device':
                this.props.handleAdditionalButton(item);
                break;
            case 'add note':
            case 'hide note':
                this.setState({
                    showNotesControl: !this.state.showNotesControl
                })
                break;
        }
    }

    render() {

        const { locale } = this.context

        const options = Object.keys(config.transferredLocation).map(location => {
            return {
                value: location,
                label: locale.texts[location.toUpperCase().replace(/ /g, '_')],
                options: config.transferredLocation[location].map(branch => {
                    return {
                        value: `${location},${branch}`,
                        label: locale.texts[branch.toUpperCase().replace(/ /g, '_')],

                    }
                })
            }
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

            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            },
            textarea: {
                width: '100%'
            }
        }

        const colProps = {
            titleCol: {
                xs: 3,
                sm: 3
            },
            inputCol: {
                xs: 9,
                sm: 9,
            }
        }

        let { title } = this.props;
        let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0] : []
        let {
            transferred_location = ''
        } = selectedObjectData
        return (
            <>  
                <Modal  
                    show={this.state.show} 
                    onHide={this.handleClose} 
                    size="md" 
                    id='changeStatusForm' 
                    enforceFocus={false}
                >
                    <Modal.Header 
                        closeButton 
                        className='font-weight-bold text-capitalize'
                    >
                        {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                    </Modal.Header >
                    <Modal.Body>
                        <div className='modalDeviceListGroup' style={style.deviceList}>
                            {this.props.selectedObjectData.map((item,index) => {
                                return (
                                    <div key={index} >
                                        {index > 0 ? <hr/> : null}
                                        <Row noGutters={true}  className='text-capitalize'>
                                            {this.props.selectedObjectData.length > 1 
                                                ? 
                                                    <Col xs={1} sm={1} className='d-flex align-items-center'>
                                                        <i className="fas fa-times" onClick={this.props.handleRemoveButton} name={item.mac_address}></i> 
                                                    </Col>
                                                : null
                                            }
                                            <Col>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.NAME}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.name}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.TYPE}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.type}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.ACN}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.access_control_number}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                        <hr/>
                        <Formik
                            initialValues = {{
                                radioGroup: this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0].status : '',
                                select: this.props.selectedObjectData.length !== 0 && this.props.selectedObjectData[0].status === config.objectStatus.TRANSFERRED
                                    ? { 
                                        value: selectedObjectData.transferred_location,
                                        label: selectedObjectData.transferred_location.toUpperCase().split(',').map(item => locale.texts[item]).join('/')
                                    }
                                    : '', 
                                textarea: selectedObjectData.notes || ''
                            }}

                            validationSchema = {
                                Yup.object().shape({
                                    radioGroup: Yup.string().required(locale.texts.STATUS_IS_REQUIRED),

                                    select: Yup.string()
                                        .when('radioGroup', {
                                            is: config.objectStatus.TRANSFERRED,
                                            then: Yup.string().required(locale.texts.LOCATION_IS_REQUIRED)
                                        })
                            })}

                            onSubmit={(values, { setStatus, setSubmitting }) => {
                                this.props.handleChangeObjectStatusFormSubmit(values)
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form className="text-capitalize">
                                    <RadioButtonGroup
                                        id="radioGroup"
                                        label={locale.texts.STATUS}
                                        value={values.radioGroup}
                                        error={errors.radioGroup}
                                        touched={touched.radioGroup}
                                    >
                                        <Row>
                                            <Col>
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.NORMAL}
                                                    label={locale.texts.NORMAL}
                                                />
                                            </Col>
                                            <Col>
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.BROKEN}
                                                    label={locale.texts.BROKEN}
                                                />
                                            </Col>
                                            <Col>
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.RESERVE}
                                                    label={locale.texts.RESERVE}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.TRANSFERRED}
                                                    label={locale.texts.TRANSFERRED}
                                                />
                                            </Col>
                                        </Row>
                                        <Select
                                            placeholder = {locale.texts.SELECT_LOCATION}
                                            name="select"
                                            value = {values.select}
                                            onChange={value => setFieldValue("select", value)}
                                            options={options}
                                            isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                                            style={style.select}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                        <Row className='no-gutters' className='d-flex align-self-center'>
                                            <Col>
                                                {touched.radioGroup && errors.radioGroup &&
                                                <div style={style.errorMessage}>{errors.radioGroup}</div>}
                                                {touched.select && errors.select &&
                                                <div style={style.errorMessage}>{errors.select}</div>}
                                            </Col>
                                        </Row>  
                                    </RadioButtonGroup>
                                    <hr/>
                                    <Row>
                                        <Col>
                                            <label 
                                                htmlFor="access_control_number" 
                                                className='text-capitalize'
                                            >
                                                {locale.texts.NOTES}
                                            </label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Field 
                                                component='textarea'
                                                name="textarea" 
                                                rows={3}
                                                placeholder={locale.texts.WRITE_THE_NOTES}
                                                style={style.textarea}
                                            />
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row className='d-flex justify-content-center pb-2'>
                                        <ButtonToolbar >
                                            <Button 
                                                name='add device'
                                                variant="outline-secondary" 
                                                className='mr-2 notShowOnMobile text-capitalize' 
                                                onClick={this.handleClick} 
                                                active={this.props.showAddDevice}
                                                name='add device'
                                            >
                                                {locale.texts.ADD_DEVICE}
                                            </Button>
                                            {/* <Button 
                                                name='add note'
                                                variant="outline-secondary" 
                                                className='mr-2 text-capitalize' 
                                                onClick={this.handleClick}
                                            >
                                                {!this.state.showNotesControl 
                                                    ? locale.texts.ADD_NOTE 
                                                    : locale.texts.HIDE_NOTE
                                                }
                                            </Button> */}
                                        </ButtonToolbar>
                                    </Row>
                                    <Modal.Footer>
                                        <Button 
                                            variant="outline-secondary" 
                                            className="text-capitalize" 
                                            onClick={this.handleClose}
                                        >
                                            {locale.texts.CANCEL}
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="text-capitalize" 
                                            variant="primary" 
                                            disabled={isSubmitting}
                                        >
                                            {locale.texts.SAVE}
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}
  
export default ChangeStatusForm;