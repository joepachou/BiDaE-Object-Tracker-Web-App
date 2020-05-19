import React from 'react';
import { 
    AppContext
} from '../../../context/AppContext';
import config from '../../../config';
import Map from '../../presentational/Map';

export default class TabletMapContainer extends React.Component {

    static contextType = AppContext

    render() {

        const { 
            locale,
            stateReducer,
            auth
        } = this.context;

        const { 
            hasSearchKey,
            proccessedTrackingData,
            pathMacAddress,
            currentAreaId
        } = this.props;

        let [{areaId}] = stateReducer

        const style = {
            mapForMobile: {
                // width: '90vw',
                border: 'solid 2px rgba(227, 222, 222, 0.619)',
                padding: '5px',
            },
            mapBlock: {
                border: 'solid 2px rgba(227, 222, 222, 0.619)',
                padding: '5px',
            },
        }

        return (
            <div style={style.mapForMobile}>
                <Map
                    pathMacAddress={pathMacAddress}
                    hasSearchKey={hasSearchKey}
                    proccessedTrackingData={proccessedTrackingData}
                    lbeaconPosition={this.props.lbeaconPosition}
                    geofenceConfig={this.props.geofenceConfig}
                    getSearchKey={this.props.getSearchKey}
                    areaId={areaId}
                    searchedObjectType={this.props.showedObjects}
                    mapConfig={config.mapConfig}
                    handleClosePath={this.props.handleClosePath}
                    handleShowPath={this.props.handleShowPath}
                    showPath={this.props.showPath}
                    style={{border:'solid'}}
                    currentAreaId={currentAreaId}
                />
            </div>
        )
    }
}