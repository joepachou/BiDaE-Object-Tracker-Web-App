import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar, ToggleButton} from 'react-bootstrap'
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
        this.handleClick = this.handleClick.bind(this)
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
    // shouldComponentUpdate(nextProps) {
    //     return nextProps.selectedObjectData !== this.props.selectedObjectData
    // }

    handleClick(e) {
        const item = e.target.innerText.toLowerCase();
        switch(item) {
            case 'add device':
                this.props.handleAdditionalButton(item);
                break;
            case 'remove device':
                break;
            case 'add notes':
            case 'hide notes':
                this.setState({
                    showNotesControl: !this.state.showNotesControl
                })
                break;
        }
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
        const locale = this.context

        return (
            <>  
                <Modal  
                    show={this.state.show} 
                    onHide={this.handleClose} 
                    size="md" 
                    id='changeStatusForm' 
                    enforceFocus={false}
                >
                    <Modal.Header closeButton className='font-weight-bold text-capitalize'>{title}</Modal.Header >
                    <Modal.Body>
                        <div className='modalDeviceListGroup' style={style.deviceList}>
                            {this.props.selectedObjectData.map((item,index) => {
                                return (
                                    <div key={index} >
                                        {index > 0 ? <hr/> : null}
                                        <Row>
                                            {/* <Col xs={1} sm={1} className='d-flex align-items-center'>
                                                {this.props.selectedObjectData.length > 1 
                                                    ? <i className="fas fa-times" onClick={this.props.handleRemoveButton} name={item.mac_address}></i> 
                                                    : null
                                                }
                                            </Col> */}
                                            <Col xs={8} sm={8}>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        Type
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.type}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        Name
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.name}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        ACN
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.access_control_number}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={4} sm={4} className='d-flex align-items-center'>
                                                <Image src={tempImg} width={80}/>
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
                                this.props.handleChangeObjectStatusFormSubmit(radioGroup, select)
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form className="text-capitalize">
                                    <Row className="form-group">
                                        <Col xs={2} sm={2} className='d-flex'>
                                            <label htmlFor="status">{locale.STATUS}</label>
                                        </Col>
                                        <Col xs={10} sm={10} >
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
                                    <hr/>
                                    <Row className='d-flex justify-content-center pb-3'>
                                        <ButtonToolbar >
                                            <Button variant="outline-secondary" className='mr-2 notShowOnMobile' onClick={this.handleClick} active={this.props.showAddDevice}>
                                                Add Device
                                            </Button>
                                            <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>
                                                {this.state.showNotesControl ? 'Add Notes' : 'Hide Notes'}
                                            </Button>
                                        </ButtonToolbar>
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