import React from 'react';
import { 
    Modal, 
    Button, 
    Row, 
    Col, 
    ButtonToolbar 
} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import { 
    Formik, 
    Field, 
    Form, 
    ErrorMessage 
} from 'formik';
import * as Yup from 'yup';
import RadioButton from '../presentational/RadioButton';
import RadioButtonGroup from './RadioButtonGroup';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import styleConfig from '../../styleConfig'

class ChangeStatusForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,
        isShowForm: false,
        transferredLocationOptions: []
    };

    componentDidMount = () => {
       this.getTransferredLocation();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props && this.props.selectedObjectData.length !== 0) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    pathOnClickHandler = () => {
        this.props.selectedObjectData.map((item,index)=>{
            this.props.handleShowPath(item.mac_address);
        })
        this.handleClose()
    }

    getTransferredLocation = () => {
        let { locale } = this.context
        axios.get(dataSrc.getTransferredLocation)
        .then(res => {
            const transferredLocationOptions = res.data.map(loc => {
                return {          
                    value: loc.transferred_location,
                    label: locale.texts[loc.transferred_location.toUpperCase().replace(/ /g, '_')],
                    options: Object.values(loc)
                        .filter((item, index) => index > 0)
                        .map(branch => {
                            return {
                                value: `${loc.transferred_location},${branch}`,
                                label: locale.texts[branch.toUpperCase().replace(/ /g, '_')],
                            }
                    })
                }

            })
            this.setState({
                transferredLocationOptions
            })
        })
    }

    handleClose = (e) => {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false 
        });
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
            crossIcom: {
                cursor: "pointer"
            },

            buttonPath: {
                fontSize: '0.5rem'
            }
        }

        let { title } = this.props;
        
        let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0] : []

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
                        {process.env.IS_TRACKING_PATH_ON == 1 && 
                            <Button variant="link" style={style.buttonPath} onClick={this.pathOnClickHandler}>追蹤路徑</Button>                        
                        }
                    </Modal.Header >
                    <Modal.Body>
                        <Formik
                            initialValues = {{
                                radioGroup: this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData[0].status : '',
                                select: this.props.selectedObjectData.length !== 0 && this.props.selectedObjectData[0].status === config.objectStatus.TRANSFERRED
                                    ? { 
                                        value: selectedObjectData.transferred_location,
                                        label: selectedObjectData.transferred_location.toUpperCase().split(',').map(item => locale.texts[item]).join('/')
                                    }
                                    : '', 
                                note: selectedObjectData.notes || ''
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
                                    <div className='modalDeviceListGroup' style={style.deviceList}>
                                        {this.props.selectedObjectData.map((item,index) => {
                                            return (
                                                <div key={index} >
                                                    {index > 0 ? <hr/> : null}
                                                    <Row noGutters={true}  className='text-capitalize'>
                                                        {this.props.selectedObjectData.length > 1 
                                                            ? 
                                                                <Col xs={1} sm={1} className='d-flex align-items-center'>
                                                                    <i 
                                                                        className="fas fa-times" 
                                                                        onClick={this.props.handleRemoveButton} 
                                                                        name={item.mac_address}
                                                                        style={style.crossIcom}
                                                                    /> 
                                                                </Col>
                                                            : null
                                                        }
                                                        <Col>
                                                            <Row>
                                                                <Col>
                                                                    <small  className="form-text text-muted">{locale.texts.NAME}</small>
                                                                    <Field  
                                                                        value={item.name} 
                                                                        type="text" 
                                                                        className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
                                                                        placeholder=''
                                                                        disabled={true}
                                                                    />
                                                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                                                </Col>
                                                                <Col>
                                                                    <small  className="form-text text-muted">{locale.texts.TYPE}</small>
                                                                    <Field  
                                                                        value={item.type} 
                                                                        type="text" 
                                                                        className={'form-control' + (errors.type && touched.type ? ' is-invalid' : '')} 
                                                                        placeholder=''
                                                                        disabled={true}
                                                                    />
                                                                    <ErrorMessage name="tyspe" component="div" className="invalid-feedback" />
                                                                </Col>
                                                            </Row>
                                                            <div className="form-group">
                                                                <small  className="form-text text-muted">{locale.texts.ASSET_CONTROL_NUMBER}</small>
                                                                <Field 
                                                                    disabled= {this.props.disableASN ? 1 : 0}
                                                                    name="asset_control_number" 
                                                                    type="text" 
                                                                    className={'form-control' + (errors.asset_control_number && touched.asset_control_number ? ' is-invalid' : '')} 
                                                                    placeholder=''
                                                                    value={item.asset_control_number}
                                                                    disabled={true}
                                                                />
                                                                <ErrorMessage name="asset_control_number" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <hr/>
                                    <div className="form-group">
                                    <small  className="form-text text-muted">{locale.texts.STATUS}</small>
                                    <RadioButtonGroup
                                        value={values.status}
                                        error={errors.status}
                                        touched={touched.status}
                                    >
                                        <div className="d-flex justify-content-between form-group my-1">
                                            <Field  
                                                component={RadioButton}
                                                name="status"
                                                id={config.objectStatus.NORMAL}
                                                label={locale.texts.NORMAL}
                                            />
    
                                            <Field
                                                component={RadioButton}
                                                name="status"
                                                id={config.objectStatus.BROKEN}
                                                label={locale.texts.BROKEN}
                                            />
                                            <Field
                                                component={RadioButton}
                                                name="status"
                                                id={config.objectStatus.RESERVE}
                                                label={locale.texts.RESERVE}
                                            />
                                            
                                            <Field
                                                component={RadioButton}
                                                name="status"
                                                id={config.objectStatus.TRANSFERRED}
                                                label={locale.texts.TRANSFERRED}
                                            />
                                        </div>
                                    </RadioButtonGroup>   
                                </div>
                                <div 
                                    className="form-group"
                                    style={{display: values.status == 'transferred' ? '' : 'none'}}
                                >
                                    <small  className="form-text text-muted">{locale.texts.AREA}</small>

                                    <Select
                                        name="select"
                                        value = {values.transferred_location}
                                        className="my-1"
                                        onChange={value => setFieldValue("transferred_location", value)}
                                        options={this.state.transferredLocationOptions}
                                        isSearchable={false}
                                        isDisabled={values.status !== config.objectStatus.TRANSFERRED}
                                        styles={styleConfig.reactSelect}
                                        placeholder={locale.texts.SELECT_LOCATION}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                    <Row className='no-gutters' className='d-flex align-self-center'>
                                        <Col>
                                            {touched.status && errors.status &&
                                            <div style={style.errorMessage}>{errors.status}</div>}
                                            {touched.transferred_location && errors.transferred_location &&
                                            <div style={style.errorMessage}>{errors.transferred_location}</div>}
                                        </Col>
                                    </Row> 
                                </div>
                                <div className="form-group">
                                    <small  className="form-text text-muted">{locale.texts.NOTES}</small>
                                    <Field 
                                        name="note" 
                                        type="text" 
                                        className={'form-control' + (errors.note && touched.note ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.WRITE_THE_NOTES}
                                    />
                                    <ErrorMessage name="note" component="div" className="invalid-feedback" />

                                    <hr/>
                                </div>
                                
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