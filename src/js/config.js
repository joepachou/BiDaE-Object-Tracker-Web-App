import map from '../img/IIS_Newbuilding_4F_reBack.png';
// import NTUH_YUNLIN_BRANCH_MAP from '../img/NTUH_Yunlin_Branch_Map.png';

import black_pin from '../img/colorPin/Black.svg'
import darkGrey_pin from '../img/colorPin/DarkGrey.svg';
import sos from '../img/colorPin/sos.svg'
import geofence_fence from '../img/geo_fence_fence.svg'
import geofence_perimeter from '../img/geo_fence_perimeter.svg'
import white_pin from '../img/white_pin.svg';
import BOT_LOGO from '../img/BOT_LOGO_RED.png';

const config = {
    
    surveillanceMap: {

        /* Surveillance map source*/
        // map: NTUH_YUNLIN_BRANCH_MAP,
        map: map,

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,
            minZoom: -5,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },

        iconOptions: {
            iconSize: 50,
            // stationaryIconUrl: black_pin,
            // movinfIconUrl: darkGrey_pin,
            // sosIconUrl: sos,
			// geofenceIconFence: geofence_fence,
            // geofenceIconPerimeter: geofence_perimeter,
            // searchedObjectIconUrl: white_pin,
            showNumber: false,
        },

        iconColor: {
            stationary: 'black',
            geofenceF: 'red',
            geofenceP: 'orange',
            searched: 'blue',
            unNormal: 'grey',
            sos: 'sos',
            number: 'white',

            // ['slateblue', 'tan', 'lightyellow', 'lavender', 'orange','lightblue', 'mistyrose', 'yellowgreen', 'darkseagreen', 'orchid']
            pinColorArray: ['orchid','mistyrose', 'tan', 'lightyellow', 'lavender','lightblue', 'yellowgreen']
        },

        /* For test. To start object tracking*/
        startInteval: true,

        /* Object tracking query inteval */
        intevalTime: 1000,

        /* Bound of surveillance map*/
        mapBound:[[0,0], [21130,35710]],

        // mapBound:[[0,0], [651,1584]],
        // mapBound:[[2000,-8500], [14067,18428]],

        
        /* Tracking object Rssi filter */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -60,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: 'low_rssi',
            1: 'med_rssi',
            2: 'high_rssi',
        },

        /* Marker dispersity, can be any positive number */
        markerDispersity: 5,

        // objectTypeSet: new Set(['Bed', 'EKG Machine', 'Infusion pump', 'SONOSITE Ultrasound', 'Ultrasound', 'Bladder scanner', 'CPM'])
        objectType: ['三合一Monitoring', 'EKG', 'IV Pump', '烤燈', '血壓血氧監視器', '電擊器', 'CPM']

        
    },

    objectStatus: {
            
        PERIMETER: 'perimeter',
        FENCE: 'fence',
        NORMAL: 'normal',
        BROKEN: 'broken',
        RESERVE: 'reserve',
        TRANSFERRED: 'transferred',   
    },

    objectManage: {

        /* The definition of the time period that the object is not scanned by lbeacon
         * The time period unit is seconds */
        notFoundObjectTimePeriod: 30,

        geofenceViolationTimePeriod: 300,

        sosTimePeriod: 300,

        objectManagementRSSIThreshold: 0
    },

    transferredLocation: [
        "Yuanlin Christian Hospital",
        "NTU Hospital Yunlin branch",
        "NTU Hospital Taipei",
    ],
    
    locale: {
        defaultLocale: 'tw',
    },

    image: {
        logo: BOT_LOGO,
    },

    companyName: 'BeDITech',

    systemAdmin: {

        openGlobalStateMonitor: !true,

        dataSrcIp: 'localhost',

        refreshSearchResult: true,

    },

    healthReport: {
        startInteval: false,
        pollLbeaconTabelIntevalTime: 60000,
        pollGatewayTableIntevalTime: 60000,
    },

    userPreference: {
        searchHistoryNumber: 4,
        cookies: {
            userInfo: {
                NAME: name,
                SEARCH_HISTORY: 'search_history',
                MY_DEVICES: 'mydevice'
            }
        },
        searchResultForm: 'List'
    },

    frequentSearchOption: {
        MY_DEVICES: 'my devices',
        ALL_DEVICES: 'all devices'
    },

    searchResult:{
        showImage: false,
        style: 'list',
        displayMode: 'showAll',
    },

    monitorType: {
        1: 'geofence',
        2: 'schedule geofence'
    },
}

export default config

