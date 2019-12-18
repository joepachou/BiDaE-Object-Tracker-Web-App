import React, { Fragment } from "react";
import Map from "../presentational/Map";
import ToggleSwitch from "./ToggleSwitch";
import { 
    Nav, 
    Button,
}  from "react-bootstrap";
import GridButton from "../container/GridButton";
import PdfDownloadForm from "./PdfDownloadForm"
import config from "../../config";
import AccessControl from "../presentational/AccessControl"
import { AppContext } from "../../context/AppContext";


class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        selectedObjectData: [],
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
        
        if (!(_.isEqual(prevProps.authenticated, this.props.authenticated))) {
            this.setState({
                searchedObjectType: [],
                showObjects: [],
            })
        } 

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
            if ( searchedObjectType.includes(-2)) return 
            else { 
                searchedObjectType.push(-2)
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

    getSearchKey = (searchKey, colorPanel, searchValue) => {
        let markerClickPackage = {}
        this.props.proccessedTrackingData.map(item => {
            console.log(item.searchedType)
            console.log(this.state.showObjects)
            if (this.state.showObjects.includes(item.searchedType)) {
                markerClickPackage[item.mac_address] = item
            }
        })
        this.props.getSearchKey(searchKey, colorPanel, searchValue, markerClickPackage)
    }

    render(){
        const { 
            hasSearchKey,
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
            stateReducer,
            auth
        } = this.context;

        let [{areaId}] = stateReducer

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className="overflow-hidden">
                <div style={style.mapBlock}>
                    <Map 
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        geoFenceConfig={this.props.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                        getSearchKey={this.getSearchKey}
                        areaId={areaId}
                        isOpenFence={this.state.isOpenFence}
                        searchedObjectType={this.state.showObjects}
                        mapConfig={config.mapConfig}
                    />
                </div>
                <div style={style.navBlock}>
                    <Nav className="d-flex align-items-start text-capitalize bd-highlight">
                        <Nav.Item>
                            <div style={style.title} 
                            >
                                {locale.texts.LOCATION_ACCURACY}
                            </div>
                        </Nav.Item>
                        <Nav.Item className="pt-2 mr-2">
                            <ToggleSwitch 
                                changeLocationAccuracy={this.props.changeLocationAccuracy} 
                                leftLabel="low"
                                defaultLabel="med" 
                                rightLabel="high"
                            />
                        </Nav.Item>
                        <Nav.Item className="mt-2">
                            <Button 
                                variant="outline-primary" 
                                className="mr-1 ml-2 text-capitalize" 
                                onClick={this.handleClickButton} 
                                name="clear"
                                disabled={!this.props.hasSearchKey}
                            >
                                {locale.texts.CLEAR}
                            </Button>
                        </Nav.Item>
                        <AccessControl
                            permission={"user:saveSearchRecord"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="outline-primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={this.handleClickButton} 
                                    name="save"
                                    disabled={!this.props.hasSearchKey || this.state.showPdfDownloadForm}
                                >
                                    {locale.texts.SAVE}
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:toggleShowDevices"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={this.handleClickButton} 
                                    name="searchedObjectType"
                                    value={[-1, 0]}
                                    active={(this.state.showObjects.includes(0) || this.state.showObjects.includes(-1)) }
                                    disabled={
                                        !(this.state.searchedObjectType.includes(-1) ||
                                        this.state.searchedObjectType.includes(0))
                                    }
                                >
                                    {!(this.state.showObjects.includes(0) || this.state.showObjects.includes(-1)) 
                                        ?   locale.texts.SHOW_DEVICES 
                                        :   locale.texts.HIDE_DEVICES 
                                    }
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:toggleShowResidents"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item className="mt-2">
                                <Button 
                                    variant="primary" 
                                    className="mr-1 ml-2 text-capitalize" 
                                    onClick={this.handleClickButton} 
                                    name="searchedObjectType"
                                    value={[-2, 1, 2]}
                                    active={(this.state.showObjects.includes(1) || this.state.showObjects.includes(2))}
                                    disabled={
                                        !(this.state.searchedObjectType.includes(1) ||
                                        this.state.searchedObjectType.includes(2))
                                    }
                                >
                                    {!(this.state.showObjects.includes(1) || this.state.showObjects.includes(2)) 
                                        ?   locale.texts.SHOW_RESIDENTS
                                        :   locale.texts.HIDE_RESIDENTS 
                                    }
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        {/* <Nav.Item className="mt-2">
                            <Button 
                                variant="outline-primary" 
                                className="mr-1 text-capitalize" 
                                onClick={this.handleClickButton} 
                                name="show devices"
                            >
                                {this.state.showDevice ? locale.texts.HIDE_DEVICES : locale.texts.SHOW_DEVICES }
                            </Button>
                        </Nav.Item >
                        <div style={style.gridButton} className="mt-2 mx-3">
                            <GridButton
                                clearColorPanel={this.props.clearColorPanel}
                                getSearchKey={this.props.getSearchKey}
                                mapConfig={config.mapConfig}
                            />
                        </div> */}
                        {this.props.geoFenceConfig.map((item, index) => {
                            return ( parseInt(item.unique_key) == areaId && 
                                <Fragment
                                    key={index}
                                >
                                    <Nav.Item className="mt-2 bd-highligh ml-auto">
                                        <Button 
                                            variant="warning" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="fence"
                                            value={+!this.state.isOpenFence}
                                            active={!this.state.isOpenFence}
                                        >
                                            {this.state.isOpenFence ? locale.texts.FENCE_ON : locale.texts.FENCE_OFF}
                                        </Button>
                                    </Nav.Item>
                                    <Nav.Item className="mt-2">
                                        <Button 
                                            variant="outline-primary" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="clearAlerts"
                                        >
                                            {locale.texts.CLEAR_ALERTS}
                                        </Button>
                                    </Nav.Item>
                                </Fragment>
                            )
                        })}
                    </Nav>
                </div>
                <PdfDownloadForm 
                    show={this.state.showPdfDownloadForm}
                    data={this.props.searchResult}
                    handleClose = {this.handleClosePdfForm}
                    userInfo={auth.user}
                />
            </div>
        )
    }
}

export default SurveillanceContainer