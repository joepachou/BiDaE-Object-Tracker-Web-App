/** Import React */
import React from 'react';

/** Import survelliance general map  */
import BOTLogo from '../../../img/BOTLogo.png'
import IIS_Newbuilding_4F from '../../../img/IIS_Newbuilding_4F.png'

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
import dataAPI from '../../../js/dataAPI';

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
            lbeaconsPosition: null,
            objectInfo: {},
            hasErrorCircle: false,
            hasInvisibleCircle: false,            
        }
        this.map = null;
        this.popupContent = popupContent;
        this.customIcon = L.icon(customIconOptions);

        this.handlemenu = this.handlemenu.bind(this);
        this.handleTrackingData = this.handleTrackingData.bind(this);
        this.handleObjectMakers = this.handleObjectMakers.bind(this)
        this.createLbeaconMarkers = this.createLbeaconMarkers.bind(this)
        this.markersLayer = L.layerGroup();
        this.StartSetInterval = true;
    }

    componentDidMount(){
        this.initMap();  
        this.handleTrackingData(); 
        this.interval = this.StartSetInterval == true ? setInterval(this.handleTrackingData, 3000) : null;
    }

    componentDidUpdate(){
        this.handleObjectMakers();
        this.createLbeaconMarkers();
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    initMap(){
        let map = L.map('mapid', mapOptions);
        let bounds = [[0,0], [21130,35710]];
        let image = L.imageOverlay(IIS_Newbuilding_4F, bounds).addTo(map);
        map.fitBounds(bounds);
        this.map = map;
    }

    createLbeaconMarkers(){
        /** 
         * Creat the marker of all lbeacons onto the map 
         */
        let lbeaconsPosition = Array.from(this.state.lbeaconsPosition)
        lbeaconsPosition.map(items => {
            let lbLatLng = items.split(",")
            // let lbeacon = L.circleMarker(lbLatLng,{
            //     color: 'rgba(0, 0, 0, 0)',
            //     fillColor: 'yellow',
            //     fillOpacity: 0.5,
            //     radius: 15,
            // }).addTo(this.map);

        /** 
         * Creat the invisible Circle marker of all lbeacons onto the map 
         */
            let invisibleCircle = L.circleMarker(lbLatLng,{
                color: 'rgba(0, 0, 0, 0)',
                fillColor: 'rgba(0, 76, 238, 0.995)',
                fillOpacity: 0,
                radius: 80,
            }).addTo(this.map);

            invisibleCircle.on('click', this.handlemenu);
        })
        if (!this.state.hasInvisibleCircle){
            this.setState({
                hasInvisibleCircle: true,
            })
        }
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

    /**
     * Retrieve tracking data from database, then reconstruct the data to desired form.
     */

    handleTrackingData(){
        axios.get(dataAPI.trackingData).then(res => {
            // console.log('Get data successfully ')
            // console.log(res.data.rows)
            let objectRows = res.data.rows;
            let lbsPosition = new Set(),
                objectInfoHash = {}
            
            objectRows.map(items =>{
                /**
                 * Every lbeacons coordinate sended by response will store in lbsPosition
                 * Update(3/14): use Set instead.
                 */
                const lbeaconCoordinate = this.createLbeaconCoordinate(items.lbeacon_uuid);
                lbsPosition.add(lbeaconCoordinate.toString());
                
                let object = {
                    lbeaconCoordinate: lbeaconCoordinate,
                    rssi: items.avg,
                }

                /**
                 * If the object's mac_address has not scanned by one lbeacon yet{
                 *     the object is going to store in objectInfoHash
                 * } else the object's mac_address is already in objectInfoHash {
                 *     if (maxRSSI < newRSSI) {
                 *         maxRSSI = newRSSI
                 *         currentPosition = newCoordinate
                 *     }
                 * }
                 */

                if (!(items.object_mac_address in objectInfoHash)) {
                    objectInfoHash[items.object_mac_address] = {};
                    objectInfoHash[items.object_mac_address].lbeaconDetectedNum = 1
                    objectInfoHash[items.object_mac_address].maxRSSI = items.avg
                    objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate
                    objectInfoHash[items.object_mac_address].overlapLbeacon = {}
                    objectInfoHash[items.object_mac_address].name = items.name
                    objectInfoHash[items.object_mac_address].mac_address = items.object_mac_address
                    objectInfoHash[items.object_mac_address].overlapLbeacon[lbeaconCoordinate] = object
                } else {
                    let maxRSSI = objectInfoHash[items.object_mac_address].maxRSSI;

                    /** if the RSSI scanned by the second lbeacon is larger than previous one:
                     * current position = new lbeacon location
                     * max rssi = new lbeacon rssi
                     */

                    // compare two lbeacon's RSSI
                    // Mark the object on the lbeacon that has bigger RSSI
                    
                    if (items.avg < maxRSSI) {
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].overlapLbeacon[lbeaconCoordinate] = object;
                    }
                    objectInfoHash[items.object_mac_address].lbeaconDetectedNum = Object.keys(objectInfoHash[items.object_mac_address].overlapLbeacon).length;
                    // objectInfoHash[items.object_mac_address].overlapLbeacon.push(object);

                }

                // markerClusters.addLayer(L.marker(lbeaconCoordinate));
            })
            // this.map.addLayer(markerClusters);
            // markerClusters.on('clusterclick', this.handlemenu)

            /**
             * Return Tracking data to caller
             */
            this.props.retrieveTrackingData(res.data)

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

            /** Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Surveillance.css
            */
            let popupContent = this.popupContent(objects[key].name, BOTLogo, 100)
            let popupCustomStyle = {
                minWidth: '300',
                maxHeight: '300',
                className : 'customPopup',
            }
            let marker = L.marker(position, {icon: this.customIcon}).bindPopup(popupContent, popupCustomStyle).addTo(this.markersLayer);
            
            /** Set Marker Event */
            marker.on('mouseover', function () { this.openPopup(); })
            marker.on('mouseout', function () { this.closePopup(); })


            /** Set the error circles */
            if (detectedNum > 1) {
                let errorCircle = L.circleMarker([position[0], position[1]],{
                    color: 'rgb(0,0,0,0)',
                    fillColor: 'orange',
                    fillOpacity: 0.5,
                    radius: 40,
                }).addTo(this.markersLayer);
            }
        
        }

        /** Add the new markerslayer to the map */
        this.markersLayer.addTo(this.map);

        if (!this.state.hasErrorCircle) {
            this.setState({
                hasErrorCircle: true,
            })
        }
    }

    createLbeaconCoordinate(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx];
    }

    macAddressToCoordinate(mac_address, lbeacon_coordinate){
        /** Example of lbeacon_uuid: 01:1f:2d:13:5e:33 
         *                           0123456789       16
         */
 
        // const xx = mac_address.slice(15,16);
        // const yy = mac_address.slice(16,17);
        // const xSign = parseInt(mac_address.slice(9,10), 16) % 2 == 1 ? 1 : -1 ;
        // const ySign = parseInt(mac_address.slice(10,11), 16) % 2 == 1 ? 1 : -1 ;

        // const xxx = lbeacon_coordinate[1] + xSign * parseInt(xx, 16) * 12;
        // const yyy = lbeacon_coordinate[0] + ySign * parseInt(yy, 16) * 12;

        const xx = mac_address.slice(12,14);
        const yy = mac_address.slice(15,17);
		
		const multiplier = 3; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(80, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(80, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
		const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
        
    }

    render(){
        return(
            <div id='mapid' className='cmp-block'>
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

