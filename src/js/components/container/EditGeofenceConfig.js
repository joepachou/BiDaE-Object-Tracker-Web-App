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

class EditGeofenceConfig extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,
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
        enable: null,
    };

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
                fences
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
                enable: this.props.selectedData.enable
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
  

    handleClose = () => {
        this.props.handleClose()
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
            locale 
        } = this.context

        let { 
            selectedData,
            lbeaconsTable 
        } = this.props;

        let {
            addedPerimeters,
            addedFences
        } = this.state

        let lbeaconsOptions = lbeaconsTable
            .filter(item => {
                return !addedPerimeters.uuids.includes(item.uuid.replace(/-/g, '')) 
                        && !addedFences.uuids.includes(item.uuid.replace(/-/g, ''))

            })
            .reduce((options, item) => {
                options.push({
                    id: item.id,
                    value: item.uuid,
                    label: `${item.description}[${item.uuid}]`
                })
                return options
            }, [])

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
                            name: selectedData && selectedData.name,
                            start: selectedData && selectedData.start_time,
                            end: selectedData && selectedData.end_time,
                            p_lbeacon: null,
                            p_add_rssi: "",
                            f_lbeacon: null,
                            f_add_rssi: "",
                            enable: selectedData && selectedData.enable,
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {

                                let perimeters = this.transferTypeToString(this.state.addedPerimeters)
                                let fences = this.transferTypeToString(this.state.addedFences)
                                let monitorConfigPackage = {
                                    id: selectedData.id,
                                    enable: this.state.enable,
                                    type: this.props.type,
                                    start_time: values.start,
                                    end_time: values.end,
                                    perimeters,
                                    fences
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
                                        subId={selectedData.id}
                                    />
                                </div>
                                <div className="form-group">
                                    <small  className="form-text text-muted">{locale.texts.NAME}</small>
                                    <Field  
                                        name="name" 
                                        type="text" 
                                        className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
                                        placeholder=''
                                    />
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <Row>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_START_TIME}</small>
                                        {selectedData &&
                                            <DateTimePicker
                                                id={selectedData.id}
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
                                        }
                                    </Col>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_END_TIME}</small>
                                        {selectedData &&
                                            <DateTimePicker
                                                id={selectedData.id}
                                                value={values.end}
                                                getValue={value => setFieldValue("end", value.value)}
                                                name="end"
                                                start={parseInt(selectedData.start_time.split(':')[0]) + 1}
                                                end="24"
                                            />
                                        }
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
                                className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
                                placeholder={item}
                                value={item}
                            />
                        </Col>
                        <Col lg={2}>
                            <Field  
                                name={`p-${index + 1}-rssi`} 
                                type="text" 
                                className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
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
                        placeholder={'select lbeacon'}
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
                        className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
                        placeholder='RSSI'
                    />                                                
                </Col>
            </Row>
        </div>
    )
} 