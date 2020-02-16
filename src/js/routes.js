import MainContainer from "./components/container/MainContainer";
import SystemStatus from "./components/container/SystemStatus";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";
import UserSettingContainer from "./components/container/UserContainer/UserSettingContainer";
import BigScreenContainer from "./components/container/BigScreen/BigScreenContainer";

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
        component: UserSettingContainer,
        exact: true,
    },
    {
        path: '/page/bigScreen',
        component: BigScreenContainer,
        exact: true,
    },
];

export default routes;