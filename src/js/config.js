import IIS_SINICA_FOURTH_FLOORTH_MAP from "../img/map/iis_new_building_fourth_floor.png";
import NTUH_YUNLIN_WARD_FIVE_B_MAP from "../img/map/ntuh_yunlin_branch_ward_five_b.png";
import NURSING_HOME_MAP from "../img/map/nursing_home.png"
import YUANLIN_CHRISTIAN_HOSPITAL_MAP from "../img/map/yuanlin_christian_hospital.png"
import VETERAN_HOME_FIRST_FLOOR_MAP from "../img/map/veteran_home_first_floor.png"
import VETERAN_HOME_THIRD_FLOOR_MAP from "../img/map/veteran_home_third_floor.png"
import BOT_LOGO from "../img//logo/BOT_LOGO_RED.png";
import moment from 'moment'
import patientP from "../img//logo/pic.png"
const config = {
    
    
    surveillanceMap: {


        /* For test. To start object tracking*/
        startInteval: true,

        /* Object tracking query inteval */
        intevalTime: 1000,
        
        /* Tracking object Rssi filter */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -70,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: "low_rssi",
            1: "med_rssi",
            2: "high_rssi",
        },


        // objectTypeSet: new Set(["Bed", "EKG Machine", "Infusion pump", "SONOSITE Ultrasound", "Ultrasound", "Bladder scanner", "CPM"])
        // objectType: ["三合一Monitor", "EKG", "IV Pump", "烤燈", "血壓血氧監視器", "電擊器", "CPM"]
    },

    objectStatus: {
        PERIMETER: "perimeter",
        FENCE: "fence",
        NORMAL: "normal",
        BROKEN: "broken",
        RESERVE: "reserve",
        TRANSFERRED: "transferred",   
    },

    /** Reserved Object interval time in minutes */
    reservedInterval: 30,

    /** Extend object reserved time in minutes  */
    reservedDelayTime: 10,

    patientStatus:{
        BATTERY_CHANGE:"Change",
        BATTERY_NORMAL:"Normal",
    },


    gender:{
        GENDER:"Gender",
        MAN:"man",
        GIRL:"girl",
    },


    ACNOmitsymbol: 'xxxxxx',

    objectManage: {

        /* The definition of the time period that the object is not scanned by lbeacon
         * The time period unit is seconds */
        notFoundObjectTimePeriod: 30,

        geofenceViolationTimePeriod: 300,

        sosTimePeriod: 300,

        objectManagementRSSIThreshold: 0
    },

    transferredLocation: {
        Yuanlin_Christian_Hospital: [
            "ward_7A",
            "ward_7B",
            "ward_6A",
            "ward_6B",
            "ward_5A",
            "ward_5B",
            "ICU",
            "OP"
        ],
        // NTU_Hospital_Yunlin_branch: [
        //     "ward_5b",
        //     "ward_5a",
        //     "nursing_home"
        // ],
        // NTU_Hospital_Taipei: [
        //     "emergency_room"
        // ],
        Yunlin_Christian_Hospital: [
            "ward_5A",
            "ward_5B",
            "ICU",
            "OP"
        ],
        // Pingtung_Christian_Hospital: [
        //     "ward_7A",
        //     "ward_7B",
        //     "ICU",
        // ],
        CHANGHUA_Christian_Hospital: [
            "ward_7A",
            "ward_7B",
            "ICU",
        ],
    },
    
    locale: {
        defaultLocale: "tw",
    },

    defaultRSSIThreshold: 1,

    image: {
        logo: BOT_LOGO,
    },

    patientPicture:
    {
       logo :  patientP,
    },

    companyName: "BeDITech",

    systemAdmin: {

        openGlobalStateMonitor: !true,

        refreshSearchResult: true,

    },

    healthReport: {
        startInteval: false,
        pollLbeaconTabelIntevalTime: 5000,
        pollGatewayTableIntevalTime: 5000,
    },

    userPreference: {
        searchHistoryNumber: 4,
        cookies: {
            userInfo: {
                NAME: name,
                SEARCH_HISTORY: "search_history",
                MY_DEVICES: "mydevice"
            }
        },
        searchResultForm: "List"
    },

    frequentSearchOption: {
        MY_DEVICES: "my devices",
        ALL_DEVICES: "all devices",
        MY_PATIENTS: "my patients",
        ALL_PATIENTS: "all patients"
    },

    searchResult:{
        showImage: false,
        style: "list",
        displayMode: "showAll",
    },

    searchResultProportion: '32vh',

    monitorType: {
        // 0: "normal",
        1: "geofence",
        2: "panic",
        4: "movement",
        8: "location",
    },

    shiftOption: [
        "day shift",
        "swing shift",
        "night shift",
    ],

    shiftRecordFolderPath: "shift_record",
    searchResultFolderPath: "search_result",

    folderPath: {
        broken: "edit_object_record",
        transferred: "edit_object_record",
        shiftChange: "shift_record",
        searchResult: "search_result"
    },

    shiftRecordFileNameTimeFormat: "MM_DD_YYYY",
    shiftRecordPdfContentTimeoFrmat: "MM/DD/YYYY",
    geoFenceViolationTimeFormat: "h:mm MM/DD/YYYY",
    confirmFormTimeFormat: "LLLL",
    shiftChangeRecordTimeFormat: "LLL",
    pdfFileContentTimeFormat: "LLL",
    pdfFileNameTimeFormat: "MM_DD_YYYY",

    roles: [
        "guest",
        "care_provider",
        "system_admin"
    ],


    defaultRole: "care_provider", 

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
        2: "info",
        4: "error",
        8: "info",
    },

    statusToCreatePdf: [
        "broken",
        "transferred"
    ],

    /** Create pdf package, including header, body and the pdf path
     * options include shiftChange, searchResult, broken report, transffered report
     */
    getPdfPackage: (option, user, data, locale, location, name) => {
        const header = config.pdfFormat.getHeader(user, locale, option, name)
        const body = config.pdfFormat.getBody[option](data, locale, user, location)
        const path = config.pdfFormat.getPath(option, user)
        const pdf = header + body

        return {
            pdf,
            path,
            options: config.pdfFormat.pdfOptions
        }
    },

    /** Pdf format config */
    pdfFormat: {
        getHeader: (user, locale, option, name) => {
            let title = config.pdfFormat.getTitle(option, locale)
            let timestamp = config.pdfFormat.getTimeStamp(locale)
            let titleInfo = config.pdfFormat.getSubTitle[option](locale, user, name)
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
                return `${user.name}_${user.shift.replace(/ /g, '_')}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            searchResult: (user, option) => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
        },
    
        getBody: {
            broken: (data, locale) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle("broken device list", locale)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = config.pdfFormat.getBodyItem.getNotes(data)
                return title + list + notes
            },
            transferred: (data, locale) => {
                // console.log(data[0].transferred_location.value.split(','))
                let area = data[0].transferred_location.label
                let signature_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred to", locale, area)
                let list_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred device list", locale)
                let signature = config.pdfFormat.getBodyItem.getSignature(locale)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = config.pdfFormat.getBodyItem.getNotes(data)
                return signature_title + signature + list_title + list + notes
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
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn}, 
                            ${locale.texts.NEAR}${item.location_description}
                        </div>
                    `
                }).join(" ")
            },
    
            getNotes: (data) => {
                return `
                    <h3 style="text-transform: capitalize; margin-bottom: 5px; font-weight: bold">
                        ${data[0].notes ? `${locale.texts.NOTE}: ${data[0].notes}` : ''}
                    </h3>
                `
            },

            getSignature: (locale) => {
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
                                    display: inline-block"
                            />                  
                        </div>
                    </div>
                `
            }
        },
    
        getSubTitle: {
            shiftChange: (locale, user, name) => {
                const nextShiftIndex = (config.shiftOption.indexOf(user.shift) + 2) % config.shiftOption.length
                const nextShift = locale.texts[config.shiftOption[nextShiftIndex].toUpperCase().replace(/ /g, "_")]
                const thisShift = locale.texts[user.shift.toUpperCase().replace(/ /g, "_")]
                let shift = `<div style="text-transform: capitalize;">
                        ${locale.texts.SHIFT}: ${nextShift} ${locale.texts.SHIFT_TO} ${thisShift}
                    </div>`
                let confirmedBy = `<div style="text-transform: capitalize;">
                    ${locale.abbr == 'en' 
                        ? `${locale.texts.CONFIRMED_BY} ${name}`
                        : `${locale.texts.CONFIRMED_BY}: ${name}`
                    }
                </div>`
                let checkby = `<div style="text-transform: capitalize;">
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${user.name}, ${thisShift}
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
            // center: L.latLng(-2000, -4000),
            zoom: -5,
            minZoom: -6,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },


        /** Set the icon option */
        iconOptions: {
            iconSize: 30,
            showNumber: !false,
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
            pinColorArray: ["orchid","mistyrose", "tan", "lightyellow", "lavender","lightblue", "yellowgreen"]
        },

        geoFenceMarkerOption: {
            color: 'rgba(0, 0, 0, 0)',
            fillColor: 'orange',
            fillOpacity: 0.4,
            radius: 25,
        },

        lbeaconMarkerOption: {
            color: 'rgba(0, 0, 0, 0)',
            fillColor: 'orange',
            fillOpacity: 0.4,
            radius: 15,
        },

        /** Set the schema to select the color pin */
        getIconColor: (item, hasColorPanel) => {
            if (item.object_type == 0) {
                if (item.panic) return config.mapConfig.iconColor.sos
                else if (item.searched && hasColorPanel) return item.pinColor
                else if (item.searched) return config.mapConfig.iconColor.searched
                else if (item.status !== config.mapConfig.objectStatus.NORMAL) return config.mapConfig.iconColor.unNormal
                else return config.mapConfig.iconColor.normal
            } 
            else if (item.object_type == 1) return config.mapConfig.iconColor.male
            else if (item.object_type == 2) return config.mapConfig.iconColor.female
        },

        defaultAreaId: 3,
    
        
        gender: {
            MAN: {
                id: 1,
            },
            GIRL:{
                id: 2,
            },
        },


        areaOptions: {
            1: "IIS_SINICA_FOURTH_FLOOR",
            3: "NTUH_YUNLIN_WARD_FIVE_B",
            4: "NURSING_HOME",
            5: "YUANLIN_CHRISTIAN_HOSPITAL",
            6: "VETERAN_HOME_FIRST_FLOOR",
            7: "VETERAN_HOME_THIRD_FLOOR",
        },
    
        areaModules: {

            IIS_SINICA_FOURTH_FLOOR: {
                id: 1,
                name: "IIS_SINICA_FOURTH_FLOOR",
                url: IIS_SINICA_FOURTH_FLOORTH_MAP,
                bounds: [[0,0], [21130,35710]],
            },

            NTUH_YUNLIN_WARD_FIVE_B: {
                id: 3,
                name: "NTUH_YUNLIN_WARD_FIVE_B",
                url: NTUH_YUNLIN_WARD_FIVE_B_MAP,
                // bounds: [[-5000,-5000], [21067,31928]],
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
                // bounds: [[3000,-3000], [24000,30000]],
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
        intevalTime: 1000,

        objectStatus: {
            PERIMETER: "perimeter",
            FENCE: "fence",
            NORMAL: "normal",
            BROKEN: "broken",
            RESERVE: "reserve",
            TRANSFERRED: "transferred",   
        },
        
        /* Set the rssi threshold */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -60,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: "low_rssi",
            1: "med_rssi",
            2: "high_rssi",
        },

        /* Set the Marker dispersity that can be any positive number */
        markerDispersity: 13,

        popupOptions: {
            minWidth: "500",
            maxHeight: "300",
            className : "customPopup",
            showNumber: false
        },

        /** Set the html content of popup of markers */
        getPopupContent: (object, objectList, locale) => {
            var indexNumberForPatient = 0
            var indexNumberForDevice = 0
            /* The style sheet is right in the src/css/Surveillance.css*/
            var PatientTotalNumber = 0;
            var DeviceTotalNumber = 0;

            objectList.map((item,index) => {
                if (item.object_type != 0) PatientTotalNumber ++;
                else DeviceTotalNumber ++;   
            })
            
            const content = `
                <div>
                    <h4 class="border-bottom pb-1 px-2">${object[0].location_description}</h4>
                    ${objectList.map((item, index) => {
                        var element = `<div class="row popupRow mb-2 mx-2 d-flex jusify-content-start">`
                        element += config.mapConfig.popupOptions.showNumber
                            ?   `<div class="popupType text-capitalize">${index + 1}.</div>`
                            :   `<div class="popupType text-capitalize">&#9642;  </div>`
                        if(item.object_type == 0){
                            element +=                                ` 
                            <div class="popupType text-capitalize">
                               ${item.type}
                            </div>
                            <div class="popupType ">
                                , ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.last_four_acn}
                            </div>
                            <div class="popupType">
                                ${item.status !== "normal" 
                                    ? `, ${locale.texts[item.status.toUpperCase()]}`
                                    : `, ${item.residence_time}`
                                }
                            </div>
                        `
                        } else {
                            element += 
                                `     
                                    <div class="popupType">
                                        ${item.name} 
                                    </div>
                                    <div class="popupType">
                                        , ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name}
                                    </div>
                                    <div class="popupType">
                                        , ${item.residence_time}
                                    </div>
                                `
                        }
                        element += `</div>`
                        return element
                    }).join("")
                    }
                </div>` 
            return content
        },

    }
}

export default config

