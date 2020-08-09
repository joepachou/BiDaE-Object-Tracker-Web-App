import React from 'react';
import { 
    Col, 
    Row,
    Button, 
    ButtonToolbar,
    Modal,
    Form
} from 'react-bootstrap';
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

class DeviceGroupManager extends React.Component{

    static contextType = AppContext
    reNameRef = React.createRef()
    state = {
        selectedDeviceGroup: null,
        renameGroup: false
    }
    componentDidMount = () => {
        this.getObjectData()
        this.getDeviceGroup("Mount")
    }

    reload = () => {
        this.getObjectData()
        this.getDeviceGroup()
    }
    
    newDeviceGroup = (name) => {
        apiHelper.deviceGroupListApis.addDeviceGroupList({
            name
        })
        .then(res => {
            console.log('successs', res.data)
            this.setState({
                selectedDeviceGroup: {id:res.data}
            })
            this.reload()
        })
        .catch(err => {
            console.log('err when add device group ', err)
        })
    }
    addDeviceToGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id
        apiHelper.deviceGroupListApis.modifyDeviceGroupList({
            groupId: this.state.selectedDeviceGroup.id,
            mode: 0,
            itemACN: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    removeDeviceFromGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id

        apiHelper.deviceGroupListApis.modifyDeviceGroupList({
            groupId: this.state.selectedDeviceGroup.id,
            mode: 1,
            itemACN: item.asset_control_number
        }).then(res => {
            this.reload()
        }).catch(err => 
            console.log(err)
        )
    }
    renameGroup = (newName) => {
        const groupId = this.state.selectedDeviceGroup.id

        apiHelper.deviceGroupListApis.modifyDeviceGroupList({
            groupId: this.state.selectedDeviceGroup.id,
            mode: 2,
            newName: newName
        }).then(res => {
            this.reload()
            this.setState({
                renameGroup: false
            })
        }).catch(err => 
            console.log(err)
        )
    }
    deleteGroup = () => {
        apiHelper.deviceGroupListApis.deleteGroup({
            groupId: this.state.selectedDeviceGroup.id,
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

    selectDeviceGroup = (deviceGroup) => {
        this.setState({
            selectedDeviceGroup: deviceGroup ? deviceGroup.value : null
        })
    }
    getObjectData = (isMount) => {
        let { locale, auth } = this.context
        apiHelper.objectApiAgent.getObjectTable({
            locale: locale.abbr,
            areas_id: auth.user.areas_id,
            objectType: [0]
        })
        .then(res => {
            console.log(res.data.rows)
            this.setState({
                allDevices: res.data.rows
            })

        }).catch(function (error) {

            console.log(error);

        })
    }
    getDeviceGroup = (isMount) => {
        apiHelper.deviceGroupListApis.getDeviceGroupList()
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
                selectedDeviceGroup: isMount == "Mount" ?data[0]:updatedSelectedDeviceGroup
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
                <Modal
                  show={this.state.renameGroup}
                  onHide={() => {this.setState({renameGroup: false})}}>
                  <Modal.Header closeButton>
                      <Modal.Title>{locale.texts.RENAME}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Col} >
                          <Form.Control type="text" ref={this.reNameRef}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={()=>{console.log(this.reNameRef.current.value);this.renameGroup(this.reNameRef.current.value)}}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                </Modal>
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
                        <>
                            <ButtonToolbar
                                className='my-2'
                            >
                                <Button 
                                    variant='outline-primary' 
                                    className='text-capitalize mr-2'
                                    name='secondaryArea'
                                    size='sm'
                                    onClick={() => {this.setState({renameGroup: true})}}
                                >
                                    {locale.texts.EDIT_DEVICE_GROUP_NAME}
                                </Button>
                                <Button 
                                    variant='outline-primary' 
                                    className='text-capitalize mr-2'
                                    name='password'
                                    size='sm'
                                    onClick={this.deleteGroup}
                                >
                                    {locale.texts.REMOVE_DEVICE_GROUP}
                                </Button> 
                            </ButtonToolbar>
                            <DualListBox
                                allItems={this.state.allDevices || []}
                                selectedItemList={this.state.selectedDeviceGroup ? this.state.selectedDeviceGroup.items : []}
                                selectedTitle = 'Devices In List'
                                unselectedTitle = 'Other Devices'
                                onSelect = {this.addDeviceToGroup}
                                onUnselect = {this.removeDeviceFromGroup}
                            />
                        </>
                    :
                        null
                }
                
            </div>
        )
    }
}

export default DeviceGroupManager 