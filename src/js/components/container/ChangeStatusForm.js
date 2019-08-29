import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar, ToggleButton} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import tempImg from '../../../img/doppler.jpg'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RadioButton from '../presentational/RadioButton';
import RadioButtonGroup from './RadioButtonGroup';

class ChangeStatusForm extends React.Component {
    
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
    // shouldComponentUpdate(nextProps) {
    //     return nextProps.selectedObjectData !== this.props.selectedObjectData
    // }

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

        const locale = this.context

        const options = config.transferredLocation.map(location => {
            let locationObj = {};
            locationObj["value"] = location
            locationObj["label"] = locale.texts[location.toUpperCase().replace(/ /g, '_')]
            return locationObj
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

        let initialValues = {
            radioGroup: this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0].status : '',
            select: this.props.selectedObjectData.length !== 0 && this.props.selectedObjectData[0].status === config.objectStatus.TRANSFERRED
                ? { 
                    value: selectedObjectData.transferred_location,
                    label: locale.texts[selectedObjectData.transferred_location.toUpperCase().replace(/ /g, '_')]
                }
                : '',  
        }

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
                        {title}
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
                                            {/* <Col xs={3} sm={3} className='d-flex align-items-center'>
                                                <Image src={tempImg} width={80}/>
                                            </Col> */}
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                        <hr/>
                        <Formik
                            initialValues = {initialValues}

                            validationSchema = {
                                Yup.object().shape({
                                    radioGroup: Yup.string().required(locale.texts.STATUS_IS_REQUIRED),

                                    select: Yup.string()
                                        .when('radioGroup', {
                                            is: config.objectStatus.TRANSFERRED,
                                            then: Yup.string().required(locale.texts.LOCATION_IS_REQUIRED)
                                        })
                            })}

                            onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                                this.props.handleChangeObjectStatusFormSubmit(radioGroup, select)
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form className="text-capitalize">
                                    <Row className="form-group">
                                        <Col>  
                                            <RadioButtonGroup
                                                id="radioGroup"
                                                label={locale.texts.STATUS}
                                                value={values.radioGroup}
                                                error={errors.radioGroup}
                                                touched={touched.radioGroup}
                                            >
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.NORMAL}
                                                    label={locale.texts.NORMAL}
                                                />
                                            
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.BROKEN}
                                                    label={locale.texts.BROKEN}
                                                />

                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.RESERVE}
                                                    label={locale.texts.RESERVE}
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="radioGroup"
                                                    id={config.objectStatus.TRANSFERRED}
                                                    label={locale.texts.TRANSFERRED}
                                                />
        
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
                                    <Row className='d-flex justify-content-center pb-3'>
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
                                            <Button 
                                                name='add note'
                                                variant="outline-secondary" 
                                                className='mr-2 text-capitalize' 
                                                onClick={this.handleClick}
                                            >
                                                {!this.state.showNotesControl 
                                                    ? locale.texts.ADD_NOTE 
                                                    : locale.texts.HIDE_NOTE
                                                }
                                            </Button>
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

ChangeStatusForm.contextType = LocaleContext;
  
export default ChangeStatusForm;