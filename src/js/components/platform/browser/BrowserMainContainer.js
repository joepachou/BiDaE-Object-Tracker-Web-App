import React from 'react';
import MapContainer from '../../container/MapContainer';
import SearchResultList from '../../presentational/SearchResultList';
import SearchContainer from '../../container/SearchContainer';
import {
    Row,
    Col
} from 'react-bootstrap';
import InfoPrompt from '../../presentational/InfoPrompt'
import AuthenticationContext from '../../../context/AuthenticationContext';

const BrowserMainContainer = ({ 
    handleClearButton,
    getSearchKey,
    setMonitor,
    clearAlerts,
    handleClosePath,
    handleShowPath,
    lbeaconPosition,
    geofenceConfig,
    searchedObjectType,
    showedObjects,
    highlightSearchPanel,
    showMobileMap,
    clearSearchResult,
    searchKey,
    searchResult,
    trackingData,
    proccessedTrackingData,
    hasSearchKey,
    setShowedObjects,
    pathMacAddress,
    isHighlightSearchPanel,
    locationMonitorConfig,
    currentAreaId,
}) => {

    let auth = React.useContext(AuthenticationContext)

    const style = {
        noResultDiv: {
            color: 'grey',
            fontSize: '1rem',
        },

        pageWrap: {
            overflow: "hidden hidden",
        },

        searchResultDiv: {
            display: hasSearchKey ? null : 'none',
        },
        
        searchPanel: {
            zIndex: isHighlightSearchPanel ? 1060 : 1,
            background: 'white',
            borderRadius: 10,
            // height: '90vh'
        },

        searchResultList: {
            dispaly: hasSearchKey ? null : 'none',
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
                        pathMacAddress={pathMacAddress} 
                        proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                        hasSearchKey={hasSearchKey}
                        searchKey={searchKey}
                        searchResult={searchResult}
                        handleClearButton={handleClearButton}
                        getSearchKey={getSearchKey}
                        setMonitor={setMonitor}
                        lbeaconPosition={lbeaconPosition}
                        geofenceConfig={geofenceConfig}
                        locationMonitorConfig={locationMonitorConfig}
                        clearAlerts={clearAlerts}
                        handleClosePath={handleClosePath}
                        handleShowPath={handleShowPath}
                        searchedObjectType={searchedObjectType}
                        showedObjects={showedObjects}
                        setShowedObjects={setShowedObjects}
                        currentAreaId={currentAreaId}
                    />
                </Col>

                <Col id='searchPanel' xs={12} sm={5} md={3} lg={4} xl={4} className="w-100 px-2" style={style.searchPanel}>
                    <SearchContainer 
                        hasSearchKey={hasSearchKey}
                        clearSearchResult={clearSearchResult}
                        auth={auth}
                        getSearchKey={getSearchKey}
                    />                        
                    <div 
                        id='searchResult' 
                        style={style.searchResultDiv} 
                    >
                        <SearchResultList
                            searchResult={searchResult} 
                            searchKey={searchKey}
                            highlightSearchPanel={highlightSearchPanel}
                            handleShowPath={handleShowPath}
                            showMobileMap={showMobileMap}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default BrowserMainContainer