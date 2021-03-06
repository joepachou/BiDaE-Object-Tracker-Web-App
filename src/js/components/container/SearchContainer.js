/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchContainer.js

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

import React, { Fragment } from 'react';
import {
    TabletView,
    MobileOnlyView,
    isTablet,
    CustomView,
    isMobile 
} from 'react-device-detect';
import { AppContext } from '../../context/AppContext'; 
import TabletSearchContainer from '../platform/tablet/TabletSearchContainer';
import MobileSearchContainer from '../platform/mobile/MobileSearchContainer';
import BrowserSearchContainer from '../platform/browser/BrowserSearchContainer';
import apiHelper from '../../helper/apiHelper';
import config from '../../config';

class SearchContainer extends React.Component {

    static contextType = AppContext

    state = {
        isShowSectionTitle: false,
        hasSearchKey: false,
        isShowSearchOption: false,
        searchKey:'',
        sectionTitleList: [],
        sectionIndex:'',
        searchResult: [],
        hasSearchableObjectData: false,
        objectTypeList: [],        
    }

    componentDidMount = () => {
        this.getData()
    }

    componentDidUpdate = (prepProps) => {
        
        /** Refresh the search result automatically 
         *  This feature can be adjust by the user by changing the boolean value in config */
        if (this.state.refreshSearchResult 
            && this.state.hasSearchKey 
            && !this.props.hasGridButton) {
            this.props.getSearchKey(this.state.searchKey)            
        }
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && this.props.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasSearchKey !== this.props.hasSearchKey && prepProps.hasSearchKey) {
            this.setState({
                hasSearchKey: this.props.hasSearchKey,
            })
        }

    }
    /** Get the searchable object type. */
    getData = () => {
        const {
            locale,
            auth
        } = this.context

        apiHelper.objectApiAgent.getObjectTable({
            locale: locale.abbr,
            areas_id: auth.user.areas_id,
            objectType: [0]
        })
        .then(res => {

            let keywordType = config.KEYWORD_TYPE[auth.user.keyword_type] || 'type'
            
            let objectTypeList = res.data.rows.reduce((objectTypeList, item) => {
                if (!objectTypeList.includes(item[keywordType])) {
                    objectTypeList.push(item[keywordType])
                }
                return objectTypeList
            }, [])
            this.setState({
                objectTypeList
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {      
        const {
            searchKey,
            getSearchKey,
            clearSearchResult,
            handleShowResultListForMobile,
            searchObjectArray,
            pinColorArray,
            keywords
        } = this.props

        const {
            objectTypeList
        } = this.state

        const propsGroup = {
            searchKey,
            objectTypeList,
            getSearchKey,
            clearSearchResult,
            handleShowResultListForMobile,
            searchObjectArray,
            pinColorArray,
            keywords
        }
        
        return (
            <Fragment> 
                <CustomView condition={isTablet != true && isMobile != true}>
                    <BrowserSearchContainer 
                    {...propsGroup}
                     />
                </CustomView> 
                <TabletView>
                    <TabletSearchContainer 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileSearchContainer
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        );
    }
}

export default SearchContainer;