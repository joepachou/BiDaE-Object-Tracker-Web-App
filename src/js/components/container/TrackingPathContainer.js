import React from 'react';
import dataSrc from "../../dataSrc"
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import { 
    Button, 
    Container, 
    Row,
    Col,
    Nav
} from 'react-bootstrap';
import config from '../../config' 
import styleConfig from '../../styleConfig'
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'
import {
    locationHistoryByMacColumns,
    locationHistoryByUUIDColumns,
} from '../../tables'
import moment from 'moment'
import {
    isBrowser
} from 'react-device-detect'
import FormikFormGroup from '../presentational/FormikFormGroup'

class TrackingPathContainer extends React.Component{
    static contextType = AppContext
    
    state = {
        columns:[], 
        data:[],
        selectedData: null,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    getLocationHistory = (
        fields
    ) => {
        const {
            locale
        } = this.context
    
            let key = null
            let columns = null;
            let timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

            switch(fields.mode) {
                case "mac":
                    key = fields.key.toLowerCase().replace(/[: ]/g, '').match(/.{1,2}/g).join(':')
                    columns = locationHistoryByMacColumns
                    break;
                case "uuid":
                    key = fields.key
                    columns = locationHistoryByUUIDColumns
                    break;
            }

            axios.post(dataSrc.getLocationHistory, {
                key,
                startTime: moment(fields.startTime).format(), 
                endTime: moment(fields.endTime).format(),
                mode: fields.mode
            })
            .then(res => {
                let prevUUID = "";
                let data = []
                let selectedData = null;
                switch(fields.mode) {
                    case 'mac':
                        res.data.rows
                        .map(pt => {
                            if (pt.uuid != prevUUID) {
                                data.push({
                                    uuid: pt.uuid,
                                    startTime: moment(pt.record_timestamp).locale(locale.abbr).format(timeValidatedFormat),
                                    description: pt.description
                                })
                                prevUUID = pt.uuid
                            }
        
                            data[data.length - 1].endTime = moment(pt.record_timestamp).locale(locale.abbr).format(timeValidatedFormat)
        
                        })
                        selectedData = res.data.rows[0].name
                        break;
                    case "uuid":
                        data = res.data.rows
                        selectedData = res.data.rows[0].description
                        break;
                }

                this.setState({
                    data,
                    columns,
                    selectedData,
                })
            })
            .catch(err => {
                console.log(`get location history failed ${err}`)
            })
    }
 
    render(){

        const { locale } = this.context

        const style = {

            sidenav: {
                width: isBrowser ? 100 : 0,
            },
            sidemain:{
                marginLeft: isBrowser ? 100 : 0
            },
            container: {
                overflowX: 'hide'
            }
        }

        const timeTypeExample = "ex: YYYY/MM/DD HH:MM:SS"
        const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'
        return (
            <Container 
                className='mt-5' 
                fluid
            >
                <Formik     
                    initialValues={{
                        mode: "mac",
                        mac: "",
                        key: "",
                        startTime: "",
                        endTime: "",
                    }}
                    validationSchema = {
                        Yup.object().shape({

                            key: Yup.string()
                                .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
                                .when('mode', {
                                    is: 'mac',
                                    then: Yup.string().test(
                                        'mode', 
                                        locale.texts.MAC_ADDRESS_FORMAT_IS_NOT_CORRECT,
                                        value => {  
                                            if (value == undefined) return false
                                            let pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                            return value.match(pattern)
                                        }
                                    )
                                }),
                            startTime: Yup.string()
                                .required(locale.texts.START_TIME_IS_REQUIRED)
                                .test(
                                    'startTime', 
                                    locale.texts.TIME_FORMAT_IS_NOT_CORRECT,
                                    value => {  
                                        return moment(value, timeValidatedFormat, true).isValid()
                                    }
                                ),
                            endTime: Yup.string()
                                .required(locale.texts.END_TIME_IS_REQUIRED)
                                .test(
                                    'endTime', 
                                    locale.texts.TIME_FORMAT_IS_NOT_CORRECT,
                                    value => {  
                                        return moment(value, timeValidatedFormat, true).isValid()
                                    }
                                ),
                    })}

                    onSubmit={(values) => {
                        this.getLocationHistory(values)
                    }}
                
                    render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm, setErrors, setTouched }) => (
                        <div>
                            <div 
                                className="border-0 BOTsidenav"
                                style={style.sidenav}
                            >
                                <Nav 
                                    defaultActiveKey="mac" 
                                    className="flex-column text-capitalize BOTsidenav"
                                >
                                    <Nav.Link
                                        className=""
                                        eventKey="mac"
                                        onClick={() => {
                                            setFieldValue('key', "")
                                            setFieldValue('mode', 'mac')
                                            setErrors({})
                                            setTouched({})
                                            this.setState({
                                                data: [],
                                                columns: [],
                                                selectedData: null
                                            })
                                        }}
                                        active={values.mode == "mac"}
                                    >
                                        {locale.texts.MAC_ADDRESS}
                                    </Nav.Link>
                                    <Nav.Link
                                        eventKey="uuid"
                                        onClick={() => {
                                            setFieldValue('key', "")
                                            setFieldValue('mode', 'uuid')
                                            setErrors({})
                                            setTouched({})
                                            this.setState({
                                                data: [],
                                                columns: [],
                                                selectedData: null

                                            })
                                        }}  
                                        active={values.mode == "uuid"}
                                    >
                                        {locale.texts.LBEACON}
                                    </Nav.Link>
                                </Nav>
                            </div>
                            <div
                                className="BOTsidemain"
                                style={style.sidemain}
                            >
                                <Row>
                                    <Col lg={4}>
                                        {values.mode == 'mac' &&
                                            <FormikFormGroup 
                                                type="text"
                                                name="key"
                                                error={errors.key}
                                                touched={touched.key}
                                                placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS}
                                                label="mac address"
                                            />
                                        }
                                        {values.mode == 'uuid' &&
                                            <FormikFormGroup 
                                                type="text"
                                                name="key"
                                                error={errors.key}
                                                touched={touched.key}
                                                placeholder={"ex: 00010015-0000-0005-4605-000000018086"}
                                                label="UUID"
                                            />
                                        }
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="startTime"
                                            error={errors.startTime}
                                            touched={touched.startTime}
                                            // placeholder={locale.texts.START_TIME}
                                            placeholder={timeTypeExample}
                                            // example={timeTypeExample}
                                            label={locale.texts.START_TIME}
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="endTime"
                                            error={errors.endTime}
                                            touched={touched.endTime}
                                            // placeholder={locale.texts.END_TIME}
                                            placeholder={timeTypeExample}
                                            // example={timeTypeExample}
                                            label={locale.texts.END_TIME}
                                        />
                                    </Col>
                                    <Col 
                                        className="d-flex align-items-center"
                                    >
                                        <Button 
                                            type="button" 
                                            variant="primary" 
                                            // disabled={isSubmitting}
                                            onClick={submitForm}
                                        >
                                            {locale.texts.SEARCH}
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={3}>
                                        <FormikFormGroup 
                                            type="text"
                                            value={this.state.selectedData}
                                            label={values.mode == 'mac' ? locale.texts.NAME : locale.texts.DESCRIPTION}
                                            disabled={true}
                                            display={this.state.selectedData}
                                        />
                                    </Col>
                                </Row>

                                <ReactTable
                                    keyField='id'
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    className="-highlight mt-4 text-capitalize"
                                    style={{height: '70vh', overflowY: 'scroll'}}
                                    // loading={true}
                                    {...styleConfig.reactTable}
                                    getTrProps={(state, rowInfo, column, instance) => {
                                        return {
                                            onClick: (e) => { 
                                                switch(values.mode) {
                                                    case 'mac':
                                                        setFieldValue('key', rowInfo.original.uuid)
                                                        setFieldValue('mode', 'uuid')
                                                        setFieldValue('startTime', rowInfo.original.startTime)
                                                        setFieldValue('endTime', rowInfo.original.endTime)
                                                        this.getLocationHistory({
                                                            ...values,
                                                            ...rowInfo.original,
                                                            key: rowInfo.original.uuid,
                                                            mode: 'uuid'
                                                        })
                                                        break;
                                                    case 'uuid':
                                                        setFieldValue('key', rowInfo.original.mac_address)
                                                        setFieldValue('mode', 'mac')
                                                        setFieldValue('startTime', values.startTime)
                                                        setFieldValue('endTime', values.endTime)
                                                        this.getLocationHistory({
                                                            ...values,
                                                            ...rowInfo.original,
                                                            key: rowInfo.original.mac_address,
                                                            mode: 'mac'
                                                        })
                                                        break;
                                                }

                                            },
                                        }
                                    }}                                     
                                />
                            </div>  
                        </div>
                    )}
                />
            </Container>
        )
    }
}

export default TrackingPathContainer
