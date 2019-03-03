/** Import React */
import React from 'react';

/** Import survelliance general map  */
import SMap from '../../../img/surveillanceMap.png'
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

import { mapOptions, customIconOptions, popupContent } from '../../customOption';

/** API url */
const API = 'http://localhost:3000/users';

/** Redux related Library  */
import { 
    isObjectListShown,
    selectObjectList,
} from '../../action/action';

import { connect } from 'react-redux';

class Surveillance extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: [],
            lbeaconsPosition: [],
            lbeaconInfo: {},
            objectInfo: {},
            hasErrorCircle: false,
        }
        this.map = null;
        this.popupContent = popupContent;
        this.customIcon = L.icon(customIconOptions);

        this.handlemenu = this.handlemenu.bind(this);
        this.getObjData = this.getObjData.bind(this);
        this.handleObjectMakers = this.handleObjectMakers.bind(this)
        this.markersLayer = L.layerGroup();


    }

    componentDidMount(){
        this.initMap();   
        this.getObjData();
        this.interval = setInterval(this.getObjData, 3000);
    }

    componentDidUpdate(){
        this.handleObjectMakers();
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    initMap(){
        let map = L.map('mapid', mapOptions);
        let bounds = [[0,0], [900,900]];
        let image = L.imageOverlay(SMap, bounds).addTo(map);
        map.fitBounds(bounds);
        this.map = map;
    }

    handlemenu(e){
        const { objectInfo } = this.state
        const lbeacon_coorinate = Object.values(e.target._latlng).toString();
        let objectList = [], key;
        for (key in objectInfo) {
            if (objectInfo[key].currentPosition.toString() == lbeacon_coorinate) {
                objectList.push(objectInfo[key])
            }
        }
        this.props.isObjectListShownProp(true);
        this.props.selectObjectListProp(objectList);
    }

    getObjData(){
        axios.get(API).then(res => {
            // console.log('Get data successfully ')
            // console.log(res.data.rows)
            let objectRows = res.data.rows;
            let lbsPosition = [],
                objectInfoHash = {}

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

                if (lbsPosition.indexOf(lbeaconCoordinate.toString()) < 0){
                    lbsPosition.push(lbeaconCoordinate.toString());
                }

                let object = {
                    lbeaconCoordinate: lbeaconCoordinate,
                    rssi: items.avg,
                }

                if (!(items.object_mac_address in objectInfoHash)) {
                    objectInfoHash[items.object_mac_address] = {
                        lbeaconDetectedNum: 1,
                        maxRSSI: items.avg,
                        currentPosition: lbeaconCoordinate,
                        overlapLbeacon: [object], 
                        name: items.name,
                    }
                } else {
                    let maxRSSI = objectInfoHash[items.object_mac_address].maxRSSI;

                    /** if the RSSI scanned by the second lbeacon or more larger than previous one:
                     * current position = new lbeacon location
                     * max rssi = new lbeacon rssi
                     */

                    // compare two lbeacon's RSSI
                    // Mark the object on the lbeacon that has bigger RSSI
                    
                    if (items.avg < maxRSSI) {
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                    }
                    objectInfoHash[items.object_mac_address].lbeaconDetectedNum += 1;
                    objectInfoHash[items.object_mac_address].overlapLbeacon.push(object);

                }

                // markerClusters.addLayer(L.marker(lbeaconCoordinate));

            })
            // this.map.addLayer(markerClusters);
            // markerClusters.on('clusterclick', this.handlemenu)
            this.setState({
                data: res.data.rows,
                lbeaconsPosition: lbsPosition,
                objectInfo: objectInfoHash,
                hasErrorCircle: false,
            })
        }).catch(function (error) {
            console.log(error);
        })
    }


    handleObjectMakers(){
        let objects = this.state.objectInfo

        /** Clear the old markerslayers */
        this.markersLayer.clearLayers();

        /** Mark the objects onto the map */
        for (var key in objects){

            let detectedNum = objects[key].lbeaconDetectedNum;
            let position = this.macAddressToCoordinate(key.toString(), objects[key].currentPosition);


            /** popupContetn (objectName, objectImg, objectImgWidth) */
            let popupContent = this.popupContent(objects[key].name, BOTLogo, 100)
            /** More Style sheet include in Surveillance.css */
            let popupCustomStyle = {
                minWidth: '300',
                maxHeight: '300',
                className : 'customPopup',
            }
            let marker = L.marker(position, {icon: this.customIcon}).bindPopup(popupContent, popupCustomStyle).addTo(this.markersLayer);

            /** Marker Event */
            marker.on('mouseover', function () {
                this.openPopup();
            }).on('mouseout', function () {
                this.closePopup()
            });

            if (detectedNum > 1) {
                let errorCircle = L.circleMarker(position,{
                    color: 'rgba(0, 0, 0, 0)',
                    fillColor: 'blue',
                    fillOpacity: 1,
                    radius: 6,
                }).addTo(this.markersLayer);
            }
        }

        /** Mark the lbeacons onto the map */
        this.state.lbeaconsPosition.map(items => {
            let lbLngLat = items.split(",")
            let lbeacon = L.circleMarker(lbLngLat,{
                color: 'rgba(0, 0, 0, 0)',
                fillColor: 'rgba(235, 154, 79, 0.6)',
                fillOpacity: 1,
                radius: 15,
            }).addTo(this.markersLayer);
            let invisibleCircle = L.circleMarker(lbLngLat,{
                color: 'rgba(0, 0, 0, 0)',
                fillColor: 'rgba(0, 76, 238, 0.995)',
                fillOpacity: 0,
                radius: 100,
            }).addTo(this.markersLayer);

            invisibleCircle.on('click', this.handlemenu);
        })

        /** Add the new markerslayer to the map */
        this.markersLayer.addTo(this.map);

        if (!this.state.hasErrorCircle) {
            this.setState({
                hasErrorCircle:true,
            })
        }
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
                {/* {console.log(this.state.lbeaconsPosition)} */}
                {/* {console.log('render!')} */}

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
        isObjectListShownProp: value => dispatch(isObjectListShown(value)),
        selectObjectListProp: array => dispatch(selectObjectList(array)),
    }
}

export default connect(null, mapDispatchToProps)(Surveillance)
