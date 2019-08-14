const en =  {
    ABBR: 'en-US',

    surveillance: 'Surveillance',
    HOME: 'home',
    HEALTH_REPORT: 'health report',
    GEOFENCE: 'geofence',
    OBJECT_MANAGEMENT: 'object management',
    object_types: 'object types',
    search: 'search',
    language: 'language',
    search_result: 'search result',


    /* Frequent Search */
    FREQUENT_SEARCH: 'frequent searches',
    ALL_DEVICE: 'All Devices',
    MY_DEVICE: 'My Devices',

    /* Location accuracy */
    LOCATION_ACCURACY: 'Location Accuracy',
    LOW: 'low',
    MED: 'med',
    HIGH: 'high',

    // clear and save
    CLEAR : 'clear',
    SAVE : 'save',
    
    /* Search related term */
    Yunlin_Christian_Hospital: 'Yunlin Christian Hospital',
    NTU_Hospital_Yunlin: 'NTU Hospital Yunlin Branch',
    NTU_Hospital_Taipe: 'NTU Hospital Taipe Branch',

    SIGN_IN: 'sign in',
    SIGN_UP: 'sign up',
    SIGN_OUT: 'sign out',

    EDIT_LBEACON: 'edit lbeacon',
    ADD_OBJECT: 'add object',
    EDIT_OBJECT: 'edit object',

    /* Object Status */
    NORMAL: 'normal',
    BROKEN: 'broken',
    TRANSFERRED: 'transferred',
    RESERVE: 'reserve',


    /* Form */
    CANCEL: 'cancel',
    SEND: 'send',

    /* Time Scale*/
    DAY: 'day',
    HOUR: 'hour',
    MINUTE: 'minute',
    SECOND: 'second',

    SEARCH_RESULT: 'search result',

    SELECT_LOCATION: 'select location',

    NAME_IS_REQUIRED: 'Name is required',
    TYPE_IS_REQUIRED: 'Type is required',
    ACCESS_CONTROL_NUMBER_IS_REQUIRED: 'Access control number is required',
    MAC_ADDRESS_IS_REQUIRED: 'Mac address is required',
    STATUS_IS_REQUIRED: 'Status is required',

    /* Form field */
    NAME: 'name',
    TYPE: 'type',
    ACCESS_CONTROL_NUMBER: 'access control number',
    MAC_ADDRESS: 'mac address',
    STATUS: 'status',
    ACN: 'acn',

    FOUND: 'found',

    SHIFT_CHANGE_RECORD: 'Shift Change Record',

    DEVICE_FOUND: function (length){
        return length.toString()+' devices are found'
    },
    DEVICE_NOT_FOUND: function (length){
        return length.toString()+' devices are not found'
    },
    SEARCH_RESULT: 'Search Results',

}

export default en;