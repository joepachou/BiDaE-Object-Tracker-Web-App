/** Import React */
import React from 'react';

/** Import survelliance general map  */
import SMap from '../../../img/surveillanceMap.png'
import Logo from '../../../img/BOT.png';

/** Import Component from react-leaflet */
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import L from 'leaflet';
const PAGENAME = 'Surveillance';

export default class surveillance extends React.Component {

    constructor(){
        super()
        this.map = null;
        // this.initMap = this.initMap.bind(this)
    }

    initMap(){
        let mapOptions={
            crs: L.CRS.Simple,
            minZoom: -5,
            center:[0, 250],
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        }
        // this.map = L.map('mapid',mapOptions).setView([37.92388861359015,115.22048950195312], 16);

        let map = L.map('mapid', mapOptions)
        let bounds = [[0,0], [600,600]]
        let image = L.imageOverlay(SMap, bounds).addTo(map)
        map.fitBounds(bounds)
        this.map = map

        var sol = L.latLng([300,300 ]);
        var sol2 = L.latLng([500,510 ]);
        // var sol3 = L.latLng([0,0 ]);
        // var sol4 = L.latLng([100,100 ]);
        // var sol5 = L.latLng([200,200 ]);
        var sol6 = L.latLng([400,400 ]);
        var sol7 = L.latLng([500,520 ]);
        var sol8 = L.marker([500,500]).addTo(map);
        var circle = L.circle([300, 300], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(map);




        
        // var myIcon = L.icon({
        //     iconSize: [38, 95],
        //     iconUrl: Logo,
        // });

        // L.marker([500, 500], {icon: myIcon}).addTo(map);
        L.marker(sol).addTo(map);
        L.marker(sol2).addTo(map);
        // L.marker(sol3).addTo(map);
        // L.marker(sol4).addTo(map);
        // L.marker(sol5).addTo(map);
        L.marker(sol6).addTo(map);
        L.marker(sol7).addTo(map);






        // L.tileLayer(SMap, {
        //   subdomains: "1234",
        //   attribution: '高德地图'
        // }).addTo(this.map);
    }

    componentDidMount(){
        this.initMap();    
        console.log('DIDMOUNT')
        
    }

    render(){

        return(
            <div>
                <h2>{PAGENAME}</h2>
                <div id='mapid'></div>
             </div>
        )
    }
}
