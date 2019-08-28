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
    careProvider: {
        permission: [
            "form:edit",
            "route:geofence",
        ]
    },
    systemAdmin: {
        permission: [
            "form:edit",
            "route:monitorManagement",
            "route:geofence",
            "route:objectManagement",
        ]
    }
  };
  
  export default rules;