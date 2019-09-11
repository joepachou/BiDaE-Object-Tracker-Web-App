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
            "route:geofence",
            "route:devicesManagement",
            "route:shiftChangeRecord",
            "user:mydevice",
            "user:shiftChange",
            "user:saveSearchRecord"
        ]
    },
    system_admin: {
        permission: [
            "form:edit",
            "route:systemStatus",
            "route:geofence",
            "route:objectManagement",
            "route:userManager",
            "route:editObjectManagement",
            "user:saveSearchRecord"
        ]
    }
  };
  
  export default rules;