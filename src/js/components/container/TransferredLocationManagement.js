/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TransferredLocationManagement.js

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
    Button, 
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import config from '../../config';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';
import {
    Row,
    Col,
} from "react-bootstrap"
import { 
    TransferredLocationColumn
} from '../../config/tables'
import messageGenerator from '../../helper/messageGenerator';
import apiHelper from '../../helper/apiHelper';
import { JSONClone } from '../../helper/utilities';

class TranferredLocationManagement extends React.Component{

    static contextType = AppContext 

    state = { 
        transferredLocationOptions: [],
        unFoldBranches: [], 
    } 
    
    componentDidMount = () => {
        this.getColumn()
        this.getTransferredLocation()
    }
   
    getTransferredLocation = () => {
        apiHelper.transferredLocationApiAgent.getAllTransferredLocation()
            .then(res => {
                res.data.map(branch => {
                    if(!branch.department){
                        branch.department = []                       
                    }
                })
                this.setState({
                    transferredLocationOptions: res.data
                })
            }).catch(err => {
                console.log(err)
            })           
    }

    getColumn = () => {
        const { locale } = this.context
        let column = JSONClone(TransferredLocationColumn);
        column.map(item => {
            item.headerStyle = {
                textAlign: 'left',
            }
            item.label = locale.texts[item.field.toUpperCase().replace(/ /g, '_')]
        })  
        return column
    }

    generateDataRows = () => {
        const { locale } = this.context
        let rows = []
        this.state.transferredLocationOptions.map((branch)=> {
            rows.push({
                fold: <i 
                    className= {this.state.unFoldBranches.includes(branch.id) ?"fas fa-caret-down d-flex justify-content-center" : "fas fa-caret-right d-flex justify-content-center" }
                    style={{lineHeight:'100%', fontSize:'30px'}}
                    onClick = {this.changeFold.bind(this, branch.id)}></i>,
                level: <h6>{locale.texts.BRANCH}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6>,
                name: <input 
                    type="text" 
                    value={branch.branch_name} 
                    onBlur={this.renameBranchToBackend.bind(this, branch.id)} 
                    onChange={this.renameBranchToState.bind(this, branch.id)} />,
                remove: <i 
                    className="fas fa-minus d-flex justify-content-center" 
                    onClick={() => {this.removeBranch(branch.id)}}/>,
                add: <i 
                    className="fas fa-plus d-flex justify-content-center" 
                    onClick={() => {
                        this.addDepartment(branch.id)
                        this.unfold(branch.id)
                    }}></i>,
            })
            if (this.state.unFoldBranches.includes(branch.id)) {
                let {department} = branch
                department.map( (department, index) => {
                    rows.push({
                        fold: null,
                     level: <h6>{locale.texts.DEPARTMENT}</h6>,
                        name: <input 
                            type="text" 
                            value={department} 
                            onBlur={this.renameDepartmentToBackend.bind(this, branch.id, index)} 
                            onChange={this.renameDepartmentToState.bind(this, branch.id, index)}/>,
                        remove: <i 
                            className="fas fa-minus d-flex justify-content-center" 
                            onClick={() => {  
                                if (branch.department.length > 1){
                                    this.removeDepartment(branch.id, index)
                                }else{ 
                                    let callback = () => messageGenerator.setErrorMessage(
                                                        'ALEAST_ONE_DEPARTMENT'
                                                    )    
                                   callback()
                                } 
                            }} />,
                        add:null,
                    })
                })
            }
            
        })
        return rows
    }
    unfold = (id) => {
        if(!this.state.unFoldBranches.includes(id)){
            this.state.unFoldBranches.push(id)
            this.setState({})
        }
    }
    fold = (id) => {
        this.setState({
            unFoldBranches:  this.state.unFoldBranches.filter(branch_id => branch_id !== id)  
        })
    }
    changeFold = (id) => {
        if(this.state.unFoldBranches.includes(id)){
            this.fold(id)
        }else{
            this.unfold(id)
        }      
    }
    addBranch = (e) => {
        const { 
            locale 
        } = this.context
        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'add branch',
            data: {
                name: locale.texts.NEW_BRANCH,
                departmentName: locale.texts.NEW_DEPARTMENT
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }
    renameBranchToState = (branch_id, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.branch_name = newName
            }
        })
        this.setState({})
    }
    renameBranchToBackend = (branch_id, e) => {
        const newName = e.target.value

        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'rename branch',
            data: {
                branch_id: branch_id,
                name: newName
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }
    removeBranch = (branch_id) => {
        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'remove branch',
            data: {
                branch_id,
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }
    addDepartment = (branch_id) => {
        const { 
            locale
        } = this.context

        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'add department',
            data: {
                branch_id,
                name: locale.texts.NEW_DEPARTMENT
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }
    renameDepartmentToState = (branch_id, index, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.department[index] = newName
            }
        })
        this.setState({})
    }
    renameDepartmentToBackend = (branch_id, index, e) => {
        let newName = e.target.value

        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'rename department',
            data: {                                   
                branch_id,
                departmentIndex: index,
                name: newName
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }
    removeDepartment = (branch_id, departmentIndex) => { 

        apiHelper.transferredLocationApiAgent.editTransferredLocation({
            type: 'remove department',
            data: {
                branch_id,
                departmentIndex
            }
        })
        .then(res => {
            this.getTransferredLocation()
        })
    }

    render(){  
        const { locale } = this.context
        let dataRows = this.generateDataRows() 
        let column = this.getColumn()  
        return(
            <Col lg={8}>
                <MDBTable autoWidth={false}
                >
                    <MDBTableHead columns={column} />
                    <MDBTableBody rows={dataRows} color='#000000'/>
                </MDBTable>
           <Button variant="light" onClick={this.addBranch}>{locale.texts.ADD_BRANCH}</Button>
            </Col> 
        )
    }
}

export default TranferredLocationManagement;