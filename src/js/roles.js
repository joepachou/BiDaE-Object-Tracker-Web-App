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
            "user:mydevice"
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
        ]
    }
  };
  
  export default rules;