/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        routes.js

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


import MainContainer from '../components/container/MainContainer';
import SystemSetting from '../components/container/MenuContainer/SystemSetting';
import ObjectManagementContainer from '../components/container/MenuContainer/ObjectManagementContainer';
import UserContainer from '../components/container/MenuContainer/UserContainer';
import About from '../components/container/About';
import TraceContainer from '../components/container/MenuContainer/TraceContainer';
import ContactTree from '../components/container/MenuContainer/ContactTree';
import BigScreenContainer from "../components/container/bigScreen/BigScreenContainer";
import MonitorSettingContainer from "../components/container/MenuContainer/MonitorSettingContainer";
import ReportContainer from "../components/container/MenuContainer/ReportContainer";

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/systemSetting',
        component: SystemSetting,
        exact: true,
    },
    {
        path: '/page/objectManagement',
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: '/page/userSetting',
        component: UserContainer,
        exact: true,
    },
    {
        path: '/page/bigScreen',
        component: BigScreenContainer,
        exact: true,
    },
    {
        path: '/page/about',
        component: About,
        exact: true,
    },
    {
        path: '/page/trace',
        component: TraceContainer,
        exact: true,
    },
    {
        path: '/page/contactTree',
        component: ContactTree,
        exact: true,
    },
    {
        path: '/page/monitor',
        component: MonitorSettingContainer,
        exact: true,
    },
    {
        path: '/page/report',
        component: ReportContainer,
        exact: true,
    },
];

export default routes;