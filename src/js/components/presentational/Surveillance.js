/** Import React */
import React from 'react';

/** Import survelliance general map  */
import SMap from '../../../img/surveillanceMap.png'
import pin from '../../../img/pin.png'
import BOTLogo from '../../../img/BOTLOGO.png'

/** Import Axios */
import axios from 'axios';

/** Import leaflet.js */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/** Import leaflet.markercluser library */
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../../../css/CustomMarkerCluster.css'

import { mapOptions, customIconOptions } from '../../customOption';


const PAGENAME = 'Surveillance';

/** API url */
const API = 'http://localhost:3000/users';

/** Redux related Library  */
import { updateMenuOption } from '../../action';
import { showObjectList } from '../../action';
import { connect } from 'react-redux';

class Surveillance extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: [],
            lbeaconInfo: {},
        }
        this.map = null;
        this.handlemenu = this.handlemenu.bind(this);
        this.getObjData = this.getObjData.bind(this);
        
    }

    handlemenu(e){
        const { lbeaconInfo } = this.state
        console.log(e.latlng)
        const lbeacon_coorinate = Object.values(e.target._latlng)
        this.props.updateMenu(true);
        this.props.showObjectList(lbeaconInfo[lbeacon_coorinate]);
    }

    initMap(){
        // this.map = L.map('mapid',mapOptions).setView([37.92388861359015,115.22048950195312], 16);
        // let pos_1 = [200,100];
        // let pos_2 = [700,700];

        let map = L.map('mapid', mapOptions)
        let bounds = [[0,0], [900,900]]
        let image = L.imageOverlay(SMap, bounds).addTo(map)
        map.fitBounds(bounds)
        this.map = map

        // var lbeacon_1 = L.circleMarker(pos_1,{
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 1,
        //     radius: 10
        // }).addTo(map);

        // var lbeacon_2 = L.circleMarker(pos_2,{
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 1,
        //     radius: 10
        // }).addTo(map);

        // console.log(lbeacon_2.getLatLng())

        // lbeacon_1.on('click', this.handlemenu)

    }

    componentDidMount(){
        this.initMap();   
        this.getObjData(); 
    }

    getObjData(){
        axios.get(API).then(res => {
            console.log('Get data successfully ')
            // console.log(res.data.rows)
            let objectRows = res.data.rows;
            const hash = {}
            var customIcon = L.icon(customIconOptions)

            /** MarkerClusterGroup Syntax */
            // var markerClusters = L.markerClusterGroup({
            //     maxClusterRadius: 120,
            //     spiderfyOnMaxZoom: false,
            //     zoomToBoundsOnClick: false,
            //     showCoverageOnHover: true,
            //     singleMarkerMode: true,
            //     iconCreateFunction: function(cluster) {
            //         var clusterSize = "small";
            //         if (cluster.getChildCount() >= 10) {
            //             clusterSize = "medium";
            //         }
            //         return new L.DivIcon({
            //             html: '<div><span>' + cluster.getChildCount() + '</span></div>',
            //             className: 'custom-marker-cluster custom-marker-cluster' + clusterSize,
            //             iconSize: new L.Point(40, 40)
            //         });
            //     }
            // });

            objectRows.map(items =>{
                const lbeaconCoordinate = this.createCoordinate(items.lbeacon_uuid);
                const objCoordinate = this.macAddressToCoordinate(items.object_mac_address, lbeaconCoordinate);

                let obj = {
                    name: items.name,
                    mac_address: items.object_mac_address,
                    rssi: items.avg
                }

                let popupContent = `
                    <a href='#'>
                        <div class='contentBox'>
                            <div class='textBox'>
                                <div>
                                    <h2 className="mb-1">${items.name}</h2>
                                    <small>詳細資料</small>
                                </div>
                                <small></small>
                            </div> 
                            <div class='imgBox'>
                                <span className="pull-left ">
                                    <img src=${BOTLogo} width=${100} className="img-reponsive img-rounded" />
                                </span>
                            </div>
                        </div>
                    </a>
                `
                /** More Style sheet include in Surveillance.css */
                let customOptions = {
                    minWidth: '300',
                    maxHeight: '300',
                    className : 'customPopup',
                }
                
                if (!(lbeaconCoordinate in hash)){
                    hash[lbeaconCoordinate] = [obj]
                    let lbeacon = L.circleMarker(lbeaconCoordinate,{
                        color: 'rgba(0, 0, 0, 0)',
                        fillColor: 'rgba(235, 154, 79, 0.6)',
                        fillOpacity: 1,
                        radius: 15,
                    }).addTo(this.map);
                    let invisibleCircle = L.circleMarker(lbeaconCoordinate,{
                        color: 'rgba(0, 0, 0, 0)',
                        fillColor: 'rgba(0, 76, 238, 0.995)',
                        fillOpacity: 0,
                        radius: 100,
                    }).addTo(this.map);

                    invisibleCircle.on('click', this.handlemenu);
                }else{
                    hash[lbeaconCoordinate].push(obj)
                };

                const marker = L.marker(objCoordinate, {icon: customIcon}).bindPopup(popupContent, customOptions).addTo(this.map);

                marker.on('mouseover', function () {
                    this.openPopup();
                });
                // marker.on('mouseout', function () {
                //     this.closePopup()
                // });


                
                // markerClusters.addLayer(L.marker(lbeaconCoordinate));

            })
            // this.map.addLayer(markerClusters);
            // markerClusters.on('clusterclick', this.handlemenu)
            this.setState({
                data: res.data.rows,
                lbeaconInfo: hash,
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    createCoordinate(lbeacon_uuid){
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(16,18) + 0) * 2;
        const yy = parseInt(lbeacon_uuid.slice(-3, -1) + 0) * 2;
        return [yy, xx];
    }

    macAddressToCoordinate(mac_address, lbeacon_coordinate){
        const xx = mac_address.slice(15,16);
        const yy = mac_address.slice(16,17);
        const xSign = parseInt(mac_address.slice(12,13), 16) % 2 == 1 ? 1 : -1 ;
        const ySign = parseInt(mac_address.slice(13,14), 16) % 2 == 1 ? 1 : -1 ;

        const xxx = lbeacon_coordinate[0] + xSign * parseInt(xx, 16) * 5;
        const yyy = lbeacon_coordinate[1] + ySign * parseInt(yy, 16) * 5;
       return [yyy, xxx];
    }

    render(){
        return(
            <div>
                <h2>{PAGENAME}</h2>
                {console.log('reader!')}
                {/* {console.log(this.state.lbeaconInfo)} */}

                {/* <table>
                    <tbody>
                        <tr>
                            <th>time</th>
                            <th>object_mac_address</th>
                            <th>lbeacon_uuid</th> 
                            <th>rssi</th>
                        </tr>
                        {this.state.data.map(items => {
                            return (
                                <tr>
                                    <td>{items.thirty_seconds}</td>
                                    <td>{items.object_mac_address}</td>
                                    <td>{items.lbeacon_uuid}</td>
                                    <td>{items.avg}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> */}
                <div id='mapid'></div>
             </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateMenu: value => dispatch(updateMenuOption(value)),
        showObjectList: array => dispatch(showObjectList(array)),
    }
}

export default connect(null, mapDispatchToProps)(Surveillance)
