import React from 'react';
import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import { Nav, Button }  from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import { connect } from 'react-redux'
import { 
    shouldUpdateTrackingData,
} from '../../action/action'
import GridButton from '../container/GridButton';
import PdfDownloadForm from './PdfDownloadForm'


class SurveillanceContainer extends React.Component {

    state = {
        rssi: 1,
        selectedObjectData: [],
        showDevice: false,
        showPdfDownloadForm: false,
    }

    handleClickButton = (e) => {
        const button = e.target;
        const buttonName = button.name
        switch(buttonName.toLowerCase()) {
            case 'show devices':
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case 'clear':
                this.props.handleClearButton();
            case 'save':
                this.setState({
                    showPdfDownloadForm: true,
                })
        }

    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
    }

    render(){
        const { hasSearchKey } = this.props;

        const style = {
            title: {
                color: 'grey',
                fontSize: '1rem',
                maxWidth: '9rem',
                height: '5rem',
                lineHeight: '3rem'
            },
            // surveillanceContainer: {
            //     height: '100vh'
            // },
            navBlock: {
                height: '40%'
            }, 
            mapBlock: {
                height: '60%',
                border: 'solid 2px rgba(227, 222, 222, 0.619)',
                padding: '5px',
            },
            gridButton: {
                display: this.state.showDevice ? null : 'none'
            }
        }

        const locale = this.context.texts;

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className='overflow-hidden'>
                <div style={style.mapBlock}>
                    <Surveillance 
                        rssi={this.state.rssi} 
                        hasSearchKey={hasSearchKey}
                        style={style.searchMap}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        getSearchKey={this.props.getSearchKey}
                    />
                </div>
                <div style={style.navBlock}>

                    <Nav className='d-flex align-items-start text-capitalize'>
                        <Nav.Item>
                            <div style={style.title} 
                            >
                                {locale.LOCATION_ACCURACY}
                            </div>
                        </Nav.Item>
                        <Nav.Item className='pt-2 mr-2'>
                            <ToggleSwitch 
                                changeLocationAccuracy={this.props.changeLocationAccuracy} 
                                leftLabel='low'
                                defaultLabel='med' 
                                rightLabel='high'
                            />
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button 
                                variant="outline-primary" 
                                className='mr-1 ml-2 text-capitalize' 
                                onClick={this.handleClickButton} 
                                name='clear'
                            >
                                {locale.CLEAR}
                            </Button>
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button 
                                variant="outline-primary" 
                                className='mr-1 ml-2 text-capitalize' 
                                onClick={this.handleClickButton} 
                                name='save'
                            >
                                {locale.SAVE}
                            </Button>
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button 
                                variant="outline-primary" 
                                className='mr-1 text-capitalize' 
                                onClick={this.handleClickButton} 
                                name='show devices'
                            >
                                {this.state.showDevice ? locale.HIDE_DEVICES : locale.SHOW_DEVICES }
                            </Button>
                        </Nav.Item >
                        <div style={style.gridButton} className='mt-2 mx-3'>
                            <GridButton
                                clearColorPanel={this.props.clearColorPanel}
                                getSearchKey={this.props.getSearchKey}
                            />
                        </div>
                    </Nav>
                </div>
                <PdfDownloadForm 
                    show={this.state.showPdfDownloadForm}
                    data={this.props.proccessedTrackingData.filter(item => item.searched)}
                    handleClose = {this.handleClosePdfForm}
                />
            </div>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value)),
    }
}

export default connect(null, mapDispatchToProps)(SurveillanceContainer)