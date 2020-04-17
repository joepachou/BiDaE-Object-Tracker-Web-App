import React from 'react';
import MapContainer from '../../container/MapContainer';
import { AppContext } from '../../../context/AppContext'
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'

export default class TabletMainContainer extends React.Component {

    static contextType = AppContext

    state = {
        lbeaconPosition: [],
        geofenceConfig: null,
        locationMonitorConfig: null,
        violatedObjects: {},
        lastsearchKey: '',
        colorPanel: null,
        clearColorPanel: false,
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        authenticated: this.context.auth.authenticated,
        shouldUpdateTrackingData: true,
        markerClickPackage: {},
        showPath: false,
        pathMacAddress:'',
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
            pathMacAddress,
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
            setShowedObjects
        } = this.props
        
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
            }, 

        }

        return (
            <div id="page-wrap" className='d-flex flex-column w-100' style={{height: "90vh"}}>
                <div id="mainContainer" className='d-flex flex-row h-100 w-100' style={style.container}>
                    <div className='d-flex flex-column' style={style.MapAndResult}>
                        <div className="d-flex" style={style.MapAndQrcode}>
                            <MapContainer
                                showPath={showPath}
                                pathMacAddress={pathMacAddress} 
                                proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                                hasSearchKey={hasSearchKey}
                                colorPanel={colorPanel}
                                searchResult={searchResult}
                                handleClearButton={handleClearButton}
                                getSearchKey={getSearchKey}
                                clearColorPanel={clearColorPanel}
                                setMonitor={setMonitor}
                                auth={auth}
                                lbeaconPosition={lbeaconPosition}
                                geofenceConfig={geofenceConfig}
                                clearAlerts={clearAlerts}
                                searchKey={searchKey}
                                authenticated={authenticated}
                                handleClosePath={handleClosePath}
                                handleShowPath={handleShowPath}
                                searchedObjectType={searchedObjectType}
                                showedObjects={showedObjects}
                                setShowedObjects={setShowedObjects}
                            />
                        </div>

                        <div id="searchResult" className="d-flex" style={{justifyContent: 'center'}}>
                            <SearchResultList
                                searchResult={searchResult} 
                                searchKey={searchKey}
                                highlightSearchPanel={highlightSearchPanel}
                                handleShowPath={handleShowPath}
                                showMobileMap={showMobileMap}
                            />
                        </div>
                        </div>
                        <div id='searchPanel' className="h-100" style={style.searchPanelForTablet}>
                            <SearchContainer
                                hasSearchKey={hasSearchKey}
                                clearSearchResult={clearSearchResult}
                                hasGridButton={hasGridButton}
                                auth={auth}
                                getSearchKey={getSearchKey}
                            />
                        </div>
                </div>
            </div>
        )
    }
}
