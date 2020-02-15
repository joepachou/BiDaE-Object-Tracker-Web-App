import React from 'react';
import { InputGroup, Button, Image, FormControl} from 'react-bootstrap';
import userProfileImg from '../../../../img/icon/userProfile.png';
import { AppContext } from '../../../context/AppContext';
import ImageUploader from 'react-images-upload';
import config from '../../../config';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';
import axios from 'axios';
import Collapsible from './Collapsible';
import dataSrc from "../../../dataSrc"
import {
    Row,
    Col,
} from "react-bootstrap"

class TranferredLocationManagement extends React.Component{

    static contextType = AppContext

    state= {
        
        transferredLocationOptions: [],
        unFoldBranches: []

    }

    columns = [
            {
              label: '',
              field: 'fold',
              sort: "asc",
              width: 200
            },
            {
              label: 'level',
              field: 'level',
              width: 200
            },
            {
              label: 'chinese',
              field: 'chinese',
              width: 200
            },
            {
                label: 'english',
                field: 'english',
                width: 200
              },
            {
                label: 'remove',
                field: 'remove',
                width: 200
            },
            {
                label: 'add',
                field: 'add',
                width: 200
            },
           
          ]

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentDidMount = () => {
        this.getTransferredLocation()
    }
   
    getTransferredLocation = () => {
        axios.get(dataSrc.getTransferredLocation)
            .then(res => {
                res.data.map(branch => {

                    if(!branch.offices){
                        branch.offices = []
                        
                    }
                    branch.english = branch.branch_name
                    branch.chinese = branch.branch_name,
                    branch.departments = branch.offices
                })
                this.setState({
                    transferredLocationOptions: res.data
                })
            }).catch(err => {
                console.log(err)
            })           
    }
    generateDataRows = () => {
        let rows = []
        this.state.transferredLocationOptions.map((branch)=> {
            rows.push({
                fold: <i 
                    className= {this.state.unFoldBranches.includes(branch.id) ?"fas fa-caret-down d-flex justify-content-center" : "fas fa-caret-right d-flex justify-content-center" }
                    style={{lineHeight:'100%', fontSize:'30px'}}
                    onClick = {this.changeFold.bind(this, branch.id)}></i>,
                level: <h6>branch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6>,
                chinese: <input 
                    type="text" 
                    value={branch.branch_name.chinese} 
                    onBlur={this.renameBranchToBackend.bind(this, branch.id, 'chinese')} 
                    onChange={this.renameBranchToState.bind(this, branch.id, 'chinese')} />,
                english: <input 
                    type="text" 
                    value={branch.branch_name.english} 
                    onBlur={this.renameBranchToBackend.bind(this, branch.id, 'english')} 
                    onChange={this.renameBranchToState.bind(this, branch.id, 'english')} />,
                
                
                remove: <i 
                    className="fas fa-minus d-flex justify-content-center" 
                    onClick={() => {this.removeBranch(branch.id)}}/>,
                add: <i 
                    className="fas fa-plus d-flex justify-content-center" 
                    onClick={() => {
                        this.addDepartment(branch.id)
                        this.changeFold(branch.id)
                    }}></i>,
            })
            if (this.state.unFoldBranches.includes(branch.id)) {
                let {departments} = branch
                departments.map( (department, index) => {
                    rows.push({
                        fold: null,
                        level: <h6>department</h6>,
                        chinese: <input 
                            type="text" 
                            value={department.chinese} 
                            onBlur={this.renameDepartmentToBackend.bind(this, branch.id, index, 'chinese')} 
                            onChange={this.renameDepartmentToState.bind(this, branch.id, index, 'chinese')}/>,
                        english: <input 
                            type="text" 
                            value={department.english} 
                            onBlur={this.renameDepartmentToBackend.bind(this, branch.id, index, 'english')} 
                            onChange={this.renameDepartmentToState.bind(this, branch.id, index, 'english')}/>,
                        
                        
                        remove: <i 
                            className="fas fa-minus d-flex justify-content-center" 
                            onClick={() => {this.removeDepartment(branch.id, index)}} />,
                        add:null,
                    })
                })
            }
            
        })
        return rows
    }
    changeFold = (id, e) => {
        if(this.state.unFoldBranches.includes(id)){
            this.setState({
                unFoldBranches:  this.state.unFoldBranches.filter(branch_id => branch_id !== id)  
            })
        }else{
            this.state.unFoldBranches.push(id)
            this.setState({})
        }
    }
    addBranch = (e) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'add branch',
            data: {
                name: {
                    chinese: '新醫院',
                    english: 'new hospital'
                }
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    renameBranchToState = (branch_id, language, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.branch_name[language] = newName
            }
        })
        this.setState({})
    }
    renameBranchToBackend = (branch_id, language, e) => {
        const newName = e.target.value
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'rename branch',
            data: {
                branch_id: branch_id,
                name: {
                    ...this.state.transferredLocationOptions.filter(branch => branch.id == branch_id)[0].branch_name,
                    [language]: newName
                }
                
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    removeBranch = (branch_id) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'remove branch',
            data: {
                branch_id,
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    addDepartment = (branch_id) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'add department',
            data: {
                branch_id,
                name: {
                    chinese: '新單位',
                    english: 'new department'
                }
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    renameDepartmentToState = (branch_id, index, language, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.offices[index][language] = newName
            }
        })
        this.setState({})
    }
    renameDepartmentToBackend = (branch_id, index, language, e) => {
        let newName = e.target.value
        let newNamePacakge = this.state.transferredLocationOptions.filter(branch => branch.id == branch_id)[0].offices[index]
        newNamePacakge[language] = newName
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'rename department',
            data: {
                branch_id,
                departmentIndex: index,
                name: newNamePacakge
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    removeDepartment = (branch_id, departmentIndex) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'remove department',
            data: {
                branch_id,
                departmentIndex
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }

    render(){
        let dataRows = this.generateDataRows()
        return(
            <Col lg={8}>
                <MDBTable autoWidth={false}
                >
                    <MDBTableHead columns={this.columns} />
                    <MDBTableBody rows={dataRows} color='#000000'/>
                </MDBTable>
           <Button variant="light" onClick={this.addBranch}>Add branch</Button>

            </Col>



        )
    }
}

export default TranferredLocationManagement;