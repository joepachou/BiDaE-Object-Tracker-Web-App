/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        FrequentSearch.js

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


import React  from 'react';
import { 
    Button 
} from 'react-bootstrap';
import AccessControl from '../authentication/AccessControl';
import { AppContext } from '../../context/AppContext';
import {
    SEARCH_HISTORY,
    ALL_DEVICES,
    ALL_PATIENTS,
    MY_DEVICES,
    MY_PATIENTS
} from '../../config/wordMap';
import {
    Title
} from '../BOTComponent/styleComponent';

class FrequentSearch extends React.Component {

    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
    }

    handleClick = (e) => {
        const {
            name,
            value
        } = e.target

        let searchKey = {
            type: name,
            value,
        }
        this.props.getSearchKey(searchKey)
        this.setState({
            searchKey,
        })
    }

    render() {
        const { 
            locale, 
            auth 
        } = this.context

        const {
            searchObjectArray,
            pinColorArray
        } = this.props

        const style = {
            list: {
                maxHeight: 450,
                overflow: "hidden scroll"
            }
        }
        
        return (
            <div id='frequentSearch' >
                <Title list> 
                    {locale.texts.FREQUENT_SEARCH}
                </Title>
                <div style={style.list} className="d-inline-flex flex-column searchOption">
                    <div
                        style={{
                            maxHeight: 350,
                            overflow: "hidden scroll"
                        }}
                    >
                        {auth.authenticated && auth.user.searchHistory &&
                            auth.user.searchHistory
                                .filter( (item,index) => {
                                    return index < auth.user.freqSearchCount
                                })
                                .map((item, index) => {

                                    let pinColorIndex = searchObjectArray.indexOf(item.name)

                                    return (
                                        <Button
                                            variant="outline-custom"
                                            className="text-none"
                                            onClick={this.handleClick} 
                                            style={{
                                                color: pinColorIndex > -1 ? pinColorArray[pinColorIndex] : null
                                            }}
                                            // active={this.state.searchKey === item.name.toLowerCase()} 
                                            key={index}
                                            name={SEARCH_HISTORY}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </Button>
                                    )
                        })}
                    </div>
                  
                    <hr/>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name={ALL_DEVICES}
                    >
                        {locale.texts.ALL_DEVICES}
                    </Button>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick}
                        // active={this.state.searchKey === 'all devices'}
                        name={ALL_PATIENTS}
                    >
                        {locale.texts.ALL_PATIENTS}
                    </Button>
                    <AccessControl
                        permission={'user:mydevice'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            // active={this.state.searchKey === 'my devices'}
                            name={MY_DEVICES}
                        >
                            {locale.texts.MY_DEVICES}
                        </Button>
                    </AccessControl>
                    <AccessControl
                        permission={'user:mypatient'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick}
                            name={MY_PATIENTS}
                        >
                            {locale.texts.MY_PATIENTS}
                        </Button>
                    </AccessControl>
                </div>
            </div>
        )
    }
}

export default FrequentSearch;

