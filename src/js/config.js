import IIS_SINICA_FOURTH_FLOORTH_MAP from "../img/map/iis_new_building_fourth_floor.png";
import NTUH_YUNLIN_WARD_FIVE_B_MAP from "../img/map/ntuh_yunlin_branch_ward_five_b.png";
import NURSING_HOME_MAP from "../img/map/nursing_home.png"
import YUANLIN_CHRISTIAN_HOSPITAL_MAP from "../img/map/yuanlin_christian_hospital.png"
import VETERAN_HOME_FIRST_FLOOR_MAP from "../img/map/veteran_home_first_floor.png"
import VETERAN_HOME_THIRD_FLOOR_MAP from "../img/map/veteran_home_third_floor.png"
import NTUH_MAP from "../img/map/ntuh_map.png"
import BOT_LOGO from "../img//logo/BOT_LOGO_RED.png";
import moment from 'moment'

const config = {

    version: 1890,
    
    objectStatus: {
        PERIMETER: "perimeter",
        FENCE: "fence",
        NORMAL: "normal",
        BROKEN: "broken",
        RESERVE: "reserve",
        TRANSFERRED: "transferred",   
    },

    statusOptions: [
        'normal',
        'broken',
        'reserve',
        'transferred'
    ],

    /** Reserved Object interval time in minutes */
    reservedInterval: 30,

    /** Extend object reserved time in minutes  */
    reservedDelayTime: 10,

    ACNOmitsymbol: 'XXXXXX',
    
    locale: {
        defaultLocale: 'tw' ,
    },

    image: {
        logo: BOT_LOGO,
    },

    systemAdmin: {

        openGlobalStateMonitor: !true,

        refreshSearchResult: true,

    },

    healthReport: {
        startInteval: false,
        pollLbeaconTabelIntevalTime: 5000,
        pollGatewayTableIntevalTime: 5000,
    },

    frequentSearchOption: {
        MY_DEVICES: "my devices",
        ALL_DEVICES: "all devices",
        MY_PATIENTS: "my patients",
        ALL_PATIENTS: "all patients",
        OBJECTS: "objects"
    },

    searchResult:{
        showImage: false,
        style: "list",
        displayMode: "showAll",
    },

    searchResultProportion: '32vh',

    monitorType: {
        1: "geofence",
        2: "panic",
        4: "movement",
        8: "location",
    },

    monitor: {
        geofence: {
            typeId: 1,
            name: "geofence",
            readableName: "geofence",
            api: "geo_fence_config",
        },
        panic: {
            typeId: 2,
            name: "panic",
            readableName: "panic",
            api: null,
        },
        movement: {
            typeId: 4,
            name: "movement",
            readableName: "movement monitor",
            api: "location_not_stay_room_config",
        },
        location: {
            typeId: 8,
            name: "locationMonitor",
            readableName: "not stay room monitor",
            api: "location_not_stay_room_config"
        }
    },


    monitorOptions: [
        'geofence',
        'panic',
        'movement',
        'location'
    ],

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

    shiftOption: [
        "day shift",
        "swing shift",
        "night shift",
    ],

    shiftRecordFolderPath: "shift_record",
    searchResultFolderPath: "search_result",

    folderPath: {
        broken: `${process.env.DEFAULT_FOLDER}/edit_object_record`,
        transferred: `${process.env.DEFAULT_FOLDER}/edit_object_record`,
        shiftChange: `${process.env.DEFAULT_FOLDER}/shift_record`,
        searchResult: `${process.env.DEFAULT_FOLDER}/search_result`
    },

    shiftRecordFileNameTimeFormat: "MM_DD_YYYY",
    shiftRecordPdfContentTimeoFrmat: "MM/DD/YYYY",
    geoFenceViolationTimeFormat: "H:mm MM/DD",
    confirmFormTimeFormat: "LLLL",
    shiftChangeRecordTimeFormat: "LLL",
    pdfFileContentTimeFormat: "LLL",
    pdfFileNameTimeFormat: "YYYY-MM-Do_hh_mm_ss",

    roles: [
        "guest",
        "care_provider",
        "system_admin"
    ],

    defaultRole: ["care_provider"], 

    mobileWindowWidth: 600,

    objectType: {
        0: "medicalDevice",
        1: "inpatient"
    },

    toastProps: {
        position: "bottom-right",
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
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

    /** Create pdf package, including header, body and the pdf path
     * options include shiftChange, searchResult, broken report, transffered report
     */
    getPdfPackage: (option, user, data, locale, signature ,selectValue ) => {
    
        const header = config.pdfFormat.getHeader(user, locale, option, signature,selectValue )
        const body = config.pdfFormat.getBody[option](data, locale, user, location,signature)
        const path = config.pdfFormat.getPath(option, user)
        const pdf = header + body

        return {
            pdf,
            path,
            options: config.pdfFormat.pdfOptions
        }
    },

    getShift: (abbr) => {
        const hour = moment().locale(abbr).hours()
        if (hour < 17 && hour > 8){
            return config.shiftOption[0]
        }else if(hour < 24 && hour > 17){
            return config.shiftOption[1]
        }else{
            return config.shiftOption[2]
        }
    },
    /** Pdf format config */
    pdfFormat: {
        getHeader: (user, locale, option, name,selectValue) => {
            let title = config.pdfFormat.getTitle(option, locale)
            let timestamp = config.pdfFormat.getTimeStamp(locale)
            let titleInfo = config.pdfFormat.getSubTitle[option](locale, user, name,selectValue)
            return title + timestamp + titleInfo
        },
    
        getTitle: (option, locale) => {
            return `
                <h1 style="text-transform: capitalize;">
                    ${locale.texts[config.pdfFormat.pdfTitle[option]]}
                </h1>
            `
        },
    
        getTimeStamp: (locale) => {
            return `
                <div style="text-transform: capitalize;">
                    ${locale.texts.DATE_TIME}: ${moment().locale(locale.abbr).format('LLL')}
                </div>
            `
        },
    
        pdfTitle: {
            broken: "REQUEST_FOR_DEVICE_REPARIE",
            transferred: "DEVICE_TRANSFER_RECORD",
            shiftChange: "SHIFT_CHANGE_RECORD",
            searchResult: "SEARCH_RESULT",
        },
    

        getPath: (option, user) =>{
            let fileDir = config.folderPath[option]
            let fileName = config.pdfFormat.getFileName[option](user, option)
            let filePath = `${fileDir}/${fileName}`
    
            return filePath
        },
    
        getFileName: {
            broken: (user, option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            transferred: (user, option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            shiftChange: (user) => {
                return `${user.name}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            searchResult: (user, option) => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
        },
    
        getBody: {
            broken: (data, locale) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle("broken device list", locale)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale)
                return title + list + notes
            },
            transferred: (data, locale, user, location,signature) => {

                let area = data[0].transferred_location_label
                let signature_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred to", locale, area)
                let list_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred device list", locale)
                let signatureName = config.pdfFormat.getBodyItem.getSignature(locale,signature)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale,signature)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale,signature)
                return signature_title + signatureName + list_title + list + notes
            },
            shiftChange: (data, locale, user) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices found in", 
                    locale, 
                    area,
                    data.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices not found in", 
                    locale, 
                    area,
                    data.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(data.notFoundResult, locale)
                return foundTitle + foundResultList + notFoundTitle + notFoundResultList
            },
            searchResult: (data, locale, user, location) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices found in", 
                    locale, 
                    area, 
                    data.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices not found in", 
                    locale, 
                    area,
                    data.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(data.notFoundResult, locale)
                return foundTitle + foundResultList + notFoundTitle + notFoundResultList
            },
        },
        getBodyItem: {
            getBodyTitle: (title, locale, area, hasTitle = true) => {
                return hasTitle 
                    ?   `
                        <h3 style="text-transform: capitalize; margin-bottom: 5px; font-weight: bold">
                            ${locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                            ${area ? area : ''}
                        </h3>
                    `
                    : ``;
            },
    
            getDataContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div key=${index} style="text-transform: capitalize; margin: 10px;">
                            ${index + 1}.${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(" ")
            },
    
            getNotes: (data, locale) => {
                return `
                    <h3 style="text-transform: capitalize; margin-bottom: 5px; font-weight: bold">
                        ${data[0].notes ? `${locale.texts.NOTE}: ${data[0].notes}` : ''}
                    </h3>
                `
            },

            getSignature: (locale,signature) => {
                return `
                    <div style="text-transform: capitalize; margin: 10px width: 200px;">
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_ID}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block"
                            />
                        </div>
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_NAME}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block"
                            />   
                        </div>
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_SIGNATURE}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block";
                                    value = ${signature}
                            />                  
                        </div>
                    </div>
                `
            }
        },
    
        getSubTitle: {
            shiftChange: (locale, user, name ,selectValue ) => {
                const nextShiftIndex = (config.shiftOption.indexOf(config.getShift(locale.abbr)) + 2) % config.shiftOption.length

                const nextShift = locale.texts[config.shiftOption[nextShiftIndex].toUpperCase().replace(/ /g, "_")]
                const thisShift = locale.texts[config.getShift(locale.abbr).toUpperCase().replace(/ /g, "_")]
                let shift = `<div style="text-transform: capitalize;">
                        ${locale.texts.SHIFT}: ${selectValue.label} ${locale.texts.SHIFT_TO} ${thisShift}
                    </div>`
                let confirmedBy = `<div style="text-transform: capitalize;">
                    ${locale.abbr == 'en' 
                        ? `${locale.texts.CONFIRMED_BY} ${name}`
                        : `${locale.texts.CONFIRMED_BY}: ${name}`
                    }
                </div>`
                let checkby = `<div style="text-transform: capitalize;">
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${user.name}, ${selectValue.label}
                    </div>`
                return confirmedBy + shift + checkby
            },
    
            searchResult: (locale, user) => {
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return username
            },
            broken: (locale, user) => {
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return username
            },
            transferred: (locale, user) => {
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return username
            }
        },
    
        getSubTitleInfo: {
            username: (locale, user) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.USERNAME}: ${user.name}
                    </div>
                `
            },
        },

        /** The pdf option setting in html-pdf */
        pdfOptions: {
            "format": "A4",
            "orientation": "portrait",
            "border": "1cm",
            "timeout": "12000"
        },
    },


    /** Map configuration.
     *  Refer leaflet.js for more option setting https://leafletjs.com/reference-1.5.0.html
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
            markerDispersity: process.env.MARKER_DISPERSITY || 100,

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
            markerDispersity: 1 || process.env.MARKER_DISPERSITY || 100,

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
            markerDispersity: process.env.MARKER_DISPERSITY_IN_BIG_SCREEN || 13,
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
            markerDispersity: 1 || process.env.MARKER_DISPERSITY || 100,

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
            pinColorArray: ["orchid", "tan", "lightyellow", "lavender","lightblue", "yellowgreen"]

        },

        /** Set the schema to select the color pin */
        getIconColor: (item, hasColorPanel) => {
            if (item.panic) return config.mapConfig.iconColor.sos

            if (item.object_type == 0) {
                if (item.searched && hasColorPanel) return item.pinColor
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

        defaultAreaId: process.env.DEFAULT_AREA_ID,
    
        gender: {
            MAN: {
                id: 1,
            },
            GIRL:{
                id: 2,
            },
        },

        areaOptions: process.env.SITES_GROUP
            .split(',')
            .reduce((res, item) => {
                res[item] = {
                    1: "NTUH_EMERGENCY_ROOM",
                    2: "IIS_SINICA_FOURTH_FLOOR",
                    3: "NTUH_YUNLIN_WARD_FIVE_B",
                    4: "NURSING_HOME",
                    5: "YUANLIN_CHRISTIAN_HOSPITAL",
                    6: "VETERAN_HOME_FIRST_FLOOR",
                    7: "VETERAN_HOME_THIRD_FLOOR",
                }[item]
                return res
            }, {}),
    
        areaList : [
            "none",
            "NTUH_EMERGENCY_ROOM",
            "IIS_SINICA_FOURTH_FLOOR",
            "NTUH_YUNLIN_WARD_FIVE_B",
            "NURSING_HOME",
            "YUANLIN_CHRISTIAN_HOSPITAL",
            "VETERAN_HOME_FIRST_FLOOR",
            "VETERAN_HOME_THIRD_FLOOR",
        ],
        
        areaModules: {
            NTUH_EMERGENCY_ROOM: {
                id: 1,
                name: "NTUH",
                url: NTUH_MAP,
                bounds: [[0, 0], [33660,57514]],
            },

            IIS_SINICA_FOURTH_FLOOR: {
                id: 2,
                name: "IIS_SINICA_FOURTH_FLOOR",
                url: IIS_SINICA_FOURTH_FLOORTH_MAP,
                bounds: [[0,0], [21130,35710]],
            },

            NTUH_YUNLIN_WARD_FIVE_B: {
                id: 3,
                name: "NTUH_YUNLIN_WARD_FIVE_B",
                url: NTUH_YUNLIN_WARD_FIVE_B_MAP,
                bounds: [[0, 0], [26067,36928]],

            },
            NURSING_HOME: {
                id: 4,
                name: "NURSING_HOME",
                url: NURSING_HOME_MAP,
                bounds: [[0,0], [20000,45000]],
            },
            
            YUANLIN_CHRISTIAN_HOSPITAL: {
                id: 5,
                name: "YUANLIN_CHRISTIAN_HOSPITAL",
                url: YUANLIN_CHRISTIAN_HOSPITAL_MAP,
                bounds: [[0, 0], [27000,27000]],

            },

            VETERAN_HOME_FIRST_FLOOR: {
                id: 6,
                name: "VETERAN_HOME_FIRST_FLOOR",
                url: VETERAN_HOME_FIRST_FLOOR_MAP,
                bounds: [[0,0], [21000,26000]],
            },

            VETERAN_HOME_THIRD_FLOOR: {
                id: 7,
                name: "VETERAN_HOME_THIRD_FLOOR",
                url: VETERAN_HOME_THIRD_FLOOR_MAP,
                bounds: [[0,0], [21000,26000]],
            },
        },

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
                                                    ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.last_four_acn.slice(-4)},
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

    },
}

export default config

