import React from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import dataSrc from "../../../dataSrc";
// import AddableList from './AddableList'
import { AppContext } from '../../../context/AppContext';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
    getName,
    getType,
    getACN
}from '../../../helper/descriptionGenerator';
import apiHelper from '../../../helper/apiHelper';

import DualListBox from './DualListBox'

const style = {
    list: {
        // wordBreak: 'keep-all',
        zIndex: 1
    },
    item: {
        minWidth: 35,
    },
}

class EditDeviceGroup extends React.Component{

    static contextType = AppContext

    state = {
        selectedDeviceGroup: null
    }
    componentDidMount = () => {
        this.getObjectData()
        this.getDeviceGroup()
    }

    reload = () => {
        this.getObjectData()
        this.getDeviceGroup()
    }
    
    newDeviceGroup = (name) => {
        console.log(apiHelper, 'newwwww')
        apiHelper.deviceListApis.addDeviceList({
            name
        })
        .then(res => {
            this.reload()
        })
        .catch(err => {
            console.log('err when add device group ', err)
        })
    }
    addDeviceToGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id

        axios.post(dataSrc.modifyDeviceGroup, {
            groupId: this.state.selectedDeviceGroup.id,
            mode: 'add device',
            item: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    deviceGroupListToSelectOptions = (data) => {
        const options = data.map(option =>
            { 
                return {
                    label: option.name,
                    value: option
            }})

        return options
    }
    removeDeviceFromGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id

        axios.post(dataSrc.modifyDeviceGroup, {
            groupId: this.state.selectedDeviceGroup.id,
            mode: 'remove device',
            item: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    selectDeviceGroup = (deviceGroup) => {
        this.setState({
            selectedDeviceGroup: deviceGroup ? deviceGroup.value : null
        })
    }
    getObjectData = () => {
        let { locale, auth } = this.context
        
        retrieveDataHelper.getObjectTable(locale.lang, auth.user.areas_id, [0])
        .then(res => {
            
            this.setState({
                allDevices: res.data.rows.filter(object => object.object_type == 0)
            })
        }).catch(function (error) {

            console.log(error);

        })
    }
    getDeviceGroup = () => {
        axios.post(dataSrc.getDeviceGroup, {})
        .then(res => {
            const data = res.data.map(group => {
                return {
                    ...group,
                    devices: group.devices || []
                }
            })
            const updatedSelectedDeviceGroup = data.filter(group => {
                if(this.state.selectedDeviceGroup){
                    if(group.id == this.state.selectedDeviceGroup.id){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            })[0]

            this.setState({
                deviceGroupList: data,
                deviceGroupListOptions: this.deviceGroupListToSelectOptions(data),
                selectedDeviceGroup: updatedSelectedDeviceGroup
            })
        })
        .catch(err => {
            console.log('err when get device group ', err)
        })
    }
    
    render() {
        const { locale } = this.context

        return (
            <div
                className="text-capitalize"
                style={{height: this.state.selectedDeviceGroup ? '80vh':'10vh'}}
            >
                <CreatableSelect
                    isClearable
                    onChange={this.selectDeviceGroup}
                    onCreateOption={this.newDeviceGroup}
                    options={this.state.deviceGroupListOptions}
                    value={this.state.selectedDeviceGroup
                        ?
                            {
                                value: this.state.selectedDeviceGroup,
                                label: this.state.selectedDeviceGroup.name
                            }
                        :
                            null
                    }
                />
                {
                    this.state.selectedDeviceGroup 
                    ?
                        <DualListBox
                            allItems={this.state.allDevices || []}
                            selectedItemList={this.state.selectedDeviceGroup ? this.state.selectedDeviceGroup.devices : []}
                            selectedTitle = 'Devices In List'
                            unselectedTitle = 'Other Devices'
                            onSelect = {this.addDeviceToGroup}
                            onUnselect = {this.removeDeviceFromGroup}
                        />
                    :
                        null
                }
                
            </div>
        )
    }
}

export default EditDeviceGroup