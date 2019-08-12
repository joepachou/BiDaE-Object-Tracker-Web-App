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
    register: {
        permission: [
            "form:edit",
            "route:healthReport",
        ]
    },
    admin: {
        permission: [
            "form:edit",
            "route:healthReport",
            "route:geofence",
            "route:objectManagement",
        ]
    }
  };
  
  export default rules;