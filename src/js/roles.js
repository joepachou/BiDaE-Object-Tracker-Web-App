const rules = {
    guest: {
        permission: [  
            "form:view",
        ],
        routes: [
            {
              component: 'OnlyForHeadOfOperation', 
              url: '/only-for-head-of-operation'
            },
        ],

      
    },
    care_provider: {
        permission: [
            "form:edit",
            // "route:geofence",
            "route:devicesManagement",
            "route:shiftChangeRecord",
            "user:mydevice",
            "user:shiftChange",
            "user:saveSearchRecord",
            "route:userManager",
        ]
    },
    system_admin: {
        permission: [
            "form:edit",
            "route:systemStatus",
            // "route:geofence",
            "route:objectManagement",
            "route:editObjectManagement",
            "user:mydevice",
            "user:saveSearchRecord",
            "route:userManager",

        ]
    }
  };
  
  export default rules;