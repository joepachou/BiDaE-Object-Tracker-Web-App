import map from '../img/IIS_Newbuilding_4F.png';

import black_pin from '../img/black_pin_v2.svg'
import darkGrey_pin from '../img/darkGrey_pin_v2.svg';
import sos from '../img/sos.svg'
import geofence_fence from '../img/geo_fence_fence.svg'
import geofence_perimeter from '../img/geo_fence_perimeter.svg'
import white_pin from '../img/white_pin.svg';
import BOT_LOGO from '../img/BOT_LOGO_RED_MOD.png';


const config = {

    surveillanceMap: {

        /* Surveillance map source*/
        map: map,

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,
            minZoom: -5,
            maxZoom: 0,
            zoomControl: !true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },

        iconOptions: {
            iconSize: 50,
            stationaryIconUrl: black_pin,
            movinfIconUrl: darkGrey_pin,
            sosIconUrl: sos,
			geofenceIconFence: geofence_fence,
            geofenceIconPerimeter: geofence_perimeter,
            searchedObjectIconUrl: white_pin,
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
            pinColorSet: ['tan', 'lightyellow', 'lavender', 'lightblue', 'darkseagreen', 'mistyrose']
        },

        /* For test. To start object tracking*/
        startInteval: !true,

        /* Object tracking query inteval */
        intevalTime: 1000,

        /* Bound of surveillance map*/
        mapBound:[[0,0], [21130,35710]],
        
        /* Tracking object Rssi filter */
        locationAccuracy: {
            defaultVal: -55,
            lowVal: -60,
            highVal: -30,
        },
        
    },

    transferredLocation: [
        "Yunlin_Christian_Hospital",
        "NTU_Hospital_Yunlin",
        "NTU_Hospital_Taipei",
    ],
    
    locale: {
        defaultLocale: 'en'
    },

    image: {
        logo: BOT_LOGO,
    }



}

export default config;