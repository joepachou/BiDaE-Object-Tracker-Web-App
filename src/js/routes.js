import MainContainer from "./components/container/MainContainer";
import MonitorManagement from "./components/container/MonitorManagement";
import Geofence from "./components/container/Geofence";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";
import UserSettingContainer from "./components/container/UserContainer/UserSettingContainer";

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/monitorManagement',
        component: MonitorManagement,
        exact: true,
    },
    {
        path: '/page/geofence',
        component: Geofence,
        exact: true,
    },
    {
        path: '/page/objectManagement',
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: '/page/userSetting',
        component: UserSettingContainer,
        exact: true,
    },
];

export default routes;