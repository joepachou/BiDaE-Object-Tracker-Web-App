/** Import React */
import React from 'react';

/** Import leaflet.js */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/** Import leaflet.markercluser library */
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../../../css/CustomMarkerCluster.css'
import '../../leaflet_awesome_number_markers';

/** Redux related Library  */
import { 
    isObjectListShown,
    selectObjectList,
} from '../../action/action';
import { connect } from 'react-redux';
import LocaleContext from '../../context/LocaleContext';
import config from '../../config';
import _ from 'lodash'

let popupOptions = {
    minWidth: '400',
    maxHeight: '300',
    className : 'customPopup',
}

class Surveillance extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            lbeaconsPosition: null,
            objectInfo: [],
            hasErrorCircle: false,
            hasInvisibleCircle: false,       
        }
        this.map = null;
        this.markersLayer = L.layerGroup();
        this.errorCircle = L.layerGroup();
        this.popupContent = this.popupContent.bind(this);

        this.handlemenu = this.handlemenu.bind(this);
        this.handleObjectMarkers = this.handleObjectMarkers.bind(this);
        this.createLbeaconMarkers = this.createLbeaconMarkers.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);

        this.resizeMarkers = this.resizeMarkers.bind(this);
        this.calculateScale = this.calculateScale.bind(this);

        this.StartSetInterval = config.surveillanceMap.startInteval; 
        this.isShownTrackingData = !true;
    }

    componentDidMount(){
        this.initMap();  
        this.handleObjectMarkers();
    }

    componentDidUpdate(prevProps){
        this.handleObjectMarkers();
        this.createLbeaconMarkers();
    }

    shouldComponentUpdate(nextProps, nextState){
        let isProccessedTrackingDataChange = !(_.isEqual(this.props.proccessedTrackingData, nextProps.proccessedTrackingData))
        return this.props.shouldTrackingDataUpdate && isProccessedTrackingDataChange
    }

    
    /** Set the search map configuration which establishs in config.js  */
    initMap(){
        let map = L.map('mapid', config.surveillanceMap.mapOptions);
        
        let bounds = config.surveillanceMap.mapBound;
        let image = L.imageOverlay(config.surveillanceMap.map, bounds).addTo(map);
        map.fitBounds(bounds);
        this.map = map;

        /** Set the map's events */
        this.map.on('zoomend', this.resizeMarkers)
    }

    /** Resize the markers and errorCircles when the view is zoomend. */
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

    /** Calculate the current scale for creating markers and resizing. */
    calculateScale() {
        this.currentZoom = this.map.getZoom();
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = this.zoomDiff * 30;
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        this.scalableIconSize = config.surveillanceMap.iconOptions.iconSize + this.resizeConst
    }

    /** Create the lbeacon and invisibleCircle markers */
    createLbeaconMarkers(){

        /** Creat the marker of all lbeacons onto the map  */
        let lbeaconsPosition = this.state.lbeaconsPosition !== null ? Array.from(this.state.lbeaconsPosition) :[];
        lbeaconsPosition.map(items => {
            let lbLatLng = items.split(",")
            let lbeacon = L.circleMarker(lbLatLng,{
                color: 'rgba(0, 0, 0, 0)',
                fillColor: 'yellow',
                fillOpacity: 0.5,
                radius: 15,
            }).addTo(this.map);

        /** Creat the invisible Circle marker of all lbeacons onto the map */
            let invisibleCircle = L.circleMarker(lbLatLng,{
                color: 'rgba(0, 0, 0, 0',
                fillColor: 'rgba(0, 76, 238, 0.995)',
                fillOpacity: 0,
                radius: 60,
            }).addTo(this.map);

            invisibleCircle.on('mouseover', this.handlemenu)
            invisibleCircle.on('mouseout', function() {this.closePopup();})
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
        if (objectList.length !== 0) {
            const popupContent = this.popupContent(objectList)
            e.target.bindPopup(popupContent, popupOptions).openPopup();
        }

        this.props.isObjectListShownProp(true);
        this.props.selectObjectListProp(objectList);
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
    handleObjectMarkers(){
        let objects = _.cloneDeep(this.props.proccessedTrackingData)        

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
        
        /** Icon options for AwesomeNumberMarkers 
         * The process: 
         * 1. Add the declaration of the desired icon option
         * 2. Add the CSS description in leafletMarker.css
        */
        const stationaryAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.stationary,
        }

        const geofencePAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.geofenceP,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const geofenceFAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.geofenceF,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const searchedObjectAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.searched,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const sosIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.sos,
        };

        const unNormalIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.unNormal,
        };

        let counter = 0;
        objects.filter(item => item.found)
            .map(item => {

            // let detectedNum = item.lbeaconDetectedNum;
            let position = this.macAddressToCoordinate(item.mac_address,item.currentPosition);
            /** 
             * Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Surveillance.css
            */
            let popupContent = this.popupContent([item])
            /**
             * Create the marker, if the status of the object is not normal, 
             * then the color will be black, or grey.
             */
            let iconOption = {}
            if (item.panic) {
                iconOption = sosIconOptions;
            } else if (item.geofence_type === config.objectStatus.FENCE){
                iconOption = geofenceFAweIconOptions;
			} else if (item.geofence_type === config.objectStatus.PERIMETER){
                iconOption = geofencePAweIconOptions;
			} else if (item.searched && this.props.colorPanel) {
                iconOption = { markerColor:item.pinColor }
            } else if (item.searched) {
                iconOption = searchedObjectAweIconOptions    
            } else if (item.status !== config.objectStatus.NORMAL) {
                iconOption = unNormalIconOptions;
            } else {
                iconOption = stationaryAweIconOptions;
            }

            /** Show the order number on location pin if necessary */
            if (item.searched && config.surveillanceMap.iconOptions.showNumber) {
                iconOption = {
                    ...iconOption,
                    number: ++counter
                }
            }

            /** Insert the object's mac_address to be the data when clicking the object's marker */
            iconOption = {
                ...iconOption,
                macAddress:item.mac_address,
                currentPosition:item.currentPosition
            }

            const option = new L.AwesomeNumberMarkers (iconOption)
            let marker =  L.marker(position, {icon: option}).bindPopup(popupContent, popupOptions).addTo(this.markersLayer)

            /** 
             * Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others 
             */
            if (item.searched) marker.setZIndexOffset(1000);
        
            /** Set the marker's event. */
            marker.on('mouseover', function () { this.openPopup(); })
            marker.on('click', this.handleMarkerClick);
            marker.on('mouseout', function () { this.closePopup(); })
            

            /** Set the error circles of the markers. */
            // if (detectedNum > 1 &&item.moving_status === 'stationary') {
            //     let errorCircle = L.circleMarker(position ,errorCircleOptions).addTo(this.errorCircle);
            // }
        })

        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);

        if (!this.state.hasErrorCircle) {
            this.setState({
                hasErrorCircle: true,
            })
        }
    }

    handleMarkerClick(e) {
        const lbPosition =  e.target.options.icon.options.currentPosition
        this.props.getSearchKey('coordinate', null, lbPosition)
    }

    collectObjectsByLatLng(lbPosition) {
        let objectList = []
        this.props.proccessedTrackingData.map(item => {
            item.currentPosition && item.currentPosition.toString() === lbPosition.toString() ? objectList.push(item) : null;
        })
        return objectList 
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
        const xx = mac_address.slice(12,14);
        const yy = mac_address.slice(15,17);
        const multiplier = config.surveillanceMap.markerDispersity; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(80, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(80, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
        const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
        
    }

    /**
     * The html content of popup of markers.
     * @param {*} object The fields in object will present if only the field is add into objectInfoHash in handleTrackingData method
     * @param {*} objectImg  The image of the object.
     * @param {*} imgWidth The width of the image.
     */
    popupContent (objectsMap){
        let currentPosition = objectsMap[0].currentPosition
        let objectList = this.collectObjectsByLatLng(currentPosition)
        /* The style sheet is right in the src/css/Surveillance.css*/
        const locale = this.context

        const content = 
            `
                <div>
                    <h4 class='border-bottom pb-1 px-2'>${objectsMap[0].location_description}</h4>
                    ${objectList.filter(item => item.found).map( item =>{
                        const element =     
                            `
                                <div class='row popupRow mb-2 ml-1'>
                                    <div class='col-6 popupType d-flex align-items-center'>${item.type}</div>
                                    <div class='col-3 popupItem d-flex align-items-center'>${item.access_control_number && item.access_control_number.slice(10, 14)}</div>
                                    <div class='col-3 popupItem d-flex align-items-center text-capitalize'>${item.geofence_type || item.status}</div>
                                </div>
                            `
                                return element
                        }).join('')
                    }
                </div>
            `
        return content
    }

    render(){
        return(   
            <div id='mapid'>
            </div>
        )
    }
}

Surveillance.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        isObjectListShownProp: value => dispatch(isObjectListShown(value)),
        selectObjectListProp: array => dispatch(selectObjectList(array)),
    }
}

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Surveillance)

