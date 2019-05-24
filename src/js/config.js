import map from '../img/IIS_Newbuilding_4F.png';

import black_pin from '../img/black_pin_v2.svg'
import darkGrey_pin from '../img/darkGrey_pin_v2.svg';
import sos from '../img/sos.svg'


const config = {

    surveillanceMap: {

        /* Surveillance map source*/
        map: map,

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,
            minZoom: -5,
            maxZoom: 0,
            zoomControl: true,
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
    
    locale: {
        defaultLocale: 'en'
    },



}

export default config;