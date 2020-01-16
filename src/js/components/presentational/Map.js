import React from 'react';

/** Import leaflet.js */
import L from 'leaflet';
import 'leaflet.markercluster';
import '../../helper/leaflet_awesome_number_markers';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import polylineDecorator from 'leaflet-polylinedecorator'
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isMobileOnly,
    isBrowser,
    isTablet
} from 'react-device-detect'
class Map extends React.Component {
    

    static contextType = AppContext

    state = {
        lbeaconsPosition: null,
        objectInfo: [],
        hasErrorCircle: false,
        hasInvisibleCircle: false,       
        hasIniLbeaconPosition: false,
        hasGeoFenceMaker: false,
        pathMacAddress: ''
    }
    map = null;
    image = null;
    pathOfDevice = L.layerGroup();
    markersLayer = L.layerGroup();
    errorCircle = L.layerGroup();
    lbeaconsPosition = L.layerGroup();
    geoFenceLayer = L.layerGroup()
    currentZoom = 0
    prevZoom = 0
    pin_shift_scale = [0, -150]

    componentDidMount = () => {
        this.initMap();
    }

    componentDidUpdate = (prevProps) => {
        this.handleObjectMarkers();
        //this.drawPolyline();

        this.drawPolyline();

        if (parseInt(process.env.IS_LBEACON_MARK) && this.props.lbeaconPosition.length !== 0 && !this.state.hasIniLbeaconPosition) {
            this.createLbeaconMarkers()
        }

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
        //console.log("initMap")
        let [{areaId}] = this.context.stateReducer
        let { 
            areaModules,
            areaOptions,
            defaultAreaId,
            mapOptions, 
        } = this.props.mapConfig

        if(isBrowser) {
            mapOptions.minZoom = -7
        }else if(isTablet) {
            mapOptions.minZoom = -7
        }else{
            mapOptions.minZoom = -8
        }
        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        let { url, bounds } = areaModules[areaOption]
        let map = L.map('mapid', mapOptions);
        let image = L.imageOverlay(url, bounds).addTo(map);
        map.addLayer(image)
        map.fitBounds(bounds);

        this.image = image
        this.map = map;
        this.originalZoom = this.map.getZoom()
        this.currentZoom = this.map.getZoom();
        this.prevZoom = this.map.getZoom();
        /** Set the map's events */
        this.map.on('zoomend', this.resizeMarkers)
    }
    /** init path */
    
    drawPolyline = () => {
        // console.log(this.props.pathMacAddress)
        // console.log("in")
        if(this.props.showPath){
            if(this.state.pathMacAddress === ''){
                let i=4;
                let numberOfData = 100; // data you want to draw on map
                let route = []
                for(i=numberOfData;i>=0;i--){
                    axios.post(dataSrc.getTrackingTableByMacAddress, {
                        object_mac_address : this.props.pathMacAddress,
                        i: i,
                        second: 10
                    })
                    .then(res => {
                        res.data.rows.map(item => {
                            //console.log(item.lbeacon_uuid)
                            let latLngY = item.lbeacon_uuid.slice( 17, 18)+item.lbeacon_uuid.slice( 19, 23)
                            let latLngX = item.lbeacon_uuid.slice( 31, 37)
                            //console.log(latLngX + "," + latLngY)
                            let latLng = [latLngX,latLngY]
                            let pos = this.macAddressToCoordinate(item.object_mac_address,latLng);
                            var marker = L.circleMarker(pos, {radius:3,color:'darkgray'});
                            this.pathOfDevice.addLayer(marker)
                            route.push(pos)
                        })

                        var polyline = L.polyline(route,{
                            color: 'black',
                            dashArray: '1,1'
                        })
                        var decorator = L.polylineDecorator( polyline, {
                            patterns: [
                                {
                                    offset: '100%',
                                    repeat: 0,
                                    symbol: L.Symbol.arrowHead({
                                        weight: 3,
                                        pixelSize: 10,
                                        polygon: false,
                                        pathOptions: {
                                            color: 'black',
                                            stroke:true
                                        }
                                    })
                                }
                            ]
                        })

                        //console.log(polyline)
                        //console.log(this.pathOfDevice)
                        this.pathOfDevice.addLayer(polyline)
                        this.pathOfDevice.addLayer(decorator)
                        this.pathOfDevice.addTo(this.map)
                    })
                    .catch(err => {
                        console.log(`get tracking table by mac address fail: ${err}`)
                    })
                }

                this.setState({
                    pathMacAddress: this.props.pathMacAddress
                })
            }
        }else{
            if(this.state.pathMacAddress !== ''){
                this.pathOfDevice.clearLayers()
                this.pathOfDevice.addTo(this.map)
                this.setState({
                    pathMacAddress: ''
                })
            }
        }
    }
    /** Resize the markers and errorCircles when the view is zoomend. */
    resizeMarkers = () => {
       //console.log("resizeMarker")
        this.prevZoom = this.currentZoom
        this.currentZoom = this.map.getZoom();
        this.calculateScale();
        this.markersLayer.eachLayer( marker => {
            let icon = marker.options.icon;

            icon.options.iconSize = [this.scalableIconSize, this.scalableIconSize]
            // icon.options.iconAnchor = [this.scalableIconAnchor, this.scalableIconAnchor]
            icon.options.numberSize = this.scalableNumberSize
            var pos = marker.getLatLng()
            // console.log(marker)
            // console.log(pos)
            marker.setLatLng([pos.lat - this.prevZoom * this.pin_shift_scale[0] + this.currentZoom* this.pin_shift_scale[0], pos.lng - this.pin_shift_scale[1]* this.prevZoom + this.currentZoom* this.pin_shift_scale[1]])
            marker.setIcon(icon);

            
        })

        this.errorCircle.eachLayer( circle => {
            circle.setRadius(this.scalableErrorCircleRadius)
        })
    }

