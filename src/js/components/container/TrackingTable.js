/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TrackingTable.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { AppContext } from '../../context/AppContext';
import {
    trackingTableColumn
} from '../../config/tables'
import { toast } from 'react-toastify';
import messageGenerator from '../../helper/messageGenerator';
import styleConfig from '../../config/styleConfig';
import apiHelper from '../../helper/apiHelper';
import { JSONClone } from '../../helper/utilities';
 

class TrackingTable extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        trackingColunm: [],
        tabIndex: 0,
        locale: this.context.locale.abbr,
    }

    toastId = null;

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.abbr !== prevState.locale) {
            this.getTrackingData();
        }
    }

    componentDidMount = () => {
        this.getTrackingData()
    }

    componentWillUnmount = () => {
        toast.dismiss(this.toastId)
    }


    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{areaId}] = stateReducer

        apiHelper.trackingDataApiAgent.getTrackingData({
            locale: locale.abbr,
            user: auth.user,
            areaId
        })
        .then(res => {
            this.setMessage('clear')
            let column = JSONClone(trackingTableColumn);

            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                    textTransform: 'capitalize'
                }
                if (field.accessor == '_id') {
                    field.headerStyle = {
                        textAlign: 'center',
                    }
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.map((item, index) => {
                item.status = locale.texts[item.status.toUpperCase()]
                item.transferred_location = ''
                item._id = index + 1;
                // item.transferred_location 
                //     ? locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')]
                //     : ''
            })
            this.setState({
                trackingData: res.data,
                trackingColunm: column,
                locale: locale.abbr,
            })
        })
        .catch(err => {
            this.setMessage(
                'error',
                'connect to database failed',
                true,
            )

            console.log(`get tracking data failed ${err}`);
        })
    }

    setMessage = (type, msg, isSetting) => {

        switch(type) {
            case 'success':
                this.toastId = messageGenerator.setSuccessMessage(msg)
                break;
            case 'error':
                if (isSetting && !this.toastId) {
                    this.toastId = messageGenerator.setErrorMessage(msg)
                } 
                break;
            case 'clear':
                this.toastId = null;
                toast.dismiss(this.toastId)
                break;
        }
    }

    render(){
        return  (
            <ReactTable 
                style={{maxHeight:'85vh'}}
                data={this.state.trackingData} 
                columns={this.state.trackingColunm} 
                resizable={true}
                freezeWhenExpanded={false}
                {...styleConfig.reactTable}
                // pageSize={this.state.trackingData.length}
            />
        )
    }
}

export default TrackingTable;