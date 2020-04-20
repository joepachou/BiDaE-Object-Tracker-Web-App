import React from 'react';
import MapContainer from '../../container/MapContainer';
import { AppContext } from '../../../context/AppContext'
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'
import {
    ButtonGroup,
    Button
} from 'react-bootstrap'

export default class MobileMainContainer extends React.Component {

    static contextType = AppContext

    state = {
        lbeaconPosition: [],
        geofenceConfig: null,
        locationMonitorConfig: null,
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
        showedObjects: [],
    }

    render() {

        let {
            auth,
            locale
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
            setShowedObjects,
            handleShowResultListForMobile,
            display,
            mapButtonHandler
        } = this.props
        
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
            }, 
            searchPanelForMobile: {
                // zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                display: display ? null : 'none',
                fontSize: '2rem',
                background: "white",
                borderRadius: 10,
                //border: 'solid',
                height: '90vh',
                // width:'90vw'
            },
            mapForMobile: {
                display: showMobileMap ? null : 'none'
            },

        }

        return (
            <div id="page-wrap" className='d-flex flex-column' style={{height: "90vh"}}>
                <div className='h-100' style={{overflow: 'hidden hidden'}}>
                    <div id='searchPanel' className="h-100" style={style.searchPanelForMobile}>
                        <SearchContainer 
                            hasSearchKey={this.props.hasSearchKey}
                            clearSearchResult={this.props.clearSearchResult}
                            auth={auth}
                            getSearchKey={getSearchKey}
                            handleShowResultListForMobile={handleShowResultListForMobile}
                        />
                    </div>
                    <div style={style.mapForMobile} className="m-1">
                        <MapContainer
                            showPath={this.state.showPath}
                            pathMacAddress={this.state.pathMacAddress} 
                            proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                            hasSearchKey={hasSearchKey}
                            colorPanel={colorPanel}
                            searchResult={searchResult}
                            handleClearButton={this.handleClearButton}
                            getSearchKey={this.getSearchKey}
                            clearColorPanel={clearColorPanel}
                            setMonitor={this.setMonitor}
                            auth={auth}
                            lbeaconPosition={this.state.lbeaconPosition}
                            geofenceConfig={this.state.geofenceConfig}
                            clearAlerts={this.clearAlerts}
                            searchKey={this.state.searchKey}
                            handleClosePath={this.handleClosePath}
                            handleShowPath={this.handleShowPath}
                            searchedObjectType={this.props.searchedObjectType}
                            showedObjects={this.props.showedObjects}
                            handleClearButton={this.handleClearButton}
                            mapButtonHandler={mapButtonHandler}
                        />
                    </div>
                    <ButtonGroup style={{marginTop:'5px',marginBottom:'5px'}}>
                        <Button 
                            variant='outline-primary' 
                            onClick={mapButtonHandler}
                        >
                            {showMobileMap ? locale.texts.HIDE_MAP : locale.texts.SHOW_MAP}
                        </Button>
                        <Button 
                            variant='outline-primary' 
                            onClick={handleClearButton}
                        >
                            {locale.texts.NEW_SEARCH}
                        </Button>
                    </ButtonGroup>
                    <div className='d-flex justify-content-center'>
                        <SearchResultList
                            searchResult={searchResult} 
                            searchKey={searchKey}
                            highlightSearchPanel={highlightSearchPanel}
                            handleShowPath={handleShowPath}
                            showMobileMap={showMobileMap}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
