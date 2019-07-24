import React from 'react';
import { Modal, Button, Row, Col, Image} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import tempImg from '../../../img/doppler.jpg'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RadioButton from '../presentational/RadioButton'

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
class ChangeStatusForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleClose(e) {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false 
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate(prevProps) {
        if (prevProps != this.props && this.props.selectedObjectData.length !== 0) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    handleSubmit(radioGroup, select) {
        
        let selectedObjectData = this.props.selectedObjectData[0]
        const { mac_address, name, type, access_control_number } = selectedObjectData;
        const postOption = {
            name: name,
            type: type,
            access_control_number: access_control_number,
            mac_address: mac_address,
            status: radioGroup,
            transferredLocation: radioGroup !== config.objectStatus.TRANSFERRED ? '' : select.value,
        }
        this.props.handleChangeObjectStatusFormSubmit(postOption)
    }


    render() {

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

        const colProps = {
            titleCol: {
                xs: 5,
                sm: 5
            },
            inputCol: {
                xs: 7,
                sm: 7,
            }
        }

        let { title } = this.props;
        let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0] : []
        const locale = this.context

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md">
                    <Modal.Header closeButton className='font-weight-bold text-capitalize'>{title}</Modal.Header >
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={8}>
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        Device Type
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                        {selectedObjectData.type}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        Device Name
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                        {selectedObjectData.name}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...colProps.titleCol}>
                                        ACN
                                    </Col>
                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                        {selectedObjectData.access_control_number}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={4} className='d-flex align-items-center'>
                                <Image src={tempImg} width={80}/>
                            </Col>
                        </Row>
                    
                        <hr/>
                        <Formik
                            initialValues = {{
                                radioGroup: this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0].status : '',
                                select: this.props.selectedObjectData.length !== 0 && this.props.selectedObjectData[0].status === "Transferred" 
                                    ? this.props.selectedObjectData[0].transferredLocation
                                    : '',
                            }}

                            validationSchema = {
                                Yup.object().shape({
                                    radioGroup: Yup.string().required('Object status is required'),

                                    select: Yup.string()
                                        .when('radioGroup', {
                                            is: config.objectStatus.TRANSFERRED,
                                            then: Yup.string().required('Location is required')
                                        })
                            })}

                            onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                                console.log(radioGroup, select)
                                this.handleSubmit(radioGroup, select)
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form className="text-capitalize">
                                    <Row className="form-group my-3">
                                        <Col sm={2} className='d-flex'>
                                            <label htmlFor="status">{locale.STATUS}</label>
                                        </Col>
                                        <Col sm={10} >
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.NORMAL}
                                                label={locale.NORMAL}
                                            />
                                        
                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.BROKEN}
                                                label={locale.BROKEN}
                                            />

                                            <Field
                                                component={RadioButton}
                                                name="radioGroup"
                                                id={config.objectStatus.RESERVE}
                                                label={locale.RESERVE}
                                            />

                                            <Row className='no-gutters' className='d-flex align-self-center'>
                                                <Col sm={4} className='d-flex align-self-center'>
                                                    <Field
                                                        component={RadioButton}
                                                        name="radioGroup"
                                                        id={config.objectStatus.TRANSFERRED}
                                                        label={locale.TRANSFERRED}
                                                    />
                                                </Col>
                                                <Col sm={8}>
                                                    <Select
                                                        placeholder = "Select Location"
                                                        name="select"
                                                        value = {values.select}
                                                        onChange={value => setFieldValue("select", value)}
                                                        options={options}
                                                        isSearchable={false}
                                                        isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                                                        style={style.select}
                                                        components={{
                                                            IndicatorSeparator: () => null
                                                        }}
                                                    />
                                                    {touched.select && errors.select &&
                                                    <div style={style.errorMessage}>{errors.select}</div>}
                                                </Col>
                                            </Row>                                                
                                        </Col>
                                    </Row>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                                            {locale.CANCEL}
                                        </Button>
                                        <Button type="submit" className="text-capitalize" variant="primary" disabled={isSubmitting}>
                                            {locale.SAVE}
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