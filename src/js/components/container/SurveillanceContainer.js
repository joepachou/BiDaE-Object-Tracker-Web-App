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
import { BrowserView, TabletView, MobileOnlyView, isBrowser, isTablet, isMobileOnly } from "react-device-detect";
import QRcodeContainer from './QRcode'
import InfoPrompt from '../presentational/InfoPrompt'
import PdfDownloadFormForTablet from './PdfDownloadFormForTablet'
class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        selectedObjectData: [],
        showPdfDownloadForm: false,
        isOpenFence: false,
        searchedObjectType: [],
        showObjects: [],
    }

    componentDidMount = () => {
        
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
            case "cleanPath":
                    this.props.handleClosePath();
                break;
        }

    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
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
            titleForTablet: {
                color: "grey",
                fontSize: "1rem",
            },

            mapForMobile: {
                width: '90vw',
                height: '30vh',
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            gridButton: {
                display: this.state.showDevice ? null : "none"
            },
            MapAndQrcode: {
                height: '42vh'
            },
            qrBlock: {
                width: '10vw',
            },
            mapBlockForTablet: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
                width: '60vw'
            },
            button: {
                fontSize: "0.8rem"
            }
        }
        const { 
            locale,
            stateReducer,
            auth
        } = this.context;

        let [{areaId}] = stateReducer

        return(
            <div>
            <BrowserView>
            <div id="surveillanceContainer" style={style.surveillanceContainer} className="overflow-hidden">
                <div style={style.mapBlock}>
                    <Map
                        pathMacAddress={this.props.pathMacAddress}
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        geoFenceConfig={this.props.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                        getSearchKey={this.props.getSearchKey}
                        areaId={areaId}
                        isOpenFence={this.state.isOpenFence}
                        searchedObjectType={this.state.showObjects}
                        mapConfig={config.mapConfig}
                        pathData={this.state.pathData}
                        handleClosePath={this.props.handleClosePath}
                        handleShowPath={this.props.handleShowPath}
                        showPath={this.props.showPath}
                    />
                </div>
                <div style={style.navBlock}>
                    <Nav className="d-flex align-items-start text-capitalize bd-highlight">
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
                        {process.env.IS_TRACKING_PATH_ON == 1 && 
                            <AccessControl
                                permission={"user:cleanPath"}
                                renderNoAccess={()=>null}
                            >
                                <Nav.Item className="mt-2">
                                    <Button
                                        variant="primary"
                                        className="mr-1 ml-2 text-capitalize" 
                                        onClick={this.handleClickButton}
                                        name="cleanPath"
                                        active={(this.props.showPath)}
                                        disabled={!(this.props.showPath)}
                                    >
                                        {locale.texts.CLEAN_PATH}
                                    </Button>
                                </Nav.Item>
                            </AccessControl>
                        }
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
            </BrowserView>
            <TabletView>
            <div id="surveillanceContainer" className="w-100 h-100 d-flex flex-column">
                <div className="d-flex w-100 h-100 flex-column">
                    <div>
                        <div className="w-100 d-flex flex-row align-items justify-content" style={style.MapAndQrcode}>
                            <div style={style.qrBlock} className="d-flex flex-column align-items">
                                <div>
                                    
                                    <QRcodeContainer
                                        data={this.props.proccessedTrackingData.filter(item => item.searched)}
                                        userInfo={auth.user}
                                        searchKey={this.props.searchKey}
                                        isSearched = {this.props.isSearched}
                                    /> 
                                    <InfoPrompt
                                        searchKey={this.props.searchKey}
                                        searchResult={this.props.searchResult}
                                        title={locale.texts.FOUND} 
                                        title2={locale.texts.NOT_FOUND} 
                                    />
                                </div>
                                <div style={style.titleForTablet} className="mt-auto">
                                    {locale.texts.LOCATION_ACCURACY}
                                </div>
                            </div>
                            <div style={style.mapBlockForTablet}>
                            <Map
                                pathMacAddress={this.props.pathMacAddress}
                                hasSearchKey={hasSearchKey}
                                colorPanel={this.props.colorPanel}
                                proccessedTrackingData={this.props.proccessedTrackingData}
                                lbeaconPosition={this.props.lbeaconPosition}
                                geoFenceConfig={this.props.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                                getSearchKey={this.props.getSearchKey}
                                areaId={areaId}
                                isOpenFence={this.state.isOpenFence}
                                searchedObjectType={this.state.showObjects}
                                mapConfig={config.mapConfig}
                                pathData={this.state.pathData}
                                handleClosePath={this.props.handleClosePath}
                                handleShowPath={this.props.handleShowPath}
                                showPath={this.props.showPath}
                            />
                            </div>
                        </div>
                        
                        <div style={style.navBlock}>
                    <Nav style={style.button} className="d-flex align-items-start text-capitalize bd-highlight">
                        <Nav.Item className="pt-2 mr-2">
                            <ToggleSwitch 
                                changeLocationAccuracy={this.props.changeLocationAccuracy} 
                                rssi={this.props.rssi}
                                leftLabel="low"
                                defaultLabel="med" 
                                rightLabel="high"
                                locationAccuracyMap={config.mapConfig.locationAccuracyMap}
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
                        {process.env.IS_TRACKING_PATH_ON == 1 && 
                            <AccessControl
                                permission={"user:cleanPath"}
                                renderNoAccess={()=>null}
                            >
                                <Nav.Item className="mt-2">
                                    <Button
                                        variant="primary"
                                        className="mr-1 ml-2 text-capitalize" 
                                        onClick={this.handleClickButton}
                                        name="cleanPath"
                                        active={(this.props.showPath)}
                                        disabled={!(this.props.showPath)}
                                    >
                                        {locale.texts.CLEAN_PATH}
                                    </Button>
                                </Nav.Item>
                            </AccessControl>
                        }
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
                    <PdfDownloadFormForTablet 
                        show={this.state.showPdfDownloadForm}
                        data={this.props.searchResult}
                        handleClose = {this.handleClosePdfForm}
                        userInfo={auth.user}
                    />
                    </div>
                </div>
            </div>
            </TabletView>
            <MobileOnlyView>
                <div style={style.mapForMobile}>
                    <Map
                        pathMacAddress={this.props.pathMacAddress}
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        geoFenceConfig={this.props.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                        getSearchKey={this.props.getSearchKey}
                        areaId={areaId}
                        isOpenFence={this.state.isOpenFence}
                        searchedObjectType={this.state.showObjects}
                        mapConfig={config.mapConfig}
                        pathData={this.state.pathData}
                        handleClosePath={this.props.handleClosePath}
                        handleShowPath={this.props.handleShowPath}
                        showPath={this.props.showPath}
                    />
                </div>
            </MobileOnlyView>
            </div>
        )
    }
}

export default SurveillanceContainer