// import React, { Fragment } from "react";
// import Map from "../presentational/Map";
// import ToggleSwitch from "./ToggleSwitch";
// import { 
//     Nav, 
//     Button,
// }  from "react-bootstrap";
// import GridButton from "../container/GridButton";
// import PdfDownloadForm from "./PdfDownloadForm"
// import config from "../../config";
// import AccessControl from "../presentational/AccessControl"
// import { AppContext } from "../../context/AppContext";

import React, { Fragment } from "react";
import Map from "./Map";
import ToggleSwitch from "../ToggleSwitch";
import { 
    Nav, 
    Button,
    ButtonToolbar
}  from "react-bootstrap";
import GridButton from "../../container/GridButton";
import PdfDownloadForm from "../PdfDownloadForm"
import config from "../../../config";
import AccessControl from "../../presentational/AccessControl"
import { AppContext } from "../../../context/AppContext";
import  pinImage from "./pinImage"


class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        selectedObjectData: [],
        // showDevice: false,
        showPdfDownloadForm: false,
        isOpenFence: false,
        searchedObjectType: [],
        showObjects: [],
    }


    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.geoFenceConfig.length !== 0 && !(_.isEqual(prevProps.geoFenceConfig, this.props.geoFenceConfig))) {
            this.setState({
                isOpenFence: this.props.geoFenceConfig[0].enable
            })
        }
        var searchedObjectType = this.state.searchedObjectType
        var showObjects = this.state.showObjects

        if (prevProps.searchKey !== this.props.searchKey && this.props.searchKey == "all devices") {
            if (searchedObjectType.includes(0)) return 
            else {
                searchedObjectType.push(0)
                showObjects.push(0)
            }
            this.setState({
                searchedObjectType,
                showObjects,
            })
        }  else if (prevProps.searchKey !== this.props.searchKey && this.props.searchKey == "all patients") {
            if (searchedObjectType.includes(1) || searchedObjectType.includes(2)) return 
            else { 
                searchedObjectType.push(1)
                searchedObjectType.push(2)
                showObjects.push(1)
                showObjects.push(2)
            }
            this.setState({
                searchedObjectType,
                showObjects
            })
        } else if (prevProps.searchKey !== this.props.searchKey && this.props.searchKey == "my patients") {
            if (searchedObjectType.includes(1) || 
                searchedObjectType.includes(2) || 
                searchedObjectType.includes(-2)
            ) return 
            else { 
                searchedObjectType.push(1)
                searchedObjectType.push(2)
                searchedObjectType.push(-2)
                showObjects.push(1)
                showObjects.push(2)
                showObjects.push(-2)
            }
            this.setState({
                searchedObjectType,
                showObjects
            })
        } else if (prevProps.searchKey !== this.props.searchKey && this.props.searchKey) {
            if (searchedObjectType.includes(-1)) return 
            else { 
                searchedObjectType.push(-1)
                showObjects.push(-1)
            }
            this.setState({
                searchedObjectType,
                showObjects
            })
        }
    }

    handleClickButton = (e) => {
        const { name, value } = e.target
        let { stateReducer } = this.context
        let [{areaId}, dispatch] = stateReducer
        switch(name) {
            // case "show devices":
            //     this.setState({
            //         showDevice: !this.state.showDevice
            //     })
            //     break;
            case "clear":
                this.props.handleClearButton();
                this.setState({
                    searchedObjectType: [],
                    showObjects: []
                })
                break;
            case "save":
                this.setState({
                    showPdfDownloadForm: true,
                })
                break;
            case "fence":
                this.props.setFence(value, areaId)
                .then(res => {
                    this.setState({
                        isOpenFence: !this.state.isOpenFence
                    })
                })
                .catch(err => {
                    console.log(`set fence config fail: ${err}`)
                })
                break;
            case "clearAlerts":
                this.props.clearAlerts()
                break;
            case "searchedObjectType":

                let showObjects = value.split(',').reduce((showObjects, number) => {   
                    number = parseInt(number)                
                    if (!this.state.searchedObjectType.includes(number)) return showObjects
                    else if (this.state.showObjects.includes(number)) {
                        let index = showObjects.indexOf(number)
                        showObjects = [...showObjects.slice(0, index), ...showObjects.slice(index + 1)]
                    } else {
                        showObjects.push(number)
                    }
                    return showObjects

                }, this.state.showObjects)

                this.setState({
                    showObjects
                })
                break;
        }

    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
    }

    createLegendJSX = (imageSize = "15px", fontSize = "15px", legendWidth = "300px") => {
        // pinImage is imported
        var {legendDescriptor} = this.props
        var pins;

        try{
            pins = legendDescriptor.map( description => { return pinImage[description.pinColor] })
        }catch{ null }

        var jsx = legendDescriptor ? 
            (
                <div className="bg-light" style={{width: legendWidth}}>
                    <h5><strong>SEARCH_RESULT(記得加locale)</strong></h5>
                    {
                        legendDescriptor.map((description, index) => {
                            return(
                                <div className="text-left" key = {index}>

                                    <img src = {pins[index]} className = "m-2" width={imageSize}></img>
                                    {description.text}
                                </div>
                            )             
                        })
                    }
                </div>   
            )
            : null
        return jsx
    }

    render(){
        const { 
            hasSearchKey,
            auth
        } = this.props;

        const style = {
            title: {
                color: "grey",
                fontSize: "1rem",
                maxWidth: "9rem",
                height: "5rem",
                lineHeight: "3rem"
            },
            // surveillanceContainer: {
            //     height: "100vh"
            // },
            navBlock: {
                // height: "40%"
            }, 
            mapBlock: {
                // height: "60%",
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            // gridButton: {
            //     display: this.state.showDevice ? null : "none"
            // }
        }
        const { 
            locale,
            stateReducer
        } = this.context;

        let [{areaId}] = stateReducer
        console.log(areaId)
        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className="overflow-hidden">
                <div style={style.mapBlock}>
                    <Map 
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        geoFenceConfig={this.props.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                        getSearchKey={this.props.getSearchKey}
                        areaId={areaId}
                        isOpenFence={this.state.isOpenFence}
                        filterObjectType={this.state.filterObjectType}
                        mapConfig={config.bigScreenConfig}
                        LegendJSX = {this.createLegendJSX()}
                    />
                </div>
            </div>
        )
    }
}

export default SurveillanceContainer