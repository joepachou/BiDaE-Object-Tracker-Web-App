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
        
        transferredLocationOptions: []

    }

    columns = [
            {
              label: 'level',
              field: 'level',
            },
            {
              label: 'chinese',
              field: 'chinese',
            },
            {
                label: 'english',
                field: 'english',
              },
            // {
            //   label: 'fold/unfold',
            //   field: 'fold_unfold',
            //   sort: 'asc'
            // },

            {
                label: 'remove',
                field: 'remove',
            },
            {
                label: 'add',
                field: 'add',
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
                console.log(res.data)
                res.data.map(branch => {

                    console.log(branch)
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
        this.state.transferredLocationOptions.map((branch , index)=> {
            rows.push({
                
                level: 'branch',
                english: <input type="text" value={branch.english} onChange={this.renameBranch} name={branch.id}/>,
                chinese: <input type="text" value={branch.chinese} onChange={this.renameBranch} name={branch.id}/>,
                
                remove: <i className="fas fa-minus" onClick={() => {this.removeBranch(branch.id)}}></i>,
                add: <i className="fas fa-plus" onClick={() => {this.addDepartment(branch.id)}}></i>,
            })

            let {departments} = branch
            console.log(departments)
            departments.map( (department, index) => {
                rows.push({
                    
                    level: 'department',
                    english: department.english,
                    chinese: department.chinese,
                    
                    remove: <i className="fas fa-minus" onClick={() => {this.removeDepartment(branch.id, index)}}></i>,
                    add:null,
                })
            })
        })
        return rows
    }
    addBranch = (e) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'add branch',
            data: {
                name: 'new Hospital'
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    renameBranch = (e) => {
        const name = e.target.value, branch_id = e.target.name
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'rename branch',
            data: {
                branch_id: branch_id,
                name: name
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
                chinese_name:'新單位',
                english_name:'new department'
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
        console.log('render')
        let dataRows = this.generateDataRows()
        return(
            <Col lg={8}>
                <MDBTable>

                    <MDBTableHead columns={this.columns} />
                    <MDBTableBody rows={dataRows} />
                </MDBTable>
                
   
           <Button variant="light" onClick={this.addBranch}>Add branch</Button>

            </Col>



        )
    }
}

export default TranferredLocationManagement;