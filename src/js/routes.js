import ContentContainer from "./components/container/ContentContainer";
import HealthReport from "./components/container/HealthReport";
import Geofence from "./components/container/Geofence";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";

const routes = [
    {
        path: '/',
        component: ContentContainer,
        exact: true,
    },
    {
        path: '/page/surveillance',
        component: ContentContainer,
        exact: true,
    },
    {
        path: '/page/healthReport',
        component: HealthReport,
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
    }
];

export default routes;