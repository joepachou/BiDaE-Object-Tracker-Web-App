/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        InfoPrompt.js

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


import React, { Fragment, useEffect } from 'react';
import { 
    Row
} from 'react-bootstrap'
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isTablet,
    CustomView,
    isMobile 
} from 'react-device-detect'
import { SWITCH_SEARCH_LIST } from '../../config/words';
import {
    HoverDiv,
    HoverWithUnderlineDiv,
    JustifyCenterDiv,
    FontBoldDiv,
    ToggleDisplayDiv,
    ReactBootstrapAlert
} from '../BOTComponent/styleComponent';

const InfoPrompt = ({
    searchKey,
    searchResult,
    handleClick
}) => {
    const appContext = React.useContext(AppContext);
    const [showDetail, setShowDetail] = React.useState(false)

    const { locale } = appContext

    let searchResultMap = searchResult.reduce((map, item) => {
        if (Object.keys(map).includes(item.type)) {
           map[item.type][0] += 1;
           if (item.found) {
               map[item.type][1] += 1;
           }
        } else {
            map[item.type] = []
            map[item.type][0] = 1;
            map[item.type][1] = 0;
            if (item.found) {
                map[item.type][1] += 1
            } 
        }
        return map
    }, {})

    const handleShowDetail = () => {
       setShowDetail(!showDetail)
    }

    return (
        <Fragment>
            <CustomView condition={isTablet != true && isMobile != true}>
                <ReactBootstrapAlert
                    variant='secondary' 
                    className='px-4'
                >
                    <Row>
                        <HoverWithUnderlineDiv
                            onClick={handleClick}
                        >
                            <div 
                                className='d-flex justify-content-start mr-2'
                                name={SWITCH_SEARCH_LIST}
                                value={true}
                            >
                                {searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                                &nbsp;
                                <FontBoldDiv>
                                    {searchKey ? searchResult.filter(item => item.found).length : ""}
                                </FontBoldDiv>
                                &nbsp;
                                {searchKey && locale.texts.OBJECTS}
                            </div>
                        </HoverWithUnderlineDiv>
                        <HoverWithUnderlineDiv
                            onClick={handleClick}
                        >
                            <div 
                                className='d-flex justify-content-start mr-1'
                                name={SWITCH_SEARCH_LIST}
                                value={false}
                            >
                                {searchKey && `${locale.texts.NOT_FOUND}`}
                                &nbsp;
                                <FontBoldDiv>
                                    {searchKey ? searchResult.filter(item => !item.found).length : ""}
                                </FontBoldDiv>
                                &nbsp;
                                {searchKey && locale.texts.OBJECTS}
                            </div>
                        </HoverWithUnderlineDiv>
                        <HoverDiv
                            onClick={handleShowDetail}
                            className="text-muted ml-auto d-flex align-items-center"
                            style={{
                                position: 'relative',
                                right: 0,
                                fontSize: '0.9rem'
                            }}
                        >
                            {locale.texts.DETAIL}
                            &nbsp;
                            <i 
                                className={`fas ${showDetail ? 'fa-angle-up' : 'fa-angle-down'}`}
                            />
                        </HoverDiv>

                    </Row>
                    <ToggleDisplayDiv
                        display={showDetail}
                        className="pt-1"
                    >
                        {Object.keys(searchResultMap).map((item, index) => {
                            return (
                                <Row
                                    className='text-capitalize'
                                >
                                    <JustifyCenterDiv
                                        className='mr-1'
                                    >
                                        {locale.texts.FOUND}
                                        &nbsp;
                                        <FontBoldDiv>
                                            {searchResultMap[item][1]}
                                        </FontBoldDiv>
                                        &nbsp;
                                        {item}
                                    </JustifyCenterDiv>
                                    &nbsp;
                                    <JustifyCenterDiv
                                        className='mr-1'
                                    >
                                        {locale.texts.NOT_FOUND}
                                        &nbsp;
                                        <FontBoldDiv>
                                            {searchResultMap[item][0] - searchResultMap[item][1]}
                                        </FontBoldDiv>
                                        &nbsp;
                                        {item}
                                    </JustifyCenterDiv>
                                </Row>
                            )
                        })} 
                    </ToggleDisplayDiv>
                </ReactBootstrapAlert>
            </CustomView> 
            <TabletView>
                <FontBoldDiv>
                    {searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                    {searchKey ? searchResult.filter(item => item.found).length : ""}
                    {searchKey 
                        ?   
                            locale.texts.OBJECTS
                        :   ""
                    }
                </FontBoldDiv>
            </TabletView>
        </Fragment>
    )
};

export default InfoPrompt