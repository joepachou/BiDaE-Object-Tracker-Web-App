import React from "react";
import 'react-table/react-table.css';

const style = {
    column: {
        textAlign: "center",
    },
    icon: {
        check: {
            color: "green",
        },
        times: {
            color: "red",
        },
        exclamation: {
            color: "orange",
        },
        circle: {
            color: "orange",
        }
    },
    battery:{
        full: {
            color: "green",
        },
        half: {
            color: "orange",
        },
        empty: {
            color: "red",
        }
    }
}


const lbeaconTableColumn = [

    {
        Header: "status",
        accessor: "health_status",
        width: 60,
        style: style.column,
        Cell: props => props.value 
            ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i>
            : <i className="fas fa-times-circle" style={style.icon.times}></i>
    },
    {
        Header: "danger area",
        accessor: "danger_area",
        width: 60,
        style: style.column,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : null
    },
    {
        Header: "UUID",
        accessor: "uuid",
        width: 330
    },
    {
        Header: "description",
        accessor: "description",
        width: 200
    },
    {
        Header: "room",
        accessor: "room",
        width: 100,
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 150
    },
    {
        Header: "Gateway IP Address",
        accessor: "gateway_ip_address",
        width: 180
    },
    {
        Header: "Last Report Time",
        accessor: "last_report_timestamp",
        width: 200,
    },
    {
        Header: "Note",
        accessor: "note",
        width: 250,
    },
]

const gatewayTableColumn = [
    {
        Header: "Status",
        accessor: "health_status",
        width: 60,
        style: style.column,
        Cell: props => !props.value 
            ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i> 
            : <i className="fas fa-times-circle" style={style.icon.times}></i>
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 250
    },
    {
        Header: "Last Report Timestamp",
        accessor: "last_report_timestamp",
        width: 300,
    },
    {
        Header: "Registered Timestamp",
        accessor: "registered_timestamp",
        width: 300,
    },
    {
        Header: "Note",
        accessor: "note",
        width: 250,
    },
]

const trackingTableColumn = [
    {
        Header: "Found",
        accessor: "found",
        style: style.column,
        width: 60,
        Cell: props => props.value 
            ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i> 
            : <i className="fas fa-times-circle" style={style.icon.times}></i>
    },
    {
        Header: "Battery",
        accessor: "battery_indicator",
        style: style.column,
        width: 70,
        Cell: props => 
            props.value === 3 && <i  className="fas fa-battery-full" style={style.battery.full}></i> ||
            props.value === 2 && <i className="fas fa-battery-half" style={style.battery.half}></i> ||
            props.value === 1 && <i className="fas fa-battery-empty" style={style.battery.empty}></i>
    },
    {
        Header: "Panic",
        accessor: "panic",
        width: 60,
        style: style.column,
        Cell: props => props.value ? <i className="fas fa-exclamation" style={style.icon.exclamation}></i> : null
    },
    {
        Header: "Alert",
        accessor: "geofence_type",
        width: 60,
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 150,
    },
    {
        Header: "Name",
        accessor: "name",
        width: 150
    },
    {
        Header: "Type",
        accessor: "type",
        width: 150
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number",
        width: 140
    },
    {
        Header: "Status",
        accessor: "status",
        width: 100,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location",
        width: 180
    },
    {
        Header: "Last Location",
        accessor: "location_description",
        width: 180
    },
    {
        Header: "Residence Time",
        accessor: "residence_time",
        width: 100,
    },
]

const searchResultTableColumn = [
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Last Four ACN",
        accessor: "last_four_acn"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Last Location",
        accessor: "location_description"
    },
    {
        Header: "Residence Time",
        accessor: "residence_time"
    },
]

const patientTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 150
    },
    {
        Header: "PATIENT_GENDER",
        accessor: "object_type",
        width: 50,
    },
    {
        Header: "patient Number",
        accessor: "asset_control_number",
        width: 100,
    },
    {
        Header: "auth Area",
        accessor: "area_name.label",
        width: 150,
    },
    {
        Header: "room",
        accessor: "room",
        width: 100,
    },
    {
        Header: "attending Physician",
        accessor: "physician_name",
        width: 100,
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 150,
    },
    {
        Header: "Monitor Type",
        accessor: "monitor_type"
    },
]

const importTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 200,
    },
    {
        Header: "Type",
        accessor: "type",
        width: 200,
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number",
        width: 200,
    },
]



const objectTableColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "auth Area",
        accessor: "area_name.label"
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number"
    },
    {
        Header: "Status",
        accessor: "status.label",
        width: 100,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location.label"
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
    },
    {
        Header: "Monitor Type",
        accessor: "monitor_type"
    }
]

const geofenceTableColumn = [
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 180,
    },
    {
        Header: "Type",
        accessor: "type",
        width: 100,
    },
    {
        Header: "UUID",
        accessor: "uuid"
    },
    {
        Header: "Receive Time",
        accessor: "receive_time",
        width: 200,
    },
    {
        Header: "Alert Time",
        accessor: "alert_time",
        width: 200,
    },
    {
        Header: "Name",
        accessor: "name",
        width: 200,
    },
]

const userInfoTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        resizable: false,
        width: 150,
    },
    {
        Header: "Roles",
        accessor: "role_type",
        width: 150,
    },
    {
        Header: "last visit timestamp",
        accessor: "last_visit_timestamp",
        width: 250
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 250,
    },
    
]

const editObjectRecordTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 100,
    },
    {
        Header: "edit time",
        accessor: "edit_time",
        width: 200,
    },
    {
        Header: "new status",
        accessor: "new_status",
        width: 150,
    },
    {
        Header: "Notes",
        accessor: "notes",
    },
]

const shiftChangeRecordTableColumn = [
    {
        Header: "user name",
        accessor: "user_name",
        width: 150,
    },
    {
        Header: "shift",
        accessor: "shift",
        width: 140,
    },
    {
        Header: "submit timestamp",
        accessor: "submit_timestamp",
        width: 200,
    }
]

const deviceManagerTableColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Access Control Number",
        accessor: "asset_control_number"
    },
    {
        Header: "Status",
        accessor: "status",
        width: 100,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location"
    }, 
]

const geofenceConfigColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "start time",
        accessor: "start_time"
    },
    {
        Header: "end time",
        accessor: "end_time"
    },
    {
        Header: "area",
        accessor: "area_id"
    }
]



export { 
    trackingTableColumn,
    searchResultTableColumn,
    lbeaconTableColumn,
    gatewayTableColumn,
    objectTableColumn,
    importTableColumn,
    patientTableColumn,
    geofenceTableColumn,
    userInfoTableColumn,
    editObjectRecordTableColumn,
    shiftChangeRecordTableColumn,
    deviceManagerTableColumn,
    geofenceConfigColumn

}