const tw = {
    ABBR: 'zh-tw',

    BEDI_TECH: '畢迪科技',

    HOME : '首頁',
    HEALTH_REPORT: 'Health Report',
    DEVICE_MONITOR: '偵測裝置',
    SYSTEM_STATUS: '系統狀態',
    MONITOR_MANAGEMENT: '偵測裝置管理',
    GEOFENCE: 'Geofence',
    OBJECT_MANAGEMENT: '物件管理',

    SEARCH_RESULT: '搜尋結果',
    No_RESULT: 'no result',
    FREQUENT_SEARCH: '常用搜尋',
    FOUND: '找到',
    NOT_FOUND: '未找到',


    /* Location accuracy */
    LOCATION_ACCURACY: '位置精準度',
    LOW: '低',
    MED: '中',
    HIGH: '高', 
    
    /* Frequent Search */
    ALL_DEVICE: '全部儀器',
    MY_DEVICE: '我的儀器',

    /* Button */
    CLEAR : '清除',
    SAVE : '儲存',
    CANCEL: '取消',
    SEND: '送出',
    SIGN_IN: '登入',
    SIGN_UP: '註冊',
    SIGN_OUT: '登出',
    SHIFT_CHANGE_RECORD: '交接記錄',
    SHOW_DEVICES: '顯示儀器',
    HIDE_DEVICES: '隱藏儀器',
    SHOW:'顯示',
    DEVICES: '儀器',
    DEVICE: '儀器',
    DOWNLOAD: '下載',
    DELETE: '刪除',
    ADD_USER: '新增使用者',


    /* Form Field */
    NAME: '名稱',
    TYPE: '類別',
    ACCESS_CONTROL_NUMBER: '財產編號',
    MAC_ADDRESS: 'mac address',
    STATUS: '儀器狀態',
    MONITOR_TYPE: '監控類別',
    ACN: '財產編號',
    LOCATION: '地點',
    RSSI_THRESHOLD: 'RSSI設定',
    LAST_FOUR_DIGITS_IN_ACN: '產編後四碼',
    SELECT_LOCATION: '選擇地點',
    ADD_DEVICE: '增加儀器',
    ADD_NOTE: '增加註記',
    HIDE_NOTE: '隱藏註記',
    DELAY_BY: 'delay by',
    SHIFT: '班別',
    DAY_SHIFT: '早班',
    NIGHT_SHIFT: '晚班',
    SHIFT_SELECT: '選擇班別',


    /** Error Message */
    NAME_IS_REQUIRED: '請填入名字',
    TYPE_IS_REQUIRED: '請填入類別',
    LOCATION_IS_REQUIRED: '請選擇地點',
    ACCESS_CONTROL_NUMBER_IS_REQUIRED: '請填入財產編號',
    MAC_ADDRESS_IS_REQUIRED: '請填入Mac address',
    STATUS_IS_REQUIRED: '請填入儀器狀態',
    USERNAME_IS_REQUIRED: '請填入使用者名稱',
    PASSWORD_IS_REQUIRED: '請填入密碼',
    THE_USERNAME_IS_ALREADY_TAKEN: '使用者名稱已被使用',
    

    /** Form Title */
    EDIT_LBEACON: '編輯 lbeacon',
    ADD_OBJECT: '增加儀器',
    EDIT_OBJECT: '編輯儀器',
    REPORT_DEVICE_STATUS: '回報儀器狀態',
    THANK_YOU_FOR_REPORTING: '謝謝您的回報',
    PRINT_SEARCH_RESULT: '下載搜尋結果',
    EDIT_USER: '編輯使用者',

    /* Object Status */
    STATUS: '狀態',
    NORMAL: '正常',
    BROKEN: '損壞',
    TRANSFERRED: '轉移',
    RESERVE: '預定',

    /** Transferred Location */
    YUANLIN_CHRISTIAN_HOSPITAL: '員林基督教醫院',
    NTU_HOSPITAL_YUNLIN_BRANCH: '台大醫院雲林分院',
    NTU_HOSPITAL_TAIPEI: '台大醫院台北總院',

    /** User Setting */
    USER_SETTING: '帳戶設定',
    DEVICES_MANAGEMENT: '儀器管理',
    SHIFT_CHANGE_RECORD: '換班紀錄',
    EDIT_OBJECT_MANAGEMENT: '儀器狀態更改紀錄',
    ACCESS_RIGHT: '使用者權限',
    MY_DEVICES: '我的儀器',
    OTHER_DEVICES: '其他儀器',
    USER_MANAGER: '使用者管理',
    ADMIN: '管理員',
    CONFIRM: '確認', 
    REMOVE_USER_CONFIRM: '移除使用者',

    /** Table Title */
    TRACKING: '物件追蹤',

    /** Table Field */
    ID: 'ID',
    HEALTH_STATUS: '狀態',
    UUID: 'UUID',
    DESCRIPTION: '地點描述',
    IP_ADDRESS: 'IP位址',
    GATEWAY_IP_ADDRESS: 'gateway IP位址',
    LAST_REPORT_TIMESTAMP: '最後回報時間',
    LAST_REPORT_TIME: '最後回報時間',
    REGISTERED_TIMESTAMP: '註冊時間',
    LAST_VISIT_TIMESTAMP: '上次登入時間',
    HIGH_RSSI: '高RSSI',
    MED_RSSI: '中RSSI',
    LOW_RSSI: '低RSSI',
    NOTE: '註記',
    BATTERY_VOLTAGE: '電量',
    BATTERY: '電量',
    PANIC: '求救',
    GEOFENCE_TYPE: 'geofence類別',
    ALERT: '警告',
    TRANSFERRED_LOCATION: '轉移單位',
    LAST_LOCATION: '最後所在地點',
    LOCATION_DESCRIPTION: '所在地點',
    RESIDENCE_TIME: '停留時間',
    RECEIVE_TIME: '收到時間',
    ALERT_TIME: '警告時間',
    ROLES: '權限',
    EDIT_TIME: '編輯時間',
    NOTES: '註記',
    NO_DATA_AVAILABE: '無資料顯示', 
    SUBMIT_TIMESTAMP: '儲存時間',
    USER_NAME: '人員名稱',

    /** User Setting */
    USERNAME: '使用者名稱',
    PASSWORD: '密碼',

    /** User Roles */
    CARE_PROVIDER: '護理人員',
    SYSTEM_ADMIN: '系統管理員',

    TO: '至',
    NEAR: '鄰近',
    IS: 'is',
    WHEN: '於',
    NOT_AVAILABLE: '無資料顯示',

    DEVICE_FOUND: function (length){
        return '發現'+length.toString()+'個儀器'
    },
    DEVICE_NOT_FOUND: function (length){
        return '沒發現'+length.toString()+'個儀器'
    },

}

export default tw;
