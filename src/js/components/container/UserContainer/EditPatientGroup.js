import React from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import dataSrc from "../../../dataSrc";
// import AddableList from './AddableList'
import { AppContext } from '../../../context/AppContext';
import retrieveDataHelper from '../../../helper/retrieveDataHelper'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
    getName,
    getType,
    getACN
}from '../../../helper/descriptionGenerator';

import DualListBox from './DualListBox'
import apiHelper from '../../../helper/apiHelper';

const style = {
    list: {
        // wordBreak: 'keep-all',
        zIndex: 1
    },
    item: {
        minWidth: 35,
    },
}

class EditPatientGroup extends React.Component{

    static contextType = AppContext

    state = {
        selectedPatientGroup: null
    }
    componentDidMount = () => {
        this.getObjectData()
        this.getPatientGroup()
    }

    reload = () => {
        this.getObjectData()
        this.getPatientGroup()
    }
    
    newPatientGroup = (name) => {
        console.log(apiHelper, 'newwwww')
        apiHelper.deviceListApis.addDeviceList({
            name
        })
        .then(res => {
            this.reload()
        })
        .catch(err => {
            console.log('err when add patient group ', err)
        })
    }
    addPatientToGroup = (item) => {
        const groupId = this.state.selectedPatientGroup.id

        axios.post(dataSrc.modifyPatientGroup, {
            groupId: this.state.selectedPatientGroup.id,
            mode: 'add patient',
            item: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    removePatientFromGroup = (item) => {
        const groupId = this.state.selectedPatientGroup.id

        axios.post(dataSrc.modifyPatientGroup, {
            groupId: this.state.selectedPatientGroup.id,
            mode: 'remove patient',
            item: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    selectPatientGroup = (patientGroup) => {
        this.setState({
            selectedPatientGroup: patientGroup ? patientGroup.value : null
        })
    }
    getObjectData = () => {
        let { locale, auth } = this.context
        
        apiHelper.objectApiAgent.getObjectTable({
            locale: locale.abbr,
            areas_id: auth.user.areas_id,
            objectType: [0]
        })
        .then(res => {

            this.setState({
                allPatients: res.data.rows.filter(object => object.object_type != 0)
            })
        }).catch(function (error) {

            console.log(error);

        })
    }
    patientGroupListToSelectOptions = (data) => {
        const options = data.map(option =>
            { 
                return {
                    label: option.name,
                    value: option
            }})

        return options
    }
    getPatientGroup = () => {
        axios.post(dataSrc.getPatientGroup, {})
        .then(res => {
            const data = res.data.map(group => {
                return {
                    ...group,
                    patients: group.patients || []
                }
            })
            const updatedSelectedPatientGroup = data.filter(group => {
                if(this.state.selectedPatientGroup){
                    if(group.id == this.state.selectedPatientGroup.id){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            })[0]

            this.setState({
                patientGroupList: data,
                patientGroupListOptions: this.patientGroupListToSelectOptions(data),
                selectedPatientGroup: updatedSelectedPatientGroup
            })
        })
        .catch(err => {
            console.log('err when get patient group ', err)
        })
    }
    
    render() {
        const { locale } = this.context

        return (
            <div
                className="text-capitalize"
                style={{
                    height: this.state.selectedPatientGroup ? '80vh' : '10vh',
                }}
            >
                <CreatableSelect
                    isClearable
                    onChange={this.selectPatientGroup}
                    onCreateOption={this.newPatientGroup}
                    options={this.state.patientGroupListOptions}
                    value={this.state.selectedPatientGroup
                        ?
                            {
                                value: this.state.selectedPatientGroup,
                                label: this.state.selectedPatientGroup.name
                            }
                        :
                            null
                    }
                />
                {
                    this.state.selectedPatientGroup 
                    ?
                        <DualListBox
                            allItems={this.state.allPatients || []}
                            selectedItemList={this.state.selectedPatientGroup ? this.state.selectedPatientGroup.patients : []}
                            selectedTitle = 'Patients In List'
                            unselectedTitle = 'Other Patients'
                            onSelect = {this.addPatientToGroup}
                            onUnselect = {this.removePatientFromGroup}
                        />
                    :
                        null
                }
                
            </div>
        )
    }
}

export default EditPatientGroup