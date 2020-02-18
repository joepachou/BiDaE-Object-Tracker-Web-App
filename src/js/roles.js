const rules = {
    guest: {
        permission: [  
            "form:view",
        ],
      
    },
    care_provider: {
        permission: [
            "form:edit",
            "route:devicesManagement",
            "route:patientManagement",
            "route:userProfile",
            // "route:systemStatus",
            // "route:objectManagement",
            // "route:bigScreen",
            // "route:shiftChangeRecord",
            "user:mydevice",
            "user:mypatient",
            "user:shiftChange",
            "user:saveSearchRecord",
            "user:cleanPath",
            // "route:userManager",
            // "user:toggleArea",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting",
            "user:batteryNotice"
        ]
    },
    system_admin: {
        permission: [
            "form:edit",
            "route:systemStatus",
            "route:userProfile",
            "route:objectManagement",
            "route:editObjectManagement",
            "user:mydevice",
            "user:mypatient",
            "user:saveSearchRecord",
            "route:userManager",
            "route:shiftChangeRecord",
            "user:cleanPath",
            // "user:toggleArea",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting",
            "user:importTable",
            "user:batteryNotice"
        ]
    },
    dev: {
        permission: [
            "form:edit",
            "form:develop",
            "route:systemStatus",
            "route:userProfile",
            "route:objectManagement",
            "route:editObjectManagement",
            "user:mydevice",
            "user:mypatient",
            "user:saveSearchRecord",
            "route:userManager",
            "route:shiftChangeRecord",
            "user:cleanPath",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting",
            "user:importTable",
            "user:batteryNotice",
            "user:shiftChange",
        ]
    }
  };
  
  export default rules;
