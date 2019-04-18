import ContentContainer from "./components/container/ContentContainer";
import HealthReport from "./components/container/HealthReport";

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
];

export default routes;