const en =  {
    ABBR: 'en-US',

    BEDI_TECH: 'BeDITech',

    HOME: 'home',
    HEALTH_REPORT: 'health report',
    DEVICE_MONITOR: 'device monitor',
    SYSTEM_STATUS: 'system status',
    MONITOR_MANAGEMENT: 'monitor management',
    GEOFENCE: 'geofence',
    OBJECT_MANAGEMENT: 'object management',

    SEARCH_RESULT: 'search result',
    No_RESULT: 'no result',
    FREQUENT_SEARCH: 'frequent searches',
    FOUND: 'found',
    NOT_FOUND: 'not found',


    /* Location accuracy */
    LOCATION_ACCURACY: 'Location Accuracy',
    LOW: 'low',
    MED: 'med',
    HIGH: 'high',

    /* Frequent Search */
    ALL_DEVICE: 'All Devices',
    MY_DEVICE: 'My Devices',

    /* Button */
    CLEAR : 'clear',
    SAVE : 'save',
    CANCEL: 'cancel',
    SEND: 'send',
    SIGN_IN: 'sign in',
    SIGN_UP: 'sign up',
    SIGN_OUT: 'sign out',
    SHIFT_CHANGE_RECORD: 'shift change record',
    SHOW_DEVICES: 'show devices',
    HIDE_DEVICES: 'hide devices',
    SHOW:'show',
    DEVICE: 'device',
    DEVICES: 'devices',
    DOWNLOAD: 'download',
    DELETE: 'delete',
    ADD_USER: 'add user',

    /* Form Field */
    NAME: 'name',
    TYPE: 'type',
    ACCESS_CONTROL_NUMBER: 'access control number',
    MAC_ADDRESS: 'mac address',
    STATUS: 'status',
    MONITOR_TYPE: 'monitor type',
    ACN: 'ACN',
    LOCATION: 'location',
    RSSI_THRESHOLD: 'RSSI threshold',
    LAST_FOUR_DIGITS_IN_ACN: 'last 4 digits in ACN',
    SELECT_LOCATION: 'select location',
    ADD_DEVICE: 'add device',
    ADD_NOTE: 'add note',
    HIDE_NOTE: 'hide note',
    DELAY_BY: 'delay by',
    SHIFT: 'shift',
    DAY_SHIFT: 'day shift',
    NIGHT_SHIFT: 'night shift',
    SHIFT_SELECT: 'shift select',
    WRITE_THE_NOTES: 'write some notes...',

    /** Error Message */
    NAME_IS_REQUIRED: 'Name is required',
    TYPE_IS_REQUIRED: 'Type is required',
    LOCATION_IS_REQUIRED: 'location is required',
    ACCESS_CONTROL_NUMBER_IS_REQUIRED: 'Access control number is required',
    MAC_ADDRESS_IS_REQUIRED: 'Mac address is required',
    STATUS_IS_REQUIRED: 'Status is required',
    USERNAME_IS_REQUIRED: 'Username is required',
    PASSWORD_IS_REQUIRED: 'Password is required',
    THE_USERNAME_IS_ALREADY_TAKEN: 'The username is already taken',


    /** Form Title */
    EDIT_LBEACON: 'edit lbeacon',
    ADD_OBJECT: 'add object',
    EDIT_OBJECT: 'edit object',
    REPORT_DEVICE_STATUS: 'Report device status',
    THANK_YOU_FOR_REPORTING: 'Thank you for reporting',
    PRINT_SEARCH_RESULT: 'print search result',
    EDIT_USER: 'edit user',

    /* Object Status */
    STATUS: 'status',
    NORMAL: 'normal',
    BROKEN: 'broken',
    TRANSFERRED: 'transferred',
    RESERVE: 'reserve',
  
    /** Transferred Location */
    YUANLIN_CHRISTIAN_HOSPITAL: 'Yuanlin Christian Hospital',
    NTU_HOSPITAL_YUNLIN_BRANCH: 'NTU Hospital Yunlin Branch',
    NTU_HOSPITAL_TAIPEI: 'NTU Hospital Taipe',

    /** User Setting */
    USER_SETTING: 'User Setting',
    DEVICES_MANAGEMENT: 'Devices Management',
    SHIFT_CHANGE_RECORD: 'Shift change record',
    EDIT_OBJECT_MANAGEMENT: 'Edit Object Record',
    ACCESS_RIGHT: 'Access Right',
    MY_DEVICES: 'My Devices',
    OTHER_DEVICES: 'Other Devices',
    USER_MANAGER: 'user manager',
    ADMIN: 'Admin',
    CONFIRM: 'Confirm', 
    REMOVE_USER_CONFIRM: 'Remove User',

    /** Table Title */
    TRACKING: 'tracking',

    /** Table Field */
    ID: 'ID',
    HEALTH_STATUS: 'status',
    UUID: 'UUID',
    DESCRIPTION: 'description',
    IP_ADDRESS: 'IP address',
    GATEWAY_IP_ADDRESS: 'gateway IP address',
    LAST_REPORT_TIMESTAMP: 'last report timestamp',
    LAST_REPORT_TIME: 'last report time',
    REGISTERED_TIMESTAMP: 'registered time',
    LAST_VISIT_TIMESTAMP: 'last visit time',
    HIGH_RSSI: 'high RSSI',
    MED_RSSI: 'med RSSI',
    LOW_RSSI: 'low RSSI',
    NOTE: 'note',
    BATTERY_VOLTAGE: 'batter voltage',
    BATTERY: 'battery',
    PANIC: 'panic',
    GEOFENCE_TYPE: 'geofence type',
    ALERT: 'alert',
    TRANSFERRED_LOCATION: 'transferred Location',
    LOCATION_DESCRIPTION: 'location description',
    LAST_LOCATION: 'last location',
    RESIDENCE_TIME: 'residence time',
    RECEIVE_TIME: 'receive time',
    ALERT_TIME: 'alert time',
    ROLES: 'role type',
    EDIT_TIME: 'edit time',
    NOTES: 'notes', 
    NO_DATA_AVAILABE: 'no data available',
    SUBMIT_TIMESTAMP: 'submit time',
    USER_NAME: 'user name',

    /** User Setting */
    USERNAME: 'username',
    PASSWORD: 'password',

    /** User Roles */
    CARE_PROVIDER: 'care provider',
    SYSTEM_ADMIN: 'system admin',

    TO: 'to',
    NEAR: 'near',
    IS: 'is',
    WHEN: 'when',
    NOT_AVAILABLE: 'N/A',

    DEVICE_FOUND: function (length){
        return length.toString()+' devices are found'
    },
    DEVICE_NOT_FOUND: function (length){
        return length.toString()+' devices are not found'
    },

}

export default en;