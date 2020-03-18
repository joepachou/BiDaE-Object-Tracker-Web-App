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
            "route:monitorSetting",
            "route:bigScreen",
            "route:trackingPath",
            "route:monitor",
            "route:report",
            
            "user:mydevice",
            "user:mypatient",
            "user:shiftChange",
            "user:saveSearchRecord",
            "user:cleanPath",
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
            "route:userManager",
            "route:shiftChangeRecord",
            "route:rolePermissionManagement",
            "route:transferredLocationManagement",
            "route:monitorSetting",
            "route:trackingPath",
            "route:monitor",
            "route:report",

            "user:mydevice",
            "user:mypatient",
            "user:saveSearchRecord",
            "user:cleanPath",
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
            "route:monitorSetting",
            "route:shiftChangeRecord",
            "route:userManager",
            "route:rolePermissionManagement",
            "route:transferredLocationManagement",
            "route:trackingPath",
            "route:bigScreen",
            "route:monitor",
            "route:report",

            "user:mydevice",
            "user:mypatient",
            "user:saveSearchRecord",
            "user:cleanPath",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "user:importTable",
            "user:batteryNotice",
            "user:shiftChange",
        ]
    }
  };
  
  export default rules;
