import React from "react";
import Surveillance from "../presentational/Surveillance";
import ToggleSwitch from "./ToggleSwitch";
import { 
    Nav, 
    Button,
    Image,
    ButtonToolbar
}  from "react-bootstrap";
import LocaleContext from "../../context/LocaleContext";
import GridButton from "../container/GridButton";
import PdfDownloadForm from "./PdfDownloadForm"
import config from "../../config";
import AccessControl from "../presentational/AccessControl"
import { AppContext } from "../../context/AppContext";


class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        rssi: config.defaultRSSIThreshold,
        selectedObjectData: [],
        showDevice: false,
        showPdfDownloadForm: false,
        area: this.props.area
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.auth, this.props.auth))) {
            const [{ area }, dispatch] = this.context.stateReducer
            dispatch({
                type: "changeArea",
                value: this.props.auth.user.area
            })
            this.setState({
                area: this.props.auth.user.area
            })
        }
    }

    handleClickButton = (e) => {
        const [{ area }, dispatch] = this.context.stateReducer
        const { name } = e.target
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
            case "IIS_SINICA_FLOOR_FOUR":
            case "NTUH_YUNLIN_WARD_FIVE_B":
                this.props.changeArea(name)
                dispatch({
                    type:'changeArea',
                    value: name
                })
                this.setState({
                    area: name
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
                height: "40%"
            }, 
            mapBlock: {
                height: "60%",
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            gridButton: {
                display: this.state.showDevice ? null : "none"
            }
        }
        const { locale } = this.context;

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className="overflow-hidden">
                <ButtonToolbar className='mb-2'>
                    <Button 
                        variant="outline-primary" 
                        className="mr-1 text-capitalize" 
                        onClick={this.handleClickButton} 
                        name="IIS_SINICA_FLOOR_FOUR"
                        disabled={this.state.area === "IIS_SINICA_FLOOR_FOUR"}
                    >
                        {locale.texts.IIS_SINICA_FLOOR_FOUR}
                    </Button>

                    <Button 
                        variant="outline-primary" 
                        className="mr-1 text-capitalize" 
                        onClick={this.handleClickButton} 
                        name="NTUH_YUNLIN_WARD_FIVE_B"
                        disabled={this.state.area === "NTUH_YUNLIN_WARD_FIVE_B"}
                    >
                        {locale.texts.NTUH_YUNLIN_WARD_FIVE_B}
                    </Button>
                </ButtonToolbar>
                <div style={style.mapBlock}>
                    <Surveillance 
                        rssi={this.state.rssi} 
                        hasSearchKey={hasSearchKey}
                        style={style.searchMap}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        getSearchKey={this.props.getSearchKey}
                        area={this.props.area}
                        auth={auth}
                    />
                </div>
                <div style={style.navBlock}>
                    <Nav className="d-flex align-items-start text-capitalize">
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
                                >
                                    {locale.texts.SAVE}
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
                            />
                        </div> */}
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