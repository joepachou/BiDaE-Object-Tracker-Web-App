/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserSearchContainer.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React from 'react';
import {
    Row,
    Image,
    Col
} from 'react-bootstrap';
import BOTSearchbar from '../../presentational/BOTSearchbar';
import config from '../../../config';
import Searchbar from '../../presentational/Searchbar';
import FrequentSearch from '../../container/FrequentSearch';
import ObjectTypeList from '../../container/ObjectTypeList';
import SearchableObjectType from '../../presentational/SearchableObjectType';

const BrowserSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
}) => {
    return (
        <div 
            id='searchContainer' 
            className="py-1" 
            onTouchMove={handleTouchMove}
        >
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <Searchbar 
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                />
            </Row>
            <div id='searchOption' className="pt-2"> 
                <Row>
                    <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                        <FrequentSearch 
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            maxHeigh={config.searchResultProportion}
                        />
                    </Col>
                    <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                        {/* <ObjectTypeList
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            objectTypeList={objectTypeList || []}
                            maxHeigh={config.searchResultProportion}
                        />           */}
                        <SearchableObjectType
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            objectTypeList={objectTypeList || []}
                            maxHeigh={config.searchResultProportion}
                        />                  
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default BrowserSearchContainer