import React from 'react';

/** Import leaflet.js */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../../../css/CustomMarkerCluster.css'
import '../../helper/leaflet_awesome_number_markers';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc'


class Map extends React.Component {
    

    static contextType = AppContext

    state = {
        lbeaconsPosition: null,
        objectInfo: [],
        hasErrorCircle: false,
        hasInvisibleCircle: false,       
        hasIniLbeaconPosition: false,
        hasGeoFenceMaker: false
    }
    map = null;
    image = null;
    markersLayer = L.layerGroup();
    errorCircle = L.layerGroup();
    lbeaconsPosition = L.layerGroup();
    geoFenceLayer = L.layerGroup()

    componentDidMount = () => {
        this.initMap();  
    }

    componentDidUpdate = (prevProps) => {
        this.handleObjectMarkers();
        // if (this.props.lbeaconPosition.length !== 0 && !this.state.hasIniLbeaconPosition && this.props.isOpenFence) {
        //     this.createLbeaconMarkers()
        // }

        if (this.props.geoFenceConfig.length !== 0 && !this.state.hasGeoFenceMaker && this.props.isOpenFence) {
            this.createGeoFenceMarkers()
        }

        if (prevProps.areaId !== this.props.areaId) { 
            this.setMap()
        }

        // if (this.state.hasIniLbeaconPosition && (prevProps.isOpenFence !== this.props.isOpenFence)) {
        //     this.props.isOpenFence ? this.createLbeaconMarkers() : this.lbeaconsPosition.clearLayers()
        // }

        if (this.state.hasGeoFenceMaker && (prevProps.isOpenFence !== this.props.isOpenFence)) {
            this.props.isOpenFence ? this.createGeoFenceMarkers() : this.geoFenceLayer.clearLayers()
        }
    }

    /** Set the search map configuration establishing in config.js  */
    initMap = () => {
        let [{areaId}] = this.context.stateReducer
        let { 
            areaModules,
            areaOptions,
            defaultAreaId,
            mapOptions
        } = this.props.mapConfig

        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        let { url, bounds } = areaModules[areaOption]
        let map = L.map('mapid', mapOptions);
        let image = L.imageOverlay(url, bounds).addTo(map);
        map.addLayer(image)
        map.fitBounds(bounds);

        this.image = image
        this.map = map;

        /** Set the map's events */
        this.map.on('zoomend', this.resizeMarkers)
    }

    /** Resize the markers and errorCircles when the view is zoomend. */
    resizeMarkers = () => {
        this.calculateScale();
        this.markersLayer.eachLayer( marker => {
            let icon = marker.options.icon;
            icon.options.iconSize = [this.scalableIconSize, this.scalableIconSize]
            icon.options.numberSize = this.scalableNumberSize
            marker.setIcon(icon);
        })

        this.errorCircle.eachLayer( circle => {
            circle.setRadius(this.scalableErrorCircleRadius)
        })
    }

    /** Set the overlay image */
    setMap = () => {
        let [{areaId}] = this.context.stateReducer

        let { 
            areaModules,
            areaOptions,
            defaultAreaId,
            mapOptions
        } = this.props.mapConfig

        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        let { url, bounds } = areaModules[areaOption]
        this.image.setUrl(url)
        this.image.setBounds(bounds)
        this.map.fitBounds(bounds)        

        this.createGeoFenceMarkers()
    }

    /** Calculate the current scale for creating markers and resizing. */
    calculateScale = () => {
        this.currentZoom = this.map.getZoom();
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = Math.floor(this.zoomDiff * 30);
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        this.scalableIconSize = this.props.mapConfig.iconOptions.iconSize + this.resizeConst
        this.scalableNumberSize = Math.floor(this.scalableIconSize / 3);
    }

    /** Create the lbeacon and invisibleCircle markers */
    createGeoFenceMarkers = () => {     

        this.geoFenceLayer.clearLayers()


        // console.log('create geofence marker')
        let { stateReducer } = this.context
        let [{areaId}] = stateReducer

        let {
            geoFenceConfig,
            mapConfig
        } = this.props
        
        /** Creat the marker of all lbeacons onto the map  */
        axios.post(dataSrc.getGeoFenceConfig, {
            areaId
        })
        .then(res => {
            res.data.rows.filter(item => {
                return parseInt(item.unique_key) == areaId && item.enable == 1
            }).map(item => {
                item.fences.uuids.map(uuid => {
                    let latLng = uuid.slice(1, 3)
                    let fences = L.circleMarker(latLng, mapConfig.geoFenceMarkerOption).addTo(this.geoFenceLayer);
                })
    
                item.perimeters.uuids.map(uuid => {
                    let latLng = uuid.slice(1, 3)
                    let perimeters = L.circleMarker(latLng, mapConfig.geoFenceMarkerOption).addTo(this.geoFenceLayer);
                })
            })
        })
        .catch(err => {
            console.log(`get geo fence data fail: ${err}`)
        })
        
        /** Add the new markerslayers to the map */
        this.geoFenceLayer.addTo(this.map);

        if (!this.state.hasGeoFenceMaker){
            this.setState({
                hasGeoFenceMaker: true,
            })
        }
    }

