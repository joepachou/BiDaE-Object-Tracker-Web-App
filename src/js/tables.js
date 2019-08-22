import React from 'react';
import config from './config'

const style = {
    column: {
        textAlign: 'center',
    },
    icon: {
        check: {
            color: 'green',
        },
        times: {
            color: 'red',
        },
        exclamation: {
            color: 'red',
        }
    }
}

const lbeaconTable = [
    // {
    //     Header: 'Info',
    //     columns: [
            {
                Header: 'Status',
                accessor: 'health_status',
                width: 60,
                style: style.column,
                Cell: props => !props.value 
                    ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i> 
                    : <i className="fas fa-times" style={style.icon.times}></i>
            },
            {
                Header: 'uuid',
                accessor: 'uuid',
                width: 330
            },
            {
                Header: 'Description',
                accessor: 'description',
                width: 200
            },
            {
                Header: 'IP Address',
                accessor: 'ip_address',
                width: 150
            },
            {
                Header: 'Gateway IP Address',
                accessor: 'gateway_ip_address',
                width: 180
            },
            {
                Header: 'Last Report Time',
                accessor: 'last_report_timestamp',
                width: 200,
            },
    //     ]
    // },
    // {
    //     Header: 'RSSI Threshold',
    //     columns: [
            {
                Header: 'High',
                accessor: 'high_rssi',
                maxWidth: 50
            },
            {
                Header: 'Med',
                accessor: 'med_rssi',
                maxWidth: 50
            },
            {
                Header: 'Low',
                accessor: 'low_rssi',
                maxWidth: 50,
            },
    //     ]
    // }
    // {
    //     Header: 'Gateway IP',
    //     accessor: 'gateway_ip_address',
    //     width: 200
    // },
]

const gatewayTable = [
    // {
    //     Header: 'Info',
    //     columns: [
            {
                Header: 'Status',
                accessor: 'health_status',
                width: 60,
                style: style.column,
                Cell: props => !props.value 
                    ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i> 
                    : <i className="fas fa-times" style={style.icon.times}></i>
            },

            {
                Header: 'IP Address',
                accessor: 'ip_address',
                width: 150
            },
            {
                Header: 'Last Report Time',
                accessor: 'last_report_timestamp',
                width: 200,
            },
            {
                Header: 'Registered Time',
                accessor: 'registered_timestamp',
                width: 200,
            },
            {
                Header: 'Note',
                accessor: 'note',
                width: 200,
            },
    //     ]
    // },
    // {
    //     Header: 'Gateway IP',
    //     accessor: 'gateway_ip_address',
    //     width: 200
    // },

]

const trackingTable = [
    {
        Header: 'Found',
        accessor: 'found',
        style: style.column,
        width: 70
    },
    {
        Header: 'Panic',
        accessor: 'panic',
        width: 70,
        style: style.column,
        Cell: props => props.value ? <i className="fas fa-exclamation" style={style.icon.exclamation}></i> : null
    },
    {
        Header: 'Alert',
        accessor: 'geofence_type',
        width: 70,
    },
    {
        Header: 'Name',
        accessor: 'name',
        width: 100
    },
    {
        Header: 'Type',
        accessor: 'type',
        width: 250
    },
    {
        Header: 'Access Control Number',
        accessor: 'access_control_number',
        width: 200
    },
    {
        Header: 'Status',
        accessor: 'status',
        width: 100,
    },
    {
        Header: 'Transferred Location',
        accessor: 'transferred_location',
        width: 180
    },
    {
        Header: 'Last Location',
        accessor: 'location_description',
        width: 200
    },
    {
        Header: 'Residence Time',
        accessor: 'residence_time',
        width: 150,
    },
]

const searchResultTable = [
    // {
    //     Header: 'Name',
    //     accessor: 'name'
    // },
    {
        Header: 'Type',
        accessor: 'type'
    },
    {
        Header: 'Last Four ACN',
        accessor: 'last_four_acn'
    },
    {
        Header: 'Status',
        accessor: 'status'
    },
    // {
    //     Header: 'Transferred Location',
    //     accessor: 'transferred_location'
    // },
    {
        Header: 'Last Location',
        accessor: 'location_description'
    },
    {
        Header: 'Residence Time',
        accessor: 'residence_time'
    },
]

const objectTable = [
    {
        Header: 'Name',
        accessor: 'name'
    },
    {
        Header: 'Type',
        accessor: 'type'
    },
    {
        Header: 'Access Control Number',
        accessor: 'access_control_number'
    },
    {
        Header: 'Status',
        accessor: 'status'
    },
    {
        Header: 'Transferred Location',
        accessor: 'transferred_location'
    },
    {
        Header: 'Mac Address',
        accessor: 'mac_address',
    },
    {
        Header: 'Monitor Type',
        accessor: 'monitor_type'
    }
]

export { 
    trackingTable,
    searchResultTable,
    lbeaconTable,
    gatewayTable,
    objectTable
}