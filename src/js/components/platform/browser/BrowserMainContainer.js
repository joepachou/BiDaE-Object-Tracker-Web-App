import React from 'react';
import MapContainer from '../../container/MapContainer';
import { AppContext } from '../../../context/AppContext';
import SearchResultList from '../../presentational/SearchResultList';
import SearchContainer from '../../container/SearchContainer';
import {
    Row,
    Col
} from 'react-bootstrap';
import InfoPrompt from '../../presentational/InfoPrompt'

export default class BrowserMainContainer extends React.Component {

    static contextType = AppContext

    state = {
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        shouldUpdateTrackingData: true,
        markerClickPackage: {},
        showPath: false,
        display: true,
        showMobileMap: true,
        searchedObjectType: [],
        showedObjects: [],
    }

    render() {

        let {
            auth
        } = this.context

        const { 
            colorPanel, 
            clearColorPanel,
            showPath,
        } = this.state

        const {
            handleClearButton,
            getSearchKey,
            setMonitor,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            lbeaconPosition,
            geofenceConfig,
            authenticated,
            searchedObjectType,
            showedObjects,
            highlightSearchPanel,
            showMobileMap,
            clearSearchResult,
            hasGridButton,
            searchKey,
            searchResult,
            trackingData,
            proccessedTrackingData,
            hasSearchKey,
            setShowedObjects,
            pathMacAddress,

        } = this.props
        
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
            },

            pageWrap: {
                overflow: "hidden hidden",
            },

            searchResultDiv: {
                display: this.props.hasSearchKey ? null : 'none',
            },
            
            searchPanel: {
                zIndex: this.props.isHighlightSearchPanel ? 1060 : 1,
                background: 'white',
                borderRadius: 10,
                // height: '90vh'
            },

            searchResultList: {
                dispaly: this.state.hasSearchKey ? null : 'none',
                maxHeight: '28vh'
            },
        }

        return (
            <div 
                id="page-wrap" 
                className='mx-1 my-2 overflow-hidden' 
                style={style.pageWrap} 
            >
                <Row 
                    id="mainContainer" 
                    className='d-flex w-100 justify-content-around mx-0' 
                    style={style.container}
                >
                    <Col sm={7} md={9} lg={8} xl={8} id='searchMap' className="pl-2 pr-1" >
                        <InfoPrompt 
                            searchKey={searchKey}
                            searchResult={searchResult}
                        />
                        <MapContainer
                            showPath={this.state.showPath}
                            pathMacAddress={this.props.pathMacAddress} 
                            proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                            hasSearchKey={hasSearchKey}
                            colorPanel={colorPanel}
                            searchResult={this.props.searchResult}
                            handleClearButton={handleClearButton}
                            getSearchKey={this.getSearchKey}
                            setMonitor={this.props.setMonitor}
                            lbeaconPosition={this.props.lbeaconPosition}
                            geofenceConfig={this.props.geofenceConfig}
                            locationMonitorConfig={this.props.locationMonitorConfig}
                            clearAlerts={clearAlerts}
                            searchKey={this.props.searchKey}
                            handleClosePath={handleClosePath}
                            handleShowPath={handleShowPath}
                            searchedObjectType={this.props.searchedObjectType}
                            showedObjects={this.props.showedObjects}
                            setShowedObjects={this.props.setShowedObjects}
                        />
                    </Col>

                    <Col id='searchPanel' xs={12} sm={5} md={3} lg={4} xl={4} className="w-100 px-2" style={style.searchPanel}>
                        <SearchContainer 
                            hasSearchKey={this.props.hasSearchKey}
                            clearSearchResult={this.props.clearSearchResult}
                            auth={auth}
                            getSearchKey={this.props.getSearchKey}
                        />                        
                        <div 
                            id='searchResult' 
                            style={style.searchResultDiv} 
                        >
                            <SearchResultList
                                searchResult={this.props.searchResult} 
                                searchKey={this.props.searchKey}
                                highlightSearchPanel={this.props.highlightSearchPanel}
                                handleShowPath={this.props.handleShowPath}
                                showMobileMap={this.props.showMobileMap}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
