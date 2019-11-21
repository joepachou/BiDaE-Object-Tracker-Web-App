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
            "route:devicesManagement",
            "route:patientManagement",
            // "route:objectManagement",
            // "route:shiftChangeRecord",
            "user:mydevice",
            "user:shiftChange",
            "user:saveSearchRecord",
            // "route:userManager",
            // "user:toggleArea",
            "user:toggleShowDevices",
            "user:toggleShowResidents"
        ]
    },
    system_admin: {
        permission: [
            "form:edit",
            "route:systemStatus",
            "route:objectManagement",
            "route:editObjectManagement",
            "user:mydevice",
            "user:saveSearchRecord",
            "route:userManager",
            "route:shiftChangeRecord",
            // "user:toggleArea",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting"
        ]
    },
    dev: {
        permission: [
            "form:edit",
            "route:systemStatus",
            "route:objectManagement",
            // "route:editObjectManagement",
            "user:mydevice",
            "user:saveSearchRecord",
            "route:userManager",
            "route:shiftChangeRecord",
            // "user:toggleArea",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
        ]
    }
  };
  
  export default rules;