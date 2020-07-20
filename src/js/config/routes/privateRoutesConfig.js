/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        privateRoutesConfig.js

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


import MainContainer from '../../components/container/MainContainer';
import SystemSetting from '../../components/container/menuContainer/SystemSetting';
import ObjectManagementContainer from '../../components/container/menuContainer/ObjectManagementContainer';
import UserContainer from '../../components/container/menuContainer/UserContainer';
import About from '../../components/container/About';
import TraceContainer from '../../components/container/menuContainer/TraceContainer';
import ContactTree from '../../components/container/menuContainer/ContactTree';
import BigScreenContainer from "../../components/container/bigScreen/BigScreenContainer";
import MonitorSettingContainer from "../../components/container/menuContainer/MonitorSettingContainer";
import ReportContainer from "../../components/container/menuContainer/ReportContainer";
import TrackingHistoryContainer from '../../components/container/menuContainer/TrackingHistoryContainer';
import routes from './routes';
import BOTAdminContainer from '../../components/container/menuContainer/BOTAdminContainer';

const privateRoutesConfig = [
    {
        path: routes.HOME,
        component: MainContainer,
        exact: true,
    },
    {
        path: routes.SETTINGS,
        component: SystemSetting,
        exact: true,
    },
    {
        path: routes.OBJECT_MANAGEMENT,
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: routes.USER_SETTINGS,
        component: UserContainer,
        exact: true,
    },
    {
        path: routes.BIG_SCREEN,
        component: BigScreenContainer,
        exact: true,
    },
    {
        path: routes.ABOUT,
        component: About,
        exact: true,
    },
    {
        path: routes.TRACE,
        component: TrackingHistoryContainer,
        exact: true,
    },
    {
        path: routes.CONTACT_TREE,
        component: ContactTree,
        exact: true,
    },
    {
        path: routes.MONITOR_SETTINGS,
        component: MonitorSettingContainer,
        exact: true,
    },
    {
        path: routes.RECORDS,
        component: ReportContainer,
        exact: true,
    },
    {
        path: routes.BOT_ADMIN,
        component: BOTAdminContainer,
        exact: true,
    },
];

export default privateRoutesConfig;