/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        config.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';
import siteConfig from '../../site_module/siteConfig';
import moment from 'moment';

const config = {

    VERSION: 'v1.0 b.1920',

    TIMESTAMP_FORMAT: 'LLL',

    TRACING_INTERVAL_UNIT: 'days',

    MAX_SEARCH_OBJECT_NUM: 5,

    TRACING_INTERVAL_VALUE: 1,

    DEFAULT_CONTACT_TREE_INTERVAL_UNIT: 'days',

    DEFAULT_CONTACT_TREE_INTERVAL_VALUE: 1,

    MAX_CONTACT_TRACING_LEVEL: 6,

    RECORD_TYPE: {
        EDITED_OBJECT: 'editedObject',
        SHIFT_CHANGE: 'shiftChange'
    },
    
    DEFAULT_USER: {
        roles: 'guest',
        areas_id: [0],
        permissions:[
            'form:view',
        ],
        locale: 'tw',
        main_area: 0,
    },

    DEFAULT_LOCALE: 'tw' ,

    LOGO: BOT_LOGO,

    statusOptions: [
        'normal',
        'broken',
        'reserve',
        'transferred'
    ],

    monitorOptions: [
        'geofence',
        'panic',
        'movement',
        'location'
    ],

    ACNOmitsymbol: 'XXXXXX',

    monitorTypeMap: {
        object: [1],
        patient: [1,2,4,8]
    },

    monitorSettingType: {
        MOVEMENT_MONITOR: "movement monitor",
        LONG_STAY_IN_DANGER_MONITOR: "long stay in danger monitor",
        NOT_STAY_ROOM_MONITOR: "not stay room monitor",
        GEOFENCE_MONITOR: "geofence monitor",
    },

    monitorSettingUrlMap: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        "not stay room monitor": "location_not_stay_room_config",
        "geofence monitor": "geo_fence_config"
    },

    monitorSetting: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        location: "location_not_stay_room_config",
        geo: "geo_fence_config"
    },

    getLbeaconDataIntervalTime: process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    getGatewayDataIntervalTime: process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    objectStatus: {
        PERIMETER: "perimeter",
        FENCE: "fence",
        NORMAL: "normal",
        BROKEN: "broken",
        RESERVE: "reserve",
        TRANSFERRED: "transferred",   
    },

    FOLDER_PATH: {

        trackingRecord: `tracking_record`
    },

    AJAX_STATUS_MAP: {
        LOADING: 'loading',
        SUCCESS: 'succcess',
        NO_RESULT: 'no result',
        WAIT_FOR_SEARCH: 'wait for search',
    },

    PDF_FILENAME_TIME_FORMAT: "YYYY-MM-Do_hh_mm_ss",

    DEFAULT_ROLE: ['system_admin'], 

    ROLES_SELECTION: [
        'system_admin',
        'care_provider',
        'dev',
    ],

    HEALTH_STATUS_MAP: {
        0: 'normal',
        9999: 'n/a',
    },

    PRODUCT_VERSION_MAP: {
        9999: 'n/a',
    },

    TOAST_PROPS: {
        position: 'bottom-right',
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
    },

    shiftOption: [
        "day shift",
        "swing shift",
        "night shift",
    ],


    frequentSearchOption: {
        MY_DEVICES: "my devices",
        ALL_DEVICES: "all devices",
        MY_PATIENTS: "my patients",
        ALL_PATIENTS: "all patients",
        OBJECTS: "objects",
        OBJECT_TYPE: "object type"
    },

    monitorType: {
        1: "geofence",
        2: "panic",
        4: "movement",
        8: "location",
    },

    monitorSettingType: {
        MOVEMENT_MONITOR: "movement monitor",
        LONG_STAY_IN_DANGER_MONITOR: "long stay in danger monitor",
        NOT_STAY_ROOM_MONITOR: "not stay room monitor",
        GEOFENCE_MONITOR: "geofence monitor",
    },

    monitorSettingUrlMap: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        "not stay room monitor": "location_not_stay_room_config",
        "geofence monitor": "geo_fence_config"
    },

    monitorSetting: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        location: "location_not_stay_room_config",
        geo: "geo_fence_config"
    },

    toastMonitorMap: {
        1: "warn",
        2: "error",
        4: "error",
        8: "error",
    },

    statusToCreatePdf: [
        "broken",
        "transferred"
    ],

    getShift: () => {
        const hour = moment().hours()
        if (hour < 17 && hour > 8){
            return config.shiftOption[0]
        }else if(hour < 24 && hour > 17){
            return config.shiftOption[1]
        }else{
            return config.shiftOption[2]
        }
    },

    /** Map configuration.
     *  Refer leaflet.js for more optional setting https://leafletjs.com/reference-1.5.0.html
     */
    mapConfig: {
        mapOptions: {
            crs: L.CRS.Simple,
            zoom: -5.5,
            minZoom: -5.46,
            maxZoom: 0,
            // zoomDelta: 1,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            maxBoundsOffset: [-10000, 10000],
            maxBoundsViscosity: 0.0
        },

        browserMapOptions: {
            crs: L.CRS.Simple,
            zoom: -5.5,
            minZoom: -5.46,
            maxZoom: -5,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            maxBoundsOffset: [-10000, 10000],
            maxBoundsViscosity: 0.0
        },

        tabletMapOptions: {
            crs: L.CRS.Simple,
            zoom: -6.6,
            minZoom: -6.8,
            maxZoom: -6,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            maxBoundsOffset: [-10000, 10000],
            maxBoundsViscosity: 0.0
        },
        
        mobileMapOptions: {
            crs: L.CRS.Simple,
            zoom: -7.25,
            minZoom: -7.4,
            maxZoom: -7,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            maxBoundsOffset: [-10000, 10000],
            maxBoundsViscosity: 0.0
        },

        bigScreenMapOptions: {
            crs: L.CRS.Simple,
            center: L.latLng(17000, 18000),
            zoom: -5.7,
            minZoom: -6,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },

        /** Set the icon option for browser */
        iconOptions: {

            iconSize: [process.env.MARKER_SIZE_IN_DESKTOP, process.env.MARKER_SIZE_IN_DESKTOP] || 1,

            iconAnchor: [process.env.MARKER_SIZE_IN_DESKTOP / 2, process.env.MARKER_SIZE_IN_DESKTOP],

            showNumber: true,

            numberSize: 10, 

            numberShiftTop: '',

            numberShiftLeft: '2%',

            specifiedNumberTop: '8%',

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 400,

            geoFenceMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 20,
            },

            lbeaconMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 20,
            },

            lbeaconMarkerFailedOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'red',

                fillOpacity: 0.4,

                radius: 20,
            },

            errorCircleOptions: {

                color: '#ffc107',

                fillColor: '#ffc10778',

                fillOpacity: 0.5,

                radius: 50,
            },
        },

        /** Set the icon option for mobile */
        iconOptionsInMobile: {

            iconSize: [process.env.MARKER_SIZE_IN_MOBILE, process.env.MARKER_SIZE_IN_MOBILE] || 1,

            iconAnchor: [process.env.MARKER_SIZE_IN_MOBILE / 2, process.env.MARKER_SIZE_IN_MOBILE],

            circleRadius: 8,

            circleRadiusForTablet: 15,

            showNumber: true,

            numberShiftTop: '-25%',

            numberShiftLeft: '3%',

            specifiedNumberTop: '-20%',

            numberSize: 8, 

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 100,

            geoFenceMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 8,
            },

            lbeaconMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 8,
            },
        },

        /** Set the icon options for big screen */
        iconOptionsInBigScreen: {

            iconSize: [50, 50] || 1,

            iconAnchor: [25, 50],

            showNumber: false,

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 100,
        }, 

        /** Set the icon option for tablet */
        iconOptionsInTablet: {

            iconSize: [process.env.MARKER_SIZE_IN_TABLET, process.env.MARKER_SIZE_IN_TABLET],

            iconAnchor: [process.env.MARKER_SIZE_IN_TABLET / 2, process.env.MARKER_SIZE_IN_TABLET],

            showNumber: true,

            numberShiftTop: '-25%',

            numberShiftLeft: '3%',

            specifiedNumberTop: '-20%',

            numberSize: 8, 

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 1,

            geoFenceMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 10,
            },

            lbeaconMarkerOptions: {

                color: 'rgba(0, 0, 0, 0)',

                fillColor: 'orange',

                fillOpacity: 0.4,

                radius: 10,
            },
        },

        /** Set the representation of color pin 
         * Icon options for AwesomeNumberMarkers 
         * The process: 
         * 1. Add the declaration of the desired icon option
         * 2. Add the CSS description in leafletMarker.css */
        iconColorList: [
            "black",
            "red",
            "orange",
            "blue",
            "grey",
            "white",
            "orchid",
            "mistyrose",
            "tan",
            "lightyello",
            "lavender",
            "lightblue",
            "yellowgreen",
            "sos",
            "female",
            "male"
        ],

        iconColor: {
            normal: "black",
            geofenceF: "red",
            geofenceP: "orange",
            searched: "blue",
            unNormal: "grey",
            sos: "sos",
            number: "white",
            female: "female",
            male: "male",
            female_1: "female_2",
            male_1: "male_1",

            // ["slateblue", "tan", "lightyellow", "lavender", "orange","lightblue", "mistyrose", "yellowgreen", "darkseagreen", "orchid"]
            pinColorArray: ["slateblue", "orange", "yellowgreen", "lightblue", "tan"]

        },

        /** Set the schema to select the color pin */
        getIconColor: (item, hasColorPanel) => {
            if (item.panic) return config.mapConfig.iconColor.sos

            if (item.object_type == 0) {
                if (hasColorPanel) return item.pinColor
                else if (item.searched) return config.mapConfig.iconColor.searched
                else if (item.status !== config.mapConfig.objectStatus.NORMAL) return config.mapConfig.iconColor.unNormal
                else return config.mapConfig.iconColor.normal
            } 
            else if (item.object_type == 1) return config.mapConfig.iconColor.male
            else if (item.object_type == 2) return config.mapConfig.iconColor.female
        },

        getIconColorInBigScreen: (item, hasColorPanel) => {

            if(item.pinColor == -1){
                return config.mapConfig.iconColor.normal
            }else{
                return config.mapConfig.iconColor.pinColorArray[item.pinColor]
            }
        },
    
        gender: {
            MAN: {
                id: 1,
            },
            GIRL:{
                id: 2,
            },
        },

        areaOptions: Object.keys(siteConfig.areaModules)
            .reduce((res, item) => {
                res[siteConfig.areaModules[item].id] = item
                return res
            }, {}),

        areaModules: siteConfig.areaModules,

        AREA_MODULES: siteConfig.areaModules,

        AREA_OPTIONS: Object.values(siteConfig.areaModules),

        /* For test. To start object tracking*/
        startInteval: true,

        /* Set the tracking query inteval time(ms) */
        intervalTime: process.env.OBJECT_TRACKING_INTERVAL_TIME_IN_MILLI_SEC,

        objectStatus: {
            PERIMETER: "perimeter",
            FENCE: "fence",
            NORMAL: "normal",
            BROKEN: "broken",
            RESERVE: "reserve",
            TRANSFERRED: "transferred",   
        },

        popupOptions: {
            minWidth: "500",
            maxHeight: "300",
            className : "customPopup",
            showNumber: false,
            autoPan: false
        },

        /** Set the html content of popup of markers */
        getPopupContent: (object, objectList, locale) => {
            const content = `
                <div class="text-capitalize">
                    <div class="popupTitle">
                        ${object[0].location_description}
                    </div>
                    <div class="popupContent"> 
                        ${objectList.map((item, index) => {
                            return  `
                                <div id='${item.mac_address}' class="popupItem">
                                    <div class="d-flex justify-content-start">
                                        <div class="popupIndex">
                                            ${config.mapConfig.popupOptions.showNumber
                                                ?   `${index + 1}.`
                                                :   `&bull;`
                                            }
                                        </div>
                                        <div>
                                            ${item.object_type == 0
                                                ?   `
                                                    ${item.type},
                                                    ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
                                                    ${item.status !== "normal" 
                                                        ? `${locale.texts[item.status.toUpperCase()]}`
                                                        : `${item.residence_time}`    
                                                    }
                                                    ${item.status == "reserve" 
                                                        ? `~ ${item.reserved_timestamp_final}`
                                                        : ''
                                                    }
                                                    ${item.status == "reserve" 
                                                    ? ` ${locale.texts.IS_RESERVED_FOR}`
                                                    : ''
                                                } 

                                                    ${item.status == "reserve" 
                                                    ? ` ${item.reserved_user_name}`
                                                    : ''
                                                } 
                                                `
                                                :   `     
                                                    ${item.name}, 
                                                    ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
                                                    ${item.residence_time}
                                                `
                                            }
                                        </div>
                                    </div>
                                </div>
                            `                            
                        }).join("")
                        }
                    </div>
                </div>
            ` 
            return content
        },

        /** Set the html content of popup of Lbeacon markers */
        getLbeaconPopupContent: lbeacon => {
            return `
                <div>
                    <div>
                        description: ${lbeacon.description}
                    </div>
                    <div>
                        coordinate: ${lbeacon.coordinate}
                    </div>
                </div>
            ` 
        },

    },
}

export default config

