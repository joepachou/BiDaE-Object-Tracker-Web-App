import React from 'react';
import { 
    ButtonToolbar,
    Button
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import {
    getUserList,
    getUserRole,
    getRoleNameList,
    deleteUser,
    getUserArea,
    getMainSecondArea
} from "../../../dataSrc";
import { userInfoTableColumn } from '../../../tables'
import EditUserForm from './EditUserForm';
import { AppContext } from '../../../context/AppContext';
import DeleteUserForm from '../UserContainer/DeleteUserForm'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm';
const Fragment = React.Fragment;

class AdminManagementContainer extends React.Component{

    static contextType = AppContext

    state = {
        showAddUserForm: false,
        showDeleteUserForm:false,
        data: [],
        columns: [],
        selectedUser: null,
        roleName: [],
        areaList: [],
        title: '',
        locale: this.context.locale.abbr,
        showDeleteConfirmation:false,
        deleteUserName:''
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getRoleNameList()
            this.getUserList()
            this.getAreaList()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getRoleNameList()
        this.getUserList()
        this.getAreaList()
    }


    getUserList = () => {


        let { 
            locale
        } = this.context
        axios.post(getUserList,{
            locale: locale.abbr 
        }).then(res => {
            let columns = _.cloneDeep(userInfoTableColumn)
            columns.map((field, index) => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.headerStyle = {
                    textAlign: 'left',
                    textTransform: 'capitalize'
                }
            })
           
            res.data.rows.map((item, index) => {
                item.id = index + 1
                item.roles = item.role_type.map(role => locale.texts[role.toUpperCase()]).join(',')
            })
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
    }

    getRoleNameList = () => {
        axios.post(getRoleNameList,{
            }).then(res => {
                let rows = _.cloneDeep(res.data.rows)
                rows.filter(item => item.name !== "guest" )
                this.setState({
                    roleName: res.data.rows
                })
            })
    }


    getAreaList = () => {
        let {auth} = this.context
        axios.post(getUserArea,{
            user_id: auth.user.id
        }).then(res => {
           this.setState({  areaList: res.data.rows  })
        })
    }


    handleSubmit = (values) => {
        let {
            auth
        } = this.context

        let {
            api
        } = this.state 
        auth[api](values)
            .then(res => {
                this.getUserList()
                this.setState({
                    showModifyUserInfo: false,
                    showAddUserForm: false,
                    showDeleteUserForm:false,
                    showDeleteConfirmation:false,
                    deleteUserName:''
                })
                // this.getUserList()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleDeleteUserSubmit = (e) => {
        this.setState({   
            showDeleteConfirmation : true, 
            deleteUserName : e.name.label
        })
    }

    handleWarningChecked = () => [


        axios.post(deleteUser, {
            username: this.state.deleteUserName
        })
        .then(res => {
            this.getUserList()
            this.handleClose()
        })
        .catch(err => {
            console.log("delete User fail : " + err);
        })


    ]

    submitDeleteUserForm = () => {

        axios.post(deleteUser, {
            username: this.state.selectedUser.name
        }).then((res)=>{
            this.setState({
                showModifyUserInfo: false, 
            });
            setTimeout(
                this.getUserList(),1000
            )
        }).catch(err => {
            console.log(`delete user fail! ${err}`)
        })
    }

    handleClose = () => {
        this.setState({
            showAddUserForm: false,
            showDeleteUserForm:false,
            selectedUser: null,
            title: '',
            api: '',
            showDeleteConfirmation:false,
            deleteUserName:''
        })
    }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: (e, handleOriginal) => {
     
                axios.post(getMainSecondArea, {
                    username: rowInfo.original.name
                }).then((res)=>{ //抓主要跟次要地區
                    rowInfo.original.second_area = res.data.rows[0].second_area
                    rowInfo.original.main_area = res.data.rows[0].main_area
                    this.setState({
                            showAddUserForm: true,
                            selectedUser: rowInfo.original,
                            title: 'edit user',
                            api: 'setUser',
                    })
                }).catch(err => {
                    console.log(`get Main Second Area fail! ${err}`)
                })

              

            }
        }
    }

    handleClick = (e, value) => {

        switch (e.target.name) {
            case "add user":
                this.setState({
                    showAddUserForm: true,
                    title: 'add user',
                    api: 'signup',
                })
              break;

            case "delete user":
              this.setState({
                showDeleteUserForm:true
              })
              break;
          }
    }

    render(){
        const {
            locale
        } = this.context

        const {
            title
        } = this.state

        return (
            <Fragment>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 mr-1'
                        name="add user"
                        onClick={this.handleClick}    
                    >
                        {locale.texts.ADD_USER}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1'
                        name="delete user"
                        onClick={this.handleClick}    
                    >
                        {locale.texts.DELETE_USER}
                    </Button>
                </ButtonToolbar>
                
                <ReactTable 
                    data = {this.state.data} 
                    columns = {this.state.columns} 
                    noDataText="No Data Available"
                    className="-highlight"
                    style={{height:'75vh'}}
                    getTrProps={this.onRowClick}
                />
                <EditUserForm
                    show={this.state.showAddUserForm}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    title={title}
                    selectedUser={this.state.selectedUser}
                    roleName={this.state.roleName}
                    areaList={this.state.areaList}
                />

                <DeleteUserForm
                    show={this.state.showDeleteUserForm}
                    title={locale.texts.DELETE_USER}
                    handleClose={this.handleClose}
                    data = {this.state.data}
                    handleSubmit = { this.handleDeleteUserSubmit}
                />

                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleWarningChecked}
                />


            </Fragment>
        )
    }
}

export default AdminManagementContainer