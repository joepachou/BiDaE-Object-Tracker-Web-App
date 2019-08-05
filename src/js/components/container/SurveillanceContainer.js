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


class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: 1,
            selectedObjectData: [],
            showDevice: false,
        }
        this.handleClickButton = this.handleClickButton.bind(this)
    }

    handleClickButton(e) {
        const button = e.target;
        const buttonName = button.innerText
        switch(buttonName.toLowerCase()) {
            case 'show devices':
            case 'hide devices':
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case 'clear':
                this.props.handleClearButton();
        }

    }
    
    render(){
        const { rssi, 
                showEditObjectForm, 
                showConfirmForm, 
                selectedObjectData, 
                formOption, 
            } = this.state;
        const { hasSearchKey, 
                searchResult,
            } = this.props;
        const locale = this.context;

        const style = {
            title: {
                color: 'grey',
                fontSize: '1rem',
                width: '5rem'
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

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className='overflow-hidden'>
                <div style={style.mapBlock}>
                    <Surveillance 
                        rssi={rssi} 
                        hasSearchKey={hasSearchKey}
                        style={style.searchMap}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        getSearchKey={this.props.getSearchKey}
                    />
                </div>
                <div style={style.navBlock}>

                    <Nav className='d-flex align-items-start'>
                        <Nav.Item className='d-flex align-self-start'>
                            <div style={style.title} className='text-wrap'>Location Accuracy</div>
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
                            <Button variant="outline-primary" className='mr-1 ml-2' onClick={this.handleClickButton}>Clear</Button>
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button variant="outline-primary" className='mr-1 mr-4' onClick={this.handleClickButton}>Save</Button>

                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button variant="outline-primary" className='mr-1' onClick={this.handleClickButton} active={this.state.showDevice}>
                                {this.state.showDevice ? 'Hide devices' : 'Show devices' }
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