    /** Create the lbeacon and invisibleCircle markers */
    createLbeaconMarkers = () => {

        let {
            lbeaconPosition,
            mapConfig,
        } = this.props

        /** Creat the marker of all lbeacons onto the map  */
        lbeaconPosition.map(pos => {
            let latLng = pos.split(',')
            let lbeacon = L.circleMarker(latLng, mapConfig.lbeaconMarkerOption).addTo(this.lbeaconsPosition);

        /** Creat the invisible Circle marker of all lbeacons onto the map */
            // let invisibleCircle = L.circleMarker(pos,{
            //     color: 'rgba(0, 0, 0, 0',
            //     fillColor: 'rgba(0, 76, 238, 0.995)',
            //     fillOpacity: 0,
            //     radius: 60,
            // }).addTo(this.map);

            // invisibleCircle.on('mouseover', this.handlemenu)
            // invisibleCircle.on('mouseout', function() {this.closePopup();})
        })

        /** Add the new markerslayers to the map */
        this.lbeaconsPosition.addTo(this.map);

        if (!this.state.hasIniLbeaconPosition){
            this.setState({
                hasIniLbeaconPosition: true,
            })
        }
    }
    /**
     * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
     * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
     * @param e the object content of the mouse clicking. 
     */
    handlemenu = (e) => {

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
            e.target.bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
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
    handleObjectMarkers = () => {
        let { locale } = this.context

        /** Clear the old markerslayers. */
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();

        /** Mark the objects onto the map  */
        this.calculateScale();

        const iconSize = [this.scalableIconSize, this.scalableIconSize];
        const numberSize = this.scalableNumberSize;
        let counter = 0;
        
        this.filterTrackingData(_.cloneDeep(this.props.proccessedTrackingData))
        .map(item => {

            let position = this.macAddressToCoordinate(item.mac_address,item.currentPosition);

            /** Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Map.css */
            let popupContent = this.props.mapConfig.getPopupContent([item], this.collectObjectsByLatLng(item.currentPosition), locale)

            /** Set the icon option*/
            item.iconOption = {

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColor(item, this.props.colorPanel),

                /** Set the pin size */
                iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,
                currentPosition: item.currentPosition,

                /** Show the ordered on location pin */
                number: this.props.mapConfig.iconOptions.showNumber && 
                        // this.props.mapConfig.isObjectShowNumber.includes(item.searchedObjectType) && 
                        item.searched 
                        ? ++counter 
                        : '',

                /** Set the color of ordered number */
                numberColor: this.props.mapConfig.iconColor.number,

                numberSize,
            }

            const option = new L.AwesomeNumberMarkers (item.iconOption)
            let marker =  L.marker(position, {icon: option}).bindPopup(popupContent, this.props.mapConfig.popupOptions).addTo(this.markersLayer)

            /** Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others */
            if (item.searched) marker.setZIndexOffset(1000);
        
            /** Set the marker's event. */
            marker.on('mouseover', function () { this.openPopup(); })
            marker.on('click', this.handleMarkerClick);
            // marker.on('mouseout', function () { this.closePopup(); })

        })
        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);

        // if (!this.state.hasErrorCircle) {
        //     this.setState({
        //         hasErrorCircle: true,
        //     })
        // }
    }

    /** Fire when clicing marker */
    handleMarkerClick = (e) => {
        const lbPosition =  e.target.options.icon.options.currentPosition
        this.props.getSearchKey('objects', null, lbPosition)
    }

    /** Filter out undesired tracking data */
    filterTrackingData = (proccessedTrackingData) => {
        return proccessedTrackingData.filter(item => {
            return (
                item.found && 
                item.isMatchedObject && 
                (   this.props.searchedObjectType.includes(parseInt(item.object_type)) ||
                    this.props.searchedObjectType.includes(parseInt(item.searchedType))
                )
            )
        })
    }

    collectObjectsByLatLng = (lbPosition) => {
        let objectList = []
        this.filterTrackingData(this.props.proccessedTrackingData)
        .map(item => {
            item.currentPosition && item.currentPosition.toString() === lbPosition.toString() && item.isMatchedObject ? objectList.push(item) : null;
        })
        return objectList 
    }

    /** Retrieve the object's offset from object's mac_address.
     * @param   mac_address The mac_address of the object retrieved from DB. 
     * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
    macAddressToCoordinate = (mac_address, lbeacon_coordinate) => {

        /** Example of lbeacon_uuid: 01:1f:2d:13:5e:33 
         *                           0123456789       16
         */
        const xx = mac_address.slice(12,14);
        const yy = mac_address.slice(15,17);
        const multiplier = this.props.mapConfig.markerDispersity; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(80, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(80, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
        const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
    }

    render(){
        return(   
            <div id='mapid' style={{}}/>
        )
    }
}

export default Map;

