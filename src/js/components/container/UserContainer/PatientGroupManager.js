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

class PatientGroupManager extends React.Component{

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
        apiHelper.patientGroupListApis.addPatientGroupList({
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
        console.log(item)
        apiHelper.patientGroupListApis.modifyPatientGroupList({
            groupId: this.state.selectedPatientGroup.id,
            mode: 0,
            itemACN: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    removePatientFromGroup = (item) => {
        const groupId = this.state.selectedPatientGroup.id

        apiHelper.patientGroupListApis.modifyPatientGroupList({
            groupId: this.state.selectedPatientGroup.id,
            mode: 1,
            itemACN: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    renameGroup = (newName) => {
        const groupId = this.state.selectedPatientGroup.id

        apiHelper.patientGroupListApis.modifyPatientGroupList({
            groupId: this.state.selectedPatientGroup.id,
            mode: 2,
            newName: newName
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
            objectType: [1, 2]
        })
        .then(res => {
            this.setState({
                allPatients: res.data.rows
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
        apiHelper.patientGroupListApis.getPatientGroupList()
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
        console.log(this.state.allPatients)
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

export default PatientGroupManager