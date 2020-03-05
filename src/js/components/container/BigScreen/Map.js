import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet.markercluster';
import '../../../helper/leafletAwesomeNumberMarkers';
import _ from 'lodash'
import { AppContext } from '../../../context/AppContext';
import  pinImage from "./pinImage"

class Map extends React.Component {
    

    static contextType = AppContext

    state = {
        objectInfo: [],
    }

    map = null;
    image = null;
    iconOptions = {};
    markersLayer = L.layerGroup();

    componentDidMount = () => {
        this.initMap();  
        this.setMap();
    }

    componentDidUpdate = (prevProps) => {
        this.handleObjectMarkers();

        if (prevProps.areaId !== this.props.areaId) { 
            this.setMap()
        }
    }

    /** Set the search map configuration establishing in config.js  */
    initMap = () => {
        let [{areaId}] = this.context.stateReducer

        this.iconOptions = this.props.mapConfig.iconOptionsInBigScreen

        let areaModules =  this.props.mapConfig.areaModules
        let areaOption = this.props.mapConfig.areaOptions[areaId]    
        let { url, bounds } = areaModules[areaOption]

        let map = L.map('mapid', this.props.mapConfig.bigScreenMapOptions);
        let image = L.imageOverlay(url, bounds).addTo(map);
        map.addLayer(image)
        this.image = image
        this.map = map;

        /** Set the map's events */
        // this.map.on('zoomend', this.resizeMarkers)
        this.createLegend(this.createLegendJSX())
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
    }

    /** Set the overlay image */
    setMap = () => {
        let [{areaId}] = this.context.stateReducer
        let areaModules =  this.props.mapConfig.areaModules
        let areaOption = this.props.mapConfig.areaOptions[areaId]
        let { url, bounds } = areaModules[areaOption]
        this.image.setUrl(url)
        this.image.setBounds(bounds)
        this.map.fitBounds(bounds)        
    }

    /** Calculate the current scale for creating markers and resizing. */
    calculateScale = () => {
        this.currentZoom = this.map.getZoom();
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = Math.floor(this.zoomDiff * 30);
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        this.scalableIconSize = this.props.mapConfig.iconOptionsInBigScreen + this.resizeConst
        this.scalableNumberSize = Math.floor(this.scalableIconSize / 3);
    }

    createLegend(LegendJSX){
        if(LegendJSX){
            try{
                this.map.removeControl(this.legend)
            }catch{ null }

            this.legend = L.control({position: 'bottomleft'});

            this.legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend');
                ReactDOM.render(LegendJSX, div);
                return div;
            }.bind(this);

            this.legend.addTo(this.map);
        }
    }

    createLegendJSX = (imageSize = "25px", fontSize = "15px", legendWidth = "250px") => {
        // pinImage is imported
        var {legendDescriptor, proccessedTrackingData} = this.props
        var pins;
        try{
            pins = legendDescriptor.map( description => { return pinImage[description.pinColor] })
        }catch{ null }

        var jsx = legendDescriptor ? 
            (
                <div className="bg-light" style={{width: legendWidth}}>
                    {
                        legendDescriptor.map((description, index) => {
                            var count = proccessedTrackingData
                                .filter(item => {
                                    return item.currentPosition && item.searched == index + 1
                                })
                                .filter(item => {
                                    return parseInt(item.area_id) === parseInt(this.props.areaId) && item.found && item.object_type == 0
                                }).length
                            return(
                                <div className="text-left" key = {index} style = {{width: '100%', height: '80px'}}>
                                    <img src = {pins[index]} className = "m-2 float-left" width={imageSize}></img>
                                    <strong><h6 className="" style={{lineHeight: '200%', fontWeight:'bold'}}>{description.text} : {count} 個</h6></strong>
                                </div>
                            )             
                        })
                    }
                </div>   
            )
            : null
        return jsx
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

        /** Mark the objects onto the map  */
        // this.calculateScale();

        let counter = 0;

        this.props.proccessedTrackingData
        .filter(item => {
            return ( parseInt(item.area_id) === parseInt(this.props.areaId) && 
                item.found && 
                item.object_type == 0 &&
                item.currentPosition && 
                item.searched != -1
            )
        })
        .map(item => {


            let position = this.macAddressToCoordinate(item.mac_address,item.currentPosition);

            /** Set the icon option*/

            item.iconOption = {

                ...this.iconOptions,

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColorInBigScreen(item, this.props.colorPanel),

                /** Set the pin size */
                // iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,
                currentPosition: item.currentPosition,

                /** Show the ordered on location pin */
                number: this.props.mapConfig.iconOptionsInBigScreen.showNumber && 
                        // this.props.mapConfig.isObjectShowNumber.includes(item.searchedObjectType) && 
                        item.searched 
                        ? ++counter 
                        : '',

                /** Set the color of ordered number */
                numberColor: this.props.mapConfig.iconColor.number,
            }

            const option = new L.AwesomeNumberMarkers (item.iconOption)
            let marker =  L.marker(position, {icon: option}).addTo(this.markersLayer)

            /** Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others */
            if (item.searched) marker.setZIndexOffset(1000);
        })

        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.createLegend(this.createLegendJSX());
    }

    collectObjectsByLatLng = (lbPosition) => {
        let objectList = []
        this.props.proccessedTrackingData
        .filter(item => {
            return item.currentPosition
        })
        .filter(item => {
            return parseInt(item.area_id) === parseInt(this.props.areaId) && item.found && item.object_type == 0
        })
        .map(item => {
            item.currentPosition && item.currentPosition.toString() === lbPosition.toString() && item.isMatchedObject ? objectList.push(item) : null;
        })
        return objectList 
    }

    /** Retrieve the object's offset from object's mac_address.
     * @param   mac_address The mac_address of the object retrieved from DB. 
     * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
    macAddressToCoordinate = (mac_address, lbeacon_coordinate) => {
        // const xx = mac_address.slice(15,16);
        // const yy = mac_address.slice(16,17);
        // const multiplier = this.props.mapConfig.iconOptions.markerDispersity; 
		// const origin_x = lbeacon_coordinate[1] - parseInt(8, 16) * multiplier ; 
		// const origin_y = lbeacon_coordinate[0] - parseInt(8, 16) * multiplier ;
		// const xxx = origin_x + parseInt(xx, 16) * multiplier;
        // const yyy = origin_y + parseInt(yy, 16) * multiplier;
        const xxx = lbeacon_coordinate[1]
        const yyy = lbeacon_coordinate[0]
        return [yyy, xxx];
    }

    render(){
        return (   
            <div id='mapid' style={{height: '90vh'}}/>
        )
    }
}

export default Map;

