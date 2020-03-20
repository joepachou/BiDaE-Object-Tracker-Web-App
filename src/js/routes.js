import MainContainer from "./components/container/MainContainer";
import SystemSetting from "./components/container/MenuContainer/SystemSetting";
import ObjectManagementContainer from "./components/container/MenuContainer/ObjectManagementContainer";
import UserContainer from "./components/container/MenuContainer/UserContainer"
import BigScreenContainer from "./components/container/BigScreen/BigScreenContainer";
import About from "./components/container/About"
import TrackingPathContainer from "./components/container/TrackingPathContainer"
import MonitorSettingContainer from "./components/container/MenuContainer/MonitorSettingContainer"
import ReportContainer from "./components/container/MenuContainer/ReportContainer"
import ManagementContainer from "./components/container/MenuContainer/ManagementContainer"

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
        path: '/page/trackingPath',
        component: TrackingPathContainer,
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
    {
        path: '/page/management',
        component: ManagementContainer,
        exact: true
    }
];

export default routes;