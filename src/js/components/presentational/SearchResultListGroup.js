/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchResultListGroup.js

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
import { ListGroup } from 'react-bootstrap';
import config from '../../config';
import { AppContext } from '../../context/AppContext';
import { 
    getDescription, 
    getMacaddress,
    getRSSI,
    getUpdatedByNLbeacons
} from '../../helper/descriptionGenerator';
import {
    countNumber
} from '../../helper/dataTransfer';
import {
    ALL_DEVICES,
    ALL_PATIENTS,
    OBJECT_TYPE
} from '../../config/wordMap';
import {
    ASSIGN_OBJECT
} from '../../reducer/action';


const SearchResultListGroup = ({
    data,
    onSelect,
    selection,
    disabled,
    action,
    searchObjectArray,
    pinColorArray,
    searchKey,
    onClick
}) => {

    const { 
        locale,
        stateReducer
    } = React.useContext(AppContext);

    let numberSheet = {};
   
    const style = {
        icon: {
            color: '#007bff',
            top: 10
        },
        item: {
            minWidth: 35,
        },
        listGroup: {
            color: 'rgb(33, 37, 41)',
        }
    }

    const onMouseOver = (e, value) => {
        let [{}, dispatch] = stateReducer;
        dispatch({
            type: ASSIGN_OBJECT,
            value,
        })
    }

    const onMouseOut = () => {
        let [{}, dispatch] = stateReducer;
        dispatch({
            type: ASSIGN_OBJECT,
            value: null,
        })
    }

    const createItem = (searchKey, item, index) => {
        switch(searchKey.type) {
            case ALL_DEVICES: 
            case ALL_PATIENTS:
                return <p className='d-inline-block'>&bull;</p>;
            case OBJECT_TYPE:
                return (
                    <div className='d-inline-block'>
                        <div
                            style={{
                                height: '25px',
                                width: '25px',
                                borderRadius: '50%',
                                background: searchObjectArray.includes(item.type) ? pinColorArray[searchObjectArray.indexOf(item.type)] : null,
                                display: 'flex',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            {countNumber(searchKey, item, numberSheet)}
                        </div>
                    </div>
                )
            default: 
                return <p className='d-inline-block'>{index + 1}.</p>;
        }
    }

    return (
        <ListGroup 
            onSelect={onSelect} 
        >
            {data.map((item,index) => {
                let element = 
                    <ListGroup.Item 
                        href={'#' + index} 
                        eventKey={item.found + ':'+ index} 
                        onMouseOver={(e) => onMouseOver(e, item.mac_address)}
                        onMouseOut={onMouseOut}
                        key={index} 
                        action={action}
                        active
                        style={style.listGroup}
                        className='d-flex py-1 text-left justify-content-start' 
                    >   
                        <div 
                            style={style.item}
                            className='d-flex justify-content-center'
                        >
                            {createItem(searchKey, item, index)}
                        </div>
                        {getDescription(item, locale, config)}
                        {getMacaddress(item, locale)}
                        {getRSSI(item, locale)}
                        {getUpdatedByNLbeacons(item, locale)}
                    </ListGroup.Item>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup