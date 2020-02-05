import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from './DateTimePicker'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import Switcher from './Switcher'
import styleConfig from '../../styleConfig';
import LocaleContext from '../../context/LocaleContext';

let initialState = {
    show: false,
    isShowForm: false,
    transferredLocationOptions: [],
    isAdding: false,
    addedPerimeters: {
        uuids: [],
        rssis: []
    },
    addedFences: {
        uuids: [],
        rssis: []
    },
    enable: 0,
    areaID: ''
}

class EditGeofenceConfig extends React.Component {

    static contextType = AppContext
    
    state = {...initialState}

    componentDidUpdate = (prevProps) => {
        if (!prevProps.selectedData && this.props.selectedData) {
            let addedPerimeters = {
                uuids: [],
                rssis: []
            }
            let addedFences = {
                uuids: [],
                rssis: []
            }
            let {
                perimeters,
                fences,
                enable,
                area
            } = this.props.selectedData
            perimeters.lbeacons.uuids.map(item => {
                addedPerimeters.uuids.push(item)
            })
            perimeters.lbeacons.rssis.map(item => {
                addedPerimeters.rssis.push(item)
            })
            fences.lbeacons.uuids.map(item => {
                addedFences.uuids.push(item)
            })
            fences.lbeacons.rssis.map(item => {
                addedFences.rssis.push(item)
            })
            this.setState({
                addedPerimeters,
                addedFences,
                enable,
                areaID: area.id
            })
        }
    }

    pathOnClickHandler = () => {
        this.props.selectedObjectData.map((item,index)=>{
            this.props.handleShowPath(item.mac_address);
        })
        this.handleClose()
    }  

    handleClose = () => {
        this.props.handleClose()
        this.setState({ 
            ...initialState,
            show: false 
            
        });
    }

    handleClick = (e, values) => {
        let name = e.target.getAttribute('name')
        let type = e.target.getAttribute('type')
        let value = e.target.getAttribute('value')

        let { 
            addedPerimeters,
            addedFences 
        } = this.state    
        switch(name) { 
            case "remove":
                if (type == 'perimeters') {
                    addedPerimeters = this.parseLbeacons(addedPerimeters, value)
                } else {
                    addedFences = this.parseLbeacons(addedFences, value)
                }
                break;
            case "add":
                if (type == 'perimeters') {
                    addedPerimeters.uuids.push(values.p_lbeacon.value.replace(/-/g, ''))
                    addedPerimeters.rssis.push(values.p_add_rssi)
                } else {
                    addedFences.uuids.push(values.f_lbeacon.value.replace(/-/g, ''))
                    addedFences.rssis.push(values.f_add_rssi)
                }
                break;
            case "switch": 
                this.setState({
                    enable: value
                })
                break;
        }
        this.setState({
            addedPerimeters,
            addedFences
        })
    }

    parseLbeacons = (type, index) => {
        type.uuids = [...type.uuids.slice(0, index), ...type.uuids.slice(index + 1)]
        type.rssis = [...type.rssis.slice(0, index), ...type.rssis.slice(index + 1)]
        return type
    }

    transferTypeToString = (type) => {
        return type.uuids.reduce((toReturn, item, index) => {
            if (index == 0) {
                toReturn.push(type.uuids.length)
            }
            toReturn.push(item)
            toReturn.push(type.rssis[index])
            return toReturn
        }, []).join(',')

    }

    render() {
        const { 
            locale,
            auth
        } = this.context

        let { 
            selectedData,
            lbeaconsTable,
            isEdited
        } = this.props;

        let {
            addedPerimeters,
            addedFences,
            areaID,
            enable
        } = this.state

        let lbeaconsOptions = lbeaconsTable
            .filter(item => {
                let lbeaconAreaID = parseInt(item.uuid.slice(0,4))
                return !addedPerimeters.uuids.includes(item.uuid.replace(/-/g, '')) 
                        && !addedFences.uuids.includes(item.uuid.replace(/-/g, ''))
                        && lbeaconAreaID == areaID

            })
            .reduce((options, item) => {
                options.push({
                    id: item.id,
                    value: item.uuid,
                    label: `${item.description}[${item.uuid}]`
                })
                return options
            }, [])

        let areaOptions = auth.user.areas_id
            .filter(item => {
                return this.props.areaOptions[item]
            })
            .map(item => {
                return {
                    value: this.props.areaOptions[item],
                    label: locale.texts[this.props.areaOptions[item]],
                    id: item
                }        
            })
        let modifiedStartingTime = selectedData ? parseInt(selectedData.start_time.split(':')[0]) + 1 : 0

        return (
            <Modal  
                show={this.props.show} 
                onHide={this.handleClose} 
                size="md" 
                id='EditGeofenceConfig' 
                enforceFocus={false}
            >
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {locale.texts[this.props.title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            name: selectedData ? selectedData.name : '',
                            start: selectedData ? selectedData.start_time : '',
                            end: selectedData ? selectedData.end_time : '',
                            p_lbeacon: null,
                            p_add_rssi: "",
                            f_lbeacon: null,
                            f_add_rssi: "",
                            enable: enable,
                            area: selectedData ? selectedData.area : ''
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                name: Yup.string().required(locale.texts.NAME_IS_REQUIRED),                                
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let perimeters = this.transferTypeToString(this.state.addedPerimeters)
                            let fences = this.transferTypeToString(this.state.addedFences)
                            let monitorConfigPackage = {
                                id: isEdited ? selectedData.id : '',
                                name: values.name,
                                enable: this.state.enable,
                                type: this.props.type,
                                start_time: values.start,
                                end_time: values.end,
                                perimeters,
                                fences,
                                area_id: values.area.id,
                                action: isEdited ? 'set' : 'add'
                            }
                            this.props.handleSubmit(monitorConfigPackage)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <div className="form-group">
                                    <Switcher
                                        leftLabel="on"
                                        rightLabel="off"
                                        onChange={this.handleClick}
                                        status={this.state.enable}
                                        type={this.props.type}
                                    />
                                </div>
                                <div className="form-group">
                                    <small  className="form-text text-muted">{locale.texts.AREA}</small>
                                    <Select
                                        placeholder={locale.texts.SELECT_AREA}
                                        name='area'
                                        options={areaOptions}
                                        value={values.area}
                                        styles={styleConfig.reactSelect}
                                        isDisabled={isEdited}
                                        onChange={value => {
                                            setFieldValue('area', value)
                                            this.setState({
                                                areaID: value.id
                                            })

                                        }}
                                        components={{
                                            IndicatorSeparator: () => null,
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <small  className="form-text text-muted">{locale.texts.NAME}</small>
                                    <Field  
                                        name="name" 
                                        type="text" 
                                        className={'form-control' + (errors.name  ? ' is-invalid' : '')} 
                                        placeholder=''
                                    />
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <Row>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_START_TIME}</small>
                                        <DateTimePicker
                                            value={values.start}
                                            getValue={value => {
                                                setFieldValue("start", value.value)
                                                if (values.end.split(':')[0] <= value.value.split(':')[0]) {
                                                    let resetTime = [parseInt(value.value.split(':')[0]) + 1, values.end.split(':')[1]].join(':')
                                                    setFieldValue("end", resetTime)
                                                }

                                            }}
                                            name="start"
                                            start="0"
                                            end="23"
                                        />
                                    </Col>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_END_TIME}</small>
                                        <DateTimePicker
                                            value={values.end}
                                            getValue={value => setFieldValue("end", value.value)}
                                            name="end"
                                            start={modifiedStartingTime}
                                            end="24"
                                        />
                                    </Col>
                                </Row>

                                <TypeGroup 
                                    type='perimeters'
                                    abbr='p'
                                    title={locale.texts.PERIMETERS_GROUP}
                                    repository={addedPerimeters}
                                    onClick={this.handleClick} 
                                    lbeaconsOptions={lbeaconsOptions}
                                    values={values}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                />

                                <TypeGroup 
                                    type='fences'
                                    abbr='f'
                                    title={locale.texts.FENCES_GROUP}
                                    repository={addedFences}
                                    onClick={this.handleClick} 
                                    lbeaconsOptions={lbeaconsOptions}
                                    values={values}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                />

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
  
export default EditGeofenceConfig;

const TypeGroup = ({
    type,
    abbr,
    title,
    repository,
    onClick,
    lbeaconsOptions,
    values,
    errors,
    setFieldValue
}) => {
    const locale = React.useContext(LocaleContext);

    let style = {
        icon: {
            minus: {
               color: 'red',
               cursor: 'pointer'
            },
            add: {
                color: 'rgb(0, 123, 255, 0.6)',
                cursor: 'pointer'
            }
        },
    }
    return (
        <div className="form-group">
            <small  className="form-text text-muted">
                {title}
            </small>
            {repository.uuids.map((item, index) => {
                return (
                    <Row noGutters className="py-1" key={index}>
                        <Col 
                            lg={1}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <i 
                                className="fas fa-minus-circle"
                                style={style.icon.minus}
                                type={type}
                                name='remove'
                                value={index}
                                onClick={onClick}
                            ></i>
                        </Col>
                        <Col lg={9} className="pr-1">
                            <Field  
                                name={`p-${index + 1}-uuid`} 
                                type="text" 
                                className={'form-control' + (errors.name ? ' is-invalid' : '')} 
                                placeholder={item}
                                value={item}
                            />
                        </Col>
                        <Col lg={2}>
                            <Field  
                                name={`p-${index + 1}-rssi`} 
                                type="text" 
                                className={'form-control' + (errors.name ? ' is-invalid' : '')} 
                                placeholder=''
                                value={repository.rssis[index]}
                            />                                                
                        </Col>
                    </Row>
                )
            })}
            <Row noGutters className="py-1">
                <Col 
                    lg={1}
                    className="d-flex align-items-center justify-content-center"
                >
                    <i 
                        className='fa fa-plus'
                        name='add'
                        style={style.icon.add}
                        type={type}
                        onClick={(e) => {
                            onClick(e, values)
                            setFieldValue(`${abbr}_lbeacon`, null),
                            setFieldValue(`${abbr}_add_rssi`, '')
                        }}
                    ></i>
                </Col>
                <Col lg={9} className="pr-1">
                    <Select
                        placeholder={locale.texts.SELECT_LBEACON}
                        name={`${abbr}_lbeacon`}
                        options={lbeaconsOptions}
                        value={values[`${abbr}_lbeacon`]}
                        styles={styleConfig.reactSelect}
                        onChange={value => setFieldValue(`${abbr}_lbeacon`, value)}
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                    />
                </Col>
                <Col lg={2}>
                    <Field  
                        name={`${abbr}_add_rssi`}
                        type="text" 
                        className={'form-control' + (errors[`${abbr}_add_rssi`] ? ' is-invalid' : '')} 
                        placeholder='RSSI'
                    />                 
                    <ErrorMessage name={`${abbr}_add_rssi`} component="div" className="invalid-feedback" />                               
                </Col>
            </Row>
        </div>
    )
} 