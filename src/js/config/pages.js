export const navbarList = [
    {
        name: "home",
        alias: "home",
        path: "/",
    },
    {
        name: "shift change",
        alias: "shiftChange",
        path: "/",
        permission: "user:shiftChange",
        platform: ['browser', 'tablet'],
    },
    {
        name: "object management",
        alias: "objectManagement",
        path: "/page/objectManagement",
        permission: "route:objectManagement"
    },
    {
        name: "tracking history",
        alias: "trackinghistory",
        path: "/page/trackingHistory",
        permission: "route:trackingHistory"

    },
    {
        name: "big screen",
        alias: "bigScreen",
        path: "/page/bigScreen",
        permission: "route:bigScreen",
        platform: ['browser']
    },
    {
        name: "monitor setting",
        alias: "monitor",
        path: "/page/monitor",
        permission: "route:monitor",
        platform: ['browser']
    },
    {
        name: "report",
        alias: "report",
        path: "/page/report",
        permission: "route:report",
        platform: ['browser', 'tablet']
    },

    {
        name: "system setting",
        alias: "systemSetting",
        path: "/page/systemSetting",
        permission: "route:systemSetting"
    },

]