    /** Set the overlay image */
    setMap = () => {
        //console.log("setMap")
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
        
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = Math.floor(this.zoomDiff * 30);
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        if(isBrowser)
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSize) + this.resizeConst
        else if(isTablet)
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSizeForTablet) + this.resizeConst
        else 
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSizeForMobile) + this.resizeConst
            // this.scalableIconAnchor = parseInt(this.props.mapConfig.iconOptions.iconSize) + this.resizeConst
        //console.log(this.props.mapConfig.iconOptions.iconSizeForMobile)
        //console.log(this.scalableIconSize)
        //console.log(this.props.mapConfig.iconOptions.iconSizeForTablet)
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
            //console.log(lbeaconPosition)
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
        //console.log("handleMenu")
        const { objectInfo } = this.state
        const lbeacon_coorinate = Object.values(e.target._latlng).toString();
        let objectList = [], key;
        for (key in objectInfo) {
            if (objectInfo[key].lbeacon_coordinate.toString() == lbeacon_coorinate) {
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
        //console.log("handle tracking data")
        let { locale } = this.context

        /** Clear the old markerslayers. */
        this.prevZoom = this.originalZoom;
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();

        /** Mark the objects onto the map  */
        this.calculateScale();

        const iconSize = [this.scalableIconSize, this.scalableIconSize];
        const numberSize = this.scalableNumberSize;
        let counter = 0;
        //console.log(this.props.proccessedTrackingData)
        this.filterTrackingData(_.cloneDeep(this.props.proccessedTrackingData))
        .map(item => {
            //console.log(item)
            //console.log('good')
            let position = this.macAddressToCoordinate(item.mac_address,item.currentPosition);
            
            /** Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Map.css */
            let popupContent = this.props.mapConfig.getPopupContent([item], this.collectObjectsByLatLng(item.lbeacon_coordinate), locale)
            
            /** Set the icon option*/
            item.iconOption = {

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColor(item, this.props.colorPanel),

                /** Set the pin size */
                iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,

                lbeacon_coordinate: item.lbeacon_coordinate,

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
            let marker =  L.marker(position, {icon: option}).bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
            var pos = marker.getLatLng()
            marker.setLatLng([pos.lat - this.prevZoom * this.pin_shift_scale[0] + this.currentZoom* this.pin_shift_scale[0], pos.lng - this.pin_shift_scale[1]* this.prevZoom + this.currentZoom* this.pin_shift_scale[1]])
            marker.addTo(this.markersLayer)

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
        //console.log("handle marker click")
        const lbPosition =  e.target.options.icon.options.lbeacon_coordinate
        this.props.getSearchKey('objects', null, lbPosition, )
    }

    /** Filter out undesired tracking data */
    filterTrackingData = (proccessedTrackingData) => {
        //console.log(proccessedTrackingData)
        if(isMobileOnly){
            return proccessedTrackingData.filter(item => {
                return (
                    item.found && 
                    item.isMatchedObject
                )
            })
        }else{
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
    }

    collectObjectsByLatLng = (lbPosition) => {
        let objectList = []
        this.filterTrackingData(this.props.proccessedTrackingData)
        .map(item => {
            item.lbeacon_coordinate && item.lbeacon_coordinate.toString() === lbPosition.toString() && item.isMatchedObject ? objectList.push(item) : null;
        })

        return objectList 
    }

    /** Retrieve the object's offset from object's mac_address.
     * @param   mac_address The mac_address of the object retrieved from DB. 
     * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
    macAddressToCoordinate = (mac_address, lbeacon_coordinate) => {
        //console.log("mac")
        /** Example of lbeacon_uuid: 01:1f:2d:13:5e:33 
         *                           0123456789       16
         */
        // const xx = mac_address.slice(12,14);
        const xx = mac_address.slice(15,16);

        // const yy = mac_address.slice(15,17);
        const yy = mac_address.slice(16,17);

        const multiplier = this.props.mapConfig.markerDispersity; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(8, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(8, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
        const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
    }
    
    render(){
        return(
            <div>
                <BrowserView>   
                    <div id='mapid' style={{height:'75vh'}}></div>
                </BrowserView>
                <TabletView>
                    <div id='mapid' style={{height:'40vh'}}></div>
                </TabletView>
                <MobileOnlyView>
                    <div id='mapid' style={{height: '28vh'}}></div>
                </MobileOnlyView>
            </div>
        )
    }
}

export default Map;

