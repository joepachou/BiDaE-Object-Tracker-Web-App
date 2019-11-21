import React, { Fragment } from "react";
import Map from "../presentational/Map";
import ToggleSwitch from "./ToggleSwitch";
import { 
    Nav, 
    Button,
    ButtonToolbar
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
        showDevice: false,
        showPdfDownloadForm: false,
        isOpenFence: false,
        filterObjectType: []
    }


    componentDidUpdate = (prevProps, prevState) => {
        // if (!(_.isEqual(prevProps.auth, this.props.auth))) {
        //     const [{ areaId }, dispatch] = this.context.stateReducer
        //     const { auth } = this.context
        //     dispatch({
        //         type: "setArea",
        //         value: auth.authenticated ? auth.user.areas_id[0] : config.defaultAreaId
        //     })
        // }
        if (this.props.geoFenceConfig.length !== 0 && !(_.isEqual(prevProps.geoFenceConfig, this.props.geoFenceConfig))) {
            this.setState({
                isOpenFence: this.props.geoFenceConfig[0].enable
            })
        }
    }

    handleClickButton = (e) => {
        const { name, value } = e.target
        let { stateReducer } = this.context
        let [{areaId}, dispatch] = stateReducer
        switch(name) {
            case "show devices":
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case "clear":
                this.props.handleClearButton();
                break;
            case "save":
                this.setState({
                    showPdfDownloadForm: true,
                })
                break;
            // case "setArea":
            //     this.props.setArea(value)
            //     break;
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
            case "filterObjectType":
                let filterObjectType = value.split(',').reduce((filterObjectType, number) => {   
                    number = parseInt(number)                
                    if (!filterObjectType.includes(number)) {
                        filterObjectType.push(number)
                    } else {
                        let index = filterObjectType.indexOf(number)
                        filterObjectType = [...filterObjectType.slice(0, index), ...filterObjectType.slice(index + 1)]
                    }
                    return filterObjectType
                }, this.state.filterObjectType)
                this.setState({
                    filterObjectType,
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
            navBlock: {
                // height: "40%"
            }, 
            mapBlock: {
                // height: "60%",
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
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
            <div id="searchButtonToolBar">
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
                                    name="filterObjectType"
                                    value={[0]}
                                    active={this.state.filterObjectType.includes(0)}
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
                                >
                                    {this.state.filterObjectType.includes(1) ? locale.texts.SHOW_RESIDENTS : locale.texts.HIDE_RESIDENTS}
                                </Button>
                            </Nav.Item>
                        </AccessControl>
                        <Nav.Item className="mt-2">
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
                        </div>
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
                    data={this.props.proccessedTrackingData.filter(item => item.searched)}
                    handleClose = {this.handleClosePdfForm}
                    userInfo={auth.user}
                />
            </div>
        )
    }
}

export default SurveillanceContainer