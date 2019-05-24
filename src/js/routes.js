import ContentContainer from "./components/container/ContentContainer";
import HealthReport from "./components/container/HealthReport";
import Geofence from "./components/container/Geofence";

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
];

export default routes;