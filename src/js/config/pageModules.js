/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        pageModules.js

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
import UserProfile from '../components/container/UserContainer/UserProfile';
import LBeaconTable from '../components/container/LBeaconTable';
import GatewayTable from '../components/container/GatewayTable';
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer';
import config from '../config';
import TransferredLocationManagement from '../components/container/TransferredLocationManagement';
import RolePermissionManagement from '../components/container/RolePermissionManagement';
import MyDeviceManager from '../components/container/UserContainer/MyDeviceManager';
import MyPatientManager from '../components/container/UserContainer/MyPatientManager';
import MonitorSettingBlock from '../components/container/MonitorSettingBlock';
import GeoFenceSettingBlock from '../components/container/GeoFenceSettingBlock';
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord';
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord';
import TrackingTable from '../components/container/TrackingTable';
import TraceContainer from '../components/container/menuContainer/TraceContainer';


export const userContainerModule = {

    title: "user profile",

    defaultActiveKey: "user_profile",

    tabList: [
        {
            name: 'user profile',
            path: 'userProfile',
            href: '#UserProfile',
            component: (props) => <UserProfile />
        },
        {
            name: 'devices management',
            path: 'devicesManagement',
            href: '#DevicesManagement',
            component: (props) => <MyDeviceManager />
        },
        {
            name: 'patient management',
            path: 'patientManagement',
            href: '#PatientManagement',
            component: (props) => <MyPatientManager />
        },
    ],
}

export const systemSettingModule = {

    title: 'system setting',

    defaultActiveKey: 'user_manager',

    path: "/page/systemSetting",

    tabList: [
        {
            name: 'user manager',
            permission: "route:bigScreen",
            component: (props) => <AdminManagementContainer {...props}/>,
            platform: ['browser', 'tablet'],
        },
        {
            name: "transferred location management",
            component: (props) => <TransferredLocationManagement {...props}/>,
            platform: ['browser'],
        },
        {
            name: "Role Permission Management",
            permission: "rolePermissionManagement",
            component: (props) => <RolePermissionManagement {...props}/>,
            platform: ['browser']
        },
        {
            name: "lbeacon",
            component: (props) => <LBeaconTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile']
        },
        {
            name: "gateway",
            component: (props) => <GatewayTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile']
        }
    ]
}

export const monitorSettingModule= {
    
    title: "monitor setting",

    path: "/page/monitor",

    defaultActiveKey: "movement_monitor",

    tabList: [
        {
            name: config.monitorSettingType.MOVEMENT_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.GEOFENCE_MONITOR,
            component: (props) => <GeoFenceSettingBlock {...props}/>
        },
    ]
}

export const trackingHistoryContainerModule = {

    title: "tracking history",

    defaultActiveKey: "real_time_record",

    path: '/page/trace',
    
    tabList: [
        {
            name: 'real time record',
            permission: "route:trackingHistory",
            component: (props) => <TrackingTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'historical record',
            permission: "route:trackingHistory",
            component: (props) => <TraceContainer {...props}/>,
            platform: ['browser', 'tablet'],
        },
    ]
}

export const reportContainerModule = {
    
    title: "report",

    defaultActiveKey: "object_edited_record",

    path: "/page/report",
    
    tabList: [
        {
            name: 'object edited record',
            component: (props) => <ObjectEditedRecord {...props} />,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'Shift Change Record',
            component: (props) => <ShiftChangeRecord {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
    ],

}

export const navbarNavList = [
    {
        name: 'home',
        alias: 'home',
        path: '/',
        hasEvent: true
    },
    {
        name: "shift change",
        alias: "shiftChange",
        // path: "/",
        permission: "user:shiftChange",
        platform: ['browser', 'tablet'],
        hasEvent: true
    },
    {
        name: 'object management',
        alias: 'objectManagement',
        path: '/page/objectManagement',
        permission: 'route:objectManagement',
        hasEvent: true
    },
    {
        name: 'tracking history',
        alias: 'trackinghistory',
        path: '/page/trace',
        module: trackingHistoryContainerModule,
        permission: 'route:trackingHistory',
    },
    {
        name: "monitor setting",
        alias: "monitor",
        path: "/page/monitor",
        module: monitorSettingModule,
        permission: "route:monitor",
        platform: ['browser', 'tablet']
    },
    {
        name: "report",
        alias: "report",
        path: "/page/report",
        module: reportContainerModule,
        permission: "route:report",
        platform: ['browser', 'tablet', 'mobile'],
    },
    {
        name: "system setting",
        alias: "systemSetting",
        path: "/page/systemSetting",
        module: systemSettingModule,
        permission: "route:systemSetting",
        platform: ['browser', 'tablet', 'mobile'],
    },
    // {
    //     name: 'contact tree',
    //     alias: 'contactTree',
    //     path: '/page/contactTree',
    //     permission: 'route:contactTree',
    //     platform: ['browser']
    // },
]