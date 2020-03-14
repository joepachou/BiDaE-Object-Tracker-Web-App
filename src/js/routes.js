import MainContainer from "./components/container/MainContainer";
import SystemStatus from "./components/container/SystemStatus";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";
import UserContainer from "./components/container/UserContainer/UserContainer"
import BigScreenContainer from "./components/container/BigScreen/BigScreenContainer";
import About from "./components/container/About"
import TrackingPathContainer from "./components/container/TrackingPathContainer"

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/systemStatus',
        component: SystemStatus,
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
];

export default routes;