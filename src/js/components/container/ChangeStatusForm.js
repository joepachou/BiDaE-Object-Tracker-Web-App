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
} from 'formik';
import * as Yup from 'yup';
import RadioButton from '../presentational/RadioButton';
import RadioButtonGroup from './RadioButtonGroup';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import styleConfig from '../../styleConfig'
import FormikFormGroup from '../presentational/FormikFormGroup'

class ChangeStatusForm extends React.Component {

    static contextType = AppContext
    
    state = {
        transferredLocationOptions: []
    };

    componentDidMount = () => {
       this.getTransferredLocation();
    }

    pathOnClickHandler = () => {
        let {
            selectedObjectData
        } = this.props

        selectedObjectData ? selectedObjectData.map((item,index)=>{
            this.props.handleShowPath(item.mac_address);
        }) : null;
        this.handleClose()
    }

    getTransferredLocation = () => {
        let { locale } = this.context
        axios.get(dataSrc.getTransferredLocation)
        .then(res => {
            const transferredLocationOptions = res.data.map(branch => {
                return {          
                    label: branch.branch_name,
                    value: branch,
                    options: branch.department
                        .map((department, index) => {
                            return {
                                label: `${department},${branch.branch_name}`,
                                value: {
                                    branch,
                                    departmentId: index,
                                }
                            }
                    }),
                    id: branch.id
                }

            })
            this.setState({
                transferredLocationOptions
            })
        })
    }

    handleClose = (e) => {
        this.props.handleChangeObjectStatusFormClose();
    }
  

    handleClick = (e) => {
        const item = e.target.name
        switch(item) {
            case 'add device':
                this.props.handleAdditionalButton(item);
                break;
        }
    }

    render() {

        const { locale } = this.context

        const style = {
            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            },
            crossIcom: {
                cursor: "pointer"
            },
            buttonPath: {
                fontSize: '0.5rem'
            },
        }

        let { 
            title,
            selectedObjectData 
        } = this.props
        return (
            <Modal  
                show={this.props.show}
                onHide={this.handleClose} 
                size="md" 
                id='changeStatusForm' 
                className='text-capitalize'
                enforceFocus={false}
                style={style.modal}
            >
                <Modal.Header 
                    closeButton 
                >

                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                    {process.env.IS_TRACKING_PATH_ON == 1 && 
                        <Button variant="link" style={style.buttonPath} onClick={this.pathOnClickHandler}>追蹤路徑</Button>                        
                    }
                </Modal.Header >
                <Modal.Body>
                    <Formik
                 
                        initialValues = {{
                            name: selectedObjectData.length != 0 ? selectedObjectData[0].name : '',
                            type: selectedObjectData.length != 0 ? selectedObjectData[0].type : '',
                            asset_control_number: selectedObjectData.length != 0 ? selectedObjectData[0].asset_control_number : '',
                            status: selectedObjectData.length != 0 ? selectedObjectData[0].status : '',
                            transferred_location: selectedObjectData.length != 0 && selectedObjectData[0].status == config.objectStatus.TRANSFERRED

                                ? ''
                                // this.state.transferredLocationOptions
                                //             .filter(branch => branch.id == selectedObjectData[0].transferred_location.branchId)[0]
                                //             .options[selectedObjectData[0].transferred_location.departmentId]
                                : '',
                            notes: selectedObjectData.length != 0 ? selectedObjectData[0].notes : "" ,
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                status: Yup.string().required(locale.texts.STATUS_IS_REQUIRED),

                                transferred_location: Yup.string()
                                    .when('status', {
                                        is: config.objectStatus.TRANSFERRED,
                                        then: Yup.object().required(locale.texts.LOCATION_IS_REQUIRED)
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
                                                <Row noGutters className='text-capitalize'>
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
                                                        <Row noGutters>
                                                            <Col>
                                                                <FormikFormGroup 
                                                                    type="text"
                                                                    name="name"
                                                                    label={locale.texts.NAME}
                                                                    error={errors.name}
                                                                    touched={touched.name}
                                                                    placeholder=""
                                                                    disabled
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <FormikFormGroup 
                                                                    type="text"
                                                                    name="type"
                                                                    label={locale.texts.TYPE}
                                                                    error={errors.type}
                                                                    touched={touched.type}
                                                                    placeholder=""
                                                                    disabled
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <FormikFormGroup 
                                                            type="text"
                                                            name="asset_control_number"
                                                            label={locale.texts.ACN}
                                                            error={errors.asset_control_number}
                                                            touched={touched.asset_control_number}
                                                            placeholder=""
                                                            disabled
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })}
                                    <hr/>
                                </div>
                                <FormikFormGroup 
                                    type="text"
                                    name="status"
                                    label={locale.texts.STATUS}
                                    error={errors.status}
                                    touched={touched.status}
                                    placeholder=""
                                    component={() => (
                                        <RadioButtonGroup
                                            value={values.status}
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
                                    )}
                                />
                                <FormikFormGroup 
                                    type="text"
                                    name="transferred_location"
                                    label={locale.texts.TRANSFERRED_LOCATION}
                                    error={errors.transferred_location}
                                    touched={touched.transferred_location}
                                    display={values.status == 'transferred'}
                                    component={() => (
                                        <Select
                                            name="transferred_location"
                                            value={values.transferred_location}
                                            onChange={value => setFieldValue("transferred_location", value)}
                                            options={this.state.transferredLocationOptions}
                                            isSearchable={false}
                                            styles={styleConfig.reactSelect}
                                            placeholder={locale.texts.SELECT_LOCATION}
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    )}
                                />
                                <hr/>
                                <FormikFormGroup 
                                    type="text"
                                    name="notes"
                                    label={locale.texts.NOTES}
                                    error={errors.notes}
                                    touched={touched.notes}
                                    placeholder={locale.texts.WRITE_THE_NOTES}
                                />
                                
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
        );
    }
}
  
export default ChangeStatusForm;