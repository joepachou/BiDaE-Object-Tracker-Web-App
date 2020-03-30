import React, {Fragment} from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import moment from 'moment'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import GeneralConfirmForm from '../presentational/GeneralConfirmForm'
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import DownloadPdfRequestForm from './DownloadPdfRequestForm'
import {
    getStatus
} from '../../helper/descriptionGenerator'
import Select from 'react-select';
import messageGenerator from '../../helper/messageGenerator'
import { Formik, Field, Form } from 'formik';
import FormikFormGroup from '../presentational/FormikFormGroup'
import {
    getDescription
} from '../../helper/descriptionGenerator'

const style = {
    modalBody: {
        height: '60vh',
        overflow: 'hidden scroll'
    },
    row: {
        wordBreak: 'break-all'
    },
    item: {
        minWidth: 30,
    },
    select: {
        control: (provided) => ({
            ...provided,
            width: 200,
        }),
    }
}
let selectVal = ''
class ShiftChange extends React.Component {

    static contextType = AppContext
    
    state = {
        searchResult: {
            foundResult: [],
            notFoundResult: [],
        },
        patients: [],
        fileUrl: '',
        showPdfDownloadForm: false,
        showConfirmForm: false,
        showDownloadPdfRequest: false,
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.show && !prevProps.show) {
            this.getTrackingData()
        }
    }

    getTrackingData = () => {
        let { 
            locale, 
            auth, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer
        retrieveDataHelper.getTrackingData(
            locale.abbr, 
            auth.user, 
            areaId
        )
        .then(res => {
            let {
                myDevice
            } = auth.user

            let foundResult = []
            let notFoundResult = []
            let patients= []
            res.data
                .filter(item => myDevice.includes(item.asset_control_number))
                .map(item => {
                    
                    switch(item.object_type) {
                        case '0':
                            if (item.found) {
                                foundResult.push(item)
                            } else {
                                notFoundResult.push(item)
                            }
                            break;
                        case '1':
                        case '2':
                            if (item.found) {
                                patients.push(item)
                            }
                            break
                    }
            })
            this.setState({
                searchResult: {
                    foundResult: foundResult,
                    notFoundResult: notFoundResult,
                },
                patients,
            })
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)
        })
    }

    confirmShift = (values) => {
        this.setState({
            showConfirmForm: true,
            shift: values.shift
        })
    }

    handleConfirmFormSubmit = (authentication) => { 

        let { 
            locale, 
            auth 
        } = this.context   
  
        let pdfPackage = config.getPdfPackage(
            'shiftChange', 
            auth.user, 
            this.state.searchResult, 
            locale,
            authentication,
            this.state.shift
        )  

        this.state.patients.reduce((pkg, object) => {   

            let temp = config.getPdfPackage(
                'patientRecord', 
                auth.user, 
                object, 
                locale,
                authentication,
            )
            
            if (pkg.pdf) {
                pkg.pdf += `
                    <div style="page-break-before:always"></div>
                `
                pkg.pdf += temp.pdf
            } else {
                pkg = temp
            }
            return pkg
        }, pdfPackage)

        axios.post(dataSrc.addShiftChangeRecord, {
            userInfo: auth.user,
            pdfPackage,
            shift: this.state.shift,
        }).then(res => {
            // this.props.handleSubmit()
            let callback = () => messageGenerator.setSuccessMessage(
                'save shift change success'
            )
            this.setState({
                fileUrl: pdfPackage.path,
                showConfirmForm: false,
                showDownloadPdfRequest: true
            }, callback)
        }).catch(err => {
            console.log(`add shift change record failed ${err}`)
        })
    }

    handleClose = () => {
        this.setState({
            showConfirmForm: false,
            showDownloadPdfRequest: false
        })
    }

    render() {   
        const { 
            locale, 
            auth,
            stateReducer 
        } = this.context

        const {
            patients
        } = this.state

        const { 
            show,
            handleClose
        } = this.props

        const { 
            foundResult, 
            notFoundResult 
        } = this.state.searchResult

        const nowTime = moment().locale(locale.abbr)
        const hasFoundResult = foundResult.length !== 0;
        const hasNotFoundResult = notFoundResult.length !== 0;
        const hasFoundPatients = patients.length !== 0;
        
        const shiftOptions = Object.values(config.shiftOption).map(shift => { 
            return { 
                value: shift,
                label: locale.texts[shift.toUpperCase().replace(/ /g, '_')]
            };
        }) 

        const defaultShiftOption = {
            value: config.getShift(),
            label: locale.texts[config.getShift().toUpperCase().replace(/ /g, '_')]
        }

        return ( 
            <div>
                <Modal 
                    show={show} 
                    size="lg" 
                    onHide={handleClose}
                    className='text-capitalize'
                >
                    <Formik            
                        initialValues = {{
                            shift: defaultShiftOption
                        }}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.confirmShift(values)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <div>
                                <Modal.Header
                                    className='d-flex flex-column'
                                >
                                    <div className="title">
                                        {locale.texts.SHIFT_CHANGE_RECORD}
                                    </div>                                
                                    <div>
                                        {locale.texts.DATE_TIME}: {nowTime.format(config.regularTimeFormat)}
                                    </div> 
                                    <div 
                                    >
                                        {locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: {auth.user.name} 
                                    </div>
                                    <div 
                                        className="d-flex align-items-center"
                                    >   
                                        {locale.texts.SHIFT }: 
                                        &nbsp;
                                        <Select 
                                            name="shift"
                                            options={shiftOptions} 
                                            value={values.shift}
                                            onChange={(value) => setFieldValue('shift', value)}  
                                            styles={style.select}
                                        />  
                                    </div>
                                </Modal.Header>
                                <Modal.Body       
                                    style ={style.modalBody}
                                    id="shiftChange"
                                >
                                    <Form className="text-capitalize">
                                        {!hasFoundResult && !hasNotFoundResult && 
                                            <div className="d-flex justify-content-center">
                                                <p className="font-italic ">{locale.texts.NOT_ASSIGNED_TO_ANY_DEVICES}</p>
                                            </div>
                                        }    
                                        <TypeBlock
                                            title={locale.texts.DEVICES_FOUND}
                                            hasType={hasFoundResult} 
                                            typeArray={foundResult}
                                        /> 
                                        <TypeBlock
                                            title={locale.texts.DEVICES_NOT_FOUND}
                                            hasType={hasNotFoundResult} 
                                            typeArray={notFoundResult}
                                        /> 
                                        <TypeBlock
                                            title={locale.texts.PATIENTS_FOUND}
                                            hasType={hasFoundPatients} 
                                            typeArray={patients}
                                        /> 
                                    </Form> 
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={handleClose}
                                        >
                                            {locale.texts.CANCEL}
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            variant="primary" 
                                            onClick={submitForm}
                                            disabled={!hasFoundResult && !hasNotFoundResult}
                                        >
                                            {locale.texts.CONFIRM}
                                        </Button>
                                    </Modal.Footer>   
                                </div>
                        )}
                    />
                </Modal>     
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    handleSubmit={this.handleConfirmFormSubmit}
                    handleClose={this.handleClose}
                />
                <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest} 
                    pdfPath={this.state.fileUrl}
                    handleClose={this.handleClose}
                /> 
            </div>
        )
    }
}

export default ShiftChange

const TypeBlock = ({
    title,
    hasType,
    typeArray,
}) => {
    let appContext = React.useContext(AppContext)

    let {
        locale,
        auth,
        stateReducer
    } = appContext

    return (
        <div>
            {hasType && 
                <div
                    className="subtitle"
                >
                    {title} 
                </div>
            }     
            {hasType && typeArray.map((item, index) => { 
                return (
                    <div 
                        className='d-flex justify-content-start'
                        key={index}
                    >
                        <div 
                            style={style.item}
                            className='d-flex justify-content-center'
                        >
                            {index + 1}.
                        </div>
                        <div 
                            key={index} 
                            className="pb-1"
                            style={style.row}
                        >     
                            {getDescription(item, locale, config)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
