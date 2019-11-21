import React, {Fragment} from "react";
import Map from "../presentational/Map";
import ToggleSwitch from "./ToggleSwitch";
import { 
    Nav, 
    Button,
    Image,
    Row,
    ButtonToolbar
}  from "react-bootstrap";
import LocaleContext from "../../context/LocaleContext";
import GridButton from "../container/GridButton";
import PdfDownloadForm from "./PdfDownloadForm"
import config from "../../config";
import AccessControl from "../presentational/AccessControl"
import { AppContext } from "../../context/AppContext";
import QRcodeContainer from "./QRcode";
import { isNullOrUndefined } from "util";
import InfoPromptForTablet from '../presentational/InfoPromptForTablet';


class SurveillanceContainerTablet extends React.Component {

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
            MapAndQrcode: {
              height: "40vh",
              //border: "solid"
            },
            qrBlock: {
                //border: "solid",
                flex: 1
            }, 
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
                flex: 4,
            },
            navBlock: {
                //height: "40vh",
            },
            searchResult: {

            },
            gridButton: {
                display: this.state.showDevice ? null : "none"
            }
        }
        const { 
            locale,
            stateReducer
        } = this.context;

        let [{areaId}] = stateReducer
        
        return(
            <div id="surveillanceContainer" className="w-100 h-100 d-flex flex-column">
                <div className="d-flex w-100 h-100 flex-column">
                    <div>
                        <div className="w-100 d-flex flex-row" style={style.MapAndQrcode}>
                            <div style={style.qrBlock}>
                                <QRcodeContainer
                                    data={this.props.proccessedTrackingData.filter(item => item.searched)}
                                    userInfo={auth.user}
                                /> 
                                <InfoPromptForTablet 
                                    data={this.props.data}
                                    searchKey={this.props.searchKey}
                                    title={locale.texts.FOUND}
                                    searchResultLength={this.props.searchResult.length} 
                                />
                            </div>
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
                                    searchedObjectType={this.state.showObjects}
                                    mapConfig={config.mapConfig}
                                />
                            </div>
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
                                            size="sm"
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
                                                size="button"
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
                                                name="filterObjectType"
                                                value={[0]}
                                                active={this.state.filterObjectType.includes(0)}
                                                size="sm"
                                            >
                                                {this.state.filterObjectType.includes(0) ? locale.texts.SHOW_DEVICES : locale.texts.HIDE_DEVICES}
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
                                                name="filterObjectType"
                                                value={[1, 2]}
                                                active={this.state.filterObjectType.includes(1)}
                                                size="sm"
                                            >
                                                {this.state.filterObjectType.includes(1) ? locale.texts.SHOW_RESIDENTS : locale.texts.HIDE_RESIDENTS}
                                            </Button>
                                        </Nav.Item>
                                    </AccessControl>
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
                                                        size="sm"
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
                        </div>
                    </div>         
            </div>
        )
    }
}

export default SurveillanceContainerTablet