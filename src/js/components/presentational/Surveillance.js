/** Import React */
import React from 'react';

/** Import survelliance general map  */
import BOTLogo from '../../../img/BOTLogo.png';
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

/** API url */
import dataSrc from '../../../js/dataSrc';

/** Redux related Library  */
import { 
    isObjectListShown,
    selectObjectList,
} from '../../action/action';

import { connect } from 'react-redux';

import config from '../../config';

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
        this.markersLayer = L.layerGroup();
        this.errorCircle = L.layerGroup();
        this.popupContent = this.popupContent.bind(this);

        this.handlemenu = this.handlemenu.bind(this);
        this.handleTrackingData = this.handleTrackingData.bind(this);
        this.handleObjectMakers = this.handleObjectMakers.bind(this);
        this.createLbeaconMarkers = this.createLbeaconMarkers.bind(this);
        this.resizeMarkers = this.resizeMarkers.bind(this);
        this.calculateScale = this.calculateScale.bind(this);

        this.StartSetInterval = config.surveillanceMap.startInteval; 
        this.isShownTrackingData = !true;
    }

    componentDidMount(){
        this.initMap();  
        this.handleTrackingData(); 
        this.interval = this.StartSetInterval == true ? setInterval(this.handleTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentDidUpdate(){
        this.handleObjectMakers();
        this.createLbeaconMarkers();
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    

    initMap(){
        let map = L.map('mapid', config.surveillanceMap.mapOptions);
        let bounds = config.surveillanceMap.mapBound;
        let image = L.imageOverlay(config.surveillanceMap.map, bounds).addTo(map);
        map.fitBounds(bounds);
        this.map = map;

        /**
         * Set the map's events
         */
        this.map.on('zoomend', this.resizeMarkers)
    }

    /**
     * Resize the markers and errorCircles when the view is zoomend.
     */
    resizeMarkers(){
        this.calculateScale();
        this.markersLayer.eachLayer( marker => {
            let icon = marker.options.icon;
            icon.options.iconSize = [this.scalableIconSize, this.scalableIconSize]
            marker.setIcon(icon);
        })

        this.errorCircle.eachLayer( circle => {
            circle.setRadius(this.scalableErrorCircleRadius)
        })
    }

    /**
     * Calculate the current scale for creating markers and resizing.
     */
    calculateScale() {
        this.currentZoom = this.map.getZoom();
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = this.zoomDiff * 30;
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        this.scalableIconSize = config.surveillanceMap.iconOptions.iconSize + this.resizeConst
    }

    /**
     * Create the lbeacon and invisibleCircle markers
     */
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

    /**
     * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
     * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
     * @param e the object content of the mouse clicking. 
     */

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
        const { rssi } = this.props;
        axios.post(dataSrc.trackingData, {
            rssi: rssi
        }).then(res => {
            // console.log(res.data.rows)
            
            let objectRows = res.data.rows;
            let lbsPosition = new Set(),
                objectInfoHash = {}
            let counter = 0;

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
                    rssi_avg : items.avg_stable,
                }
                /**
                 * If the object has not scanned by one lbeacon yet, 
                 *  then the object is going to be append in objectInfoHash
                 * Else, the object is already in objectInfoHash, 
                 *  we will check if the object is stationary or moving first,
                 *  then check if the current RSSI is the largest.
                 */
                // var dt = new Date();
                if (!(items.object_mac_address in objectInfoHash)) {
                    
                    // console.log(dt.getSeconds() + ' ' + items.object_mac_address + ' Scanned by one lbeacon')
                    objectInfoHash[items.object_mac_address] = {};
                    objectInfoHash[items.object_mac_address].lbeaconDetectedNum = 1
                    objectInfoHash[items.object_mac_address].maxRSSI = items.avg
                    objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate
                    objectInfoHash[items.object_mac_address].coverLbeaconInfo = {}
                    objectInfoHash[items.object_mac_address].name = items.name
                    objectInfoHash[items.object_mac_address].mac_address = items.object_mac_address
                    objectInfoHash[items.object_mac_address].panic_button = items.panic_button;
					objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                    objectInfoHash[items.object_mac_address].coverLbeaconInfo[lbeaconCoordinate] = object
                    objectInfoHash[items.object_mac_address].status = items.avg_stable !== null ? 'stationary' : 'stationary';

                } else {
                    // console.log(dt.getSeconds() + ' ' + items.object_mac_address + ' Scanned by other lbeacon')
                    let maxRSSI = objectInfoHash[items.object_mac_address].maxRSSI;
                    let status = objectInfoHash[items.object_mac_address].status;
					let geofence_type = objectInfoHash[items.object_mac_address].geofence_type;
					
					if(items.panic_button){
						objectInfoHash[items.object_mac_address].panic_button = 1;
					}
					
                    if( parseFloat(items.avg) > parseFloat(maxRSSI)) {
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
						
						objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                    }
					
                    if (items.avg_stable !== null) {
                        /** 
                         * If the RSSI of one object scanned by the the other lbeacon is larger than the previous one, then
                         * current position = new lbeacon location
                         * max rssi = new lbeacon rssi
                         */
						 /*
                        if ((status === 'stationary' && parseFloat(items.avg) > parseFloat(maxRSSI))|| status === 'moving' ){
                            objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                            objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                            objectInfoHash[items.object_mac_address].status = 'stationary'
                        } 
						*/
                        
                    } else {
/*
                        if(status === 'moving' && parseFloat(items.avg) > parseFloat(maxRSSI)) {
                            objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                            objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                        }
*/						

                    }
/*
                    objectInfoHash[items.object_mac_address].coverLbeaconInfo[lbeaconCoordinate] = object;
*/
                }

                objectInfoHash[items.object_mac_address].lbeaconDetectedNum = Object.keys(objectInfoHash[items.object_mac_address].coverLbeaconInfo).length;
                // markerClusters.addLayer(L.marker(lbeaconCoordinate));
            })
            if (this.isShownTrackingData === true ) (console.log(objectInfoHash)); 
            // this.map.addLayer(markerClusters);
            // markerClusters.on('clusterclick', this.handlemenu)

            /** Return Tracking data to caller(ContentContainer.js) */
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

    /**
     * When handleTrackingData() is executed, handleObjectMarkes() will be called. That is, 
     * once the component is updated, handleObjectMarkers() will be executed.
     * Clear the old markersLayer.
     * Add the markers into this.markersLayer.
     * Create the markers' popup, and add into this.markersLayer.
     * Create the popup's event.
     * Create the error circle of markers, and add into this.markersLayer.
     */
    handleObjectMakers(){
        let objects = this.state.objectInfo

        /** Clear the old markerslayers. */
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();

        /** Mark the objects onto the map  */
        this.calculateScale();

        const errorCircleOptions = {
            color: 'rgb(0,0,0,0)',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: this.scalableErrorCircleRadius,
        }

        const iconSize = [this.scalableIconSize, this.scalableIconSize];

        const stationaryIconOptions = {
            iconSize: iconSize,
            iconUrl: config.surveillanceMap.iconOptions.stationaryIconUrl,
        }

        const movingIconOptions = {
            iconSize: iconSize,
            iconUrl: config.surveillanceMap.iconOptions.movinfIconUrl,
        }

        const sosIconOptions = {
            iconSize: iconSize,
            iconUrl: config.surveillanceMap.iconOptions.sosIconUrl,
        }
		
		 const geofenceFIconOptions = {
            iconSize: iconSize,
            iconUrl: config.surveillanceMap.iconOptions.geofenceIconFence,
        }
		
		 const geofencePIconOptions = {
            iconSize: iconSize,
            iconUrl: config.surveillanceMap.iconOptions.geofenceIconPerimeter,
        }

        for (var key in objects){
                
            let detectedNum = objects[key].lbeaconDetectedNum;
            let position = this.macAddressToCoordinate(key.toString(), objects[key].currentPosition);

            /** 
             * Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Surveillance.css
            */
            let popupContent = this.popupContent(objects[key].name, BOTLogo, 100)
            let popupCustomStyle = {
                minWidth: '300',
                maxHeight: '300',
                className : 'customPopup',
            }
            /**
             * Create the marker, if the 'status' of the object is 'stationary', 
             * then the color will be black, or grey.
             */
            let iconOption = {}
			if (objects[key].geofence_type === 'F'){
				iconOption = geofenceFIconOptions;
			} else if (objects[key].geofence_type === 'P'){
				iconOption = geofencePIconOptions;
			} else if (objects[key].panic_button === 1) {
                iconOption = sosIconOptions;
            } else if (objects[key].status === 'stationary') {
                iconOption = stationaryIconOptions;
            } else {
                iconOption = movingIconOptions;
            }
            let marker =  L.marker(position, {icon: L.icon(iconOption)}).bindPopup(popupContent, popupCustomStyle).addTo(this.markersLayer)
            
            /** Set the marker's event. */
            marker.on('mouseover', function () { this.openPopup(); })
            marker.on('mouseout', function () { this.closePopup(); })


            /** Set the error circles of the markers. */
            if (detectedNum > 1 && objects[key].status === 'stationary') {
                let errorCircle = L.circleMarker(position ,errorCircleOptions).addTo(this.errorCircle);
            }
        }

        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);

        if (!this.state.hasErrorCircle) {
            this.setState({
                hasErrorCircle: true,
            })
        }
    }

    /**
     * Retrieve the lbeacon's location coordinate from lbeacon_uuid.
     * @param   lbeacon_uuid The uuid of lbeacon retrieved from DB.
     */
    createLbeaconCoordinate(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx];
    }

    /**
     * Retrieve the object's offset from object's mac_address.
     * @param   mac_address The mac_address of the object retrieved from DB. 
     * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().
     */
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
		
		const multiplier = 2; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(80, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(80, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
		const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
        
    }

    /**
     * The html content of popup of markers.
     * @param {*} objectName The user friendly name of the object.
     * @param {*} objectImg  The image of the object.
     * @param {*} imgWidth The width of the image.
     */
    popupContent (objectName, objectImg, imgWidth){
        const content = 
            `
            <a href='#'>
                <div class='contentBox'>
                    <div class='textBox'>
                        <div>
                            <h2 className="mb-1">${objectName}</h2>
                            <small>詳細資料</small>
                        </div>
                        <small></small>
                    </div> 
                    <div class='imgBox'>
                        <span className="pull-left ">
                            <img src=${objectImg} width=${imgWidth} className="img-reponsive img-rounded" />
                        </span>
                    </div>
                </div>
            </a>
            `
        
        return content
    }

    render(){
        return(
            <div>      
                <div id='mapid' className='cmp-block'>
                {/* {console.log(this.state.objectInfo)} */}
                </div>
                {/* <div>
                    <ToggleSwitch title="Location Accuracy" options={toggleSwitchOptions}/>
                </div> */}


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

