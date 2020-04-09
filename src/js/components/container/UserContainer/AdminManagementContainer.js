import React from 'react';
import { 
    ButtonToolbar,
    Button
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import {
    getUserList,
    getRoleNameList,
    deleteUser,
    getMainSecondArea,
} from "../../../dataSrc";
import { userInfoTableColumn } from '../../../tables'
import EditUserForm from './EditUserForm';
import { AppContext } from '../../../context/AppContext';
import DeleteUserForm from './DeleteUserForm'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm';
import config from '../../../config';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import styleConfig from '../../../config/styleConfig';
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
        title: '',
        locale: this.context.locale.abbr,
        showDeleteConfirmation:false,
        deleteUserName:'',
        areaTable: [],
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getRoleNameList()
            this.getUserList()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getRoleNameList()
        this.getUserList()
        this.getAreaTable()
    }

    getUserList = () => {
        let { 
            locale
        } = this.context
        axios.post(getUserList, {
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
                item._id = index + 1
                item.roles = item.role_type.map(role => locale.texts[role.toUpperCase()]).join(',')
                item.area_ids = item.area_ids
                    .filter(area =>  area.id != item.main_area)
                    .map(area => {
                        return locale.texts[area.value]
                    })
                    .join('/')
                item.main_area = locale.texts[item.area_name]
            })
            this.setState({
                data: res.data.rows,
                columns,
                showModifyUserInfo: false,
                showAddUserForm: false,
                showDeleteUserForm:false,
                showDeleteConfirmation:false,
                deleteUserName:'',
                selectedUser: null,

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

    getAreaTable = () => {
        retrieveDataHelper.getAreaTable()
            .then(res => {
                this.setState({
                    areaTable: res.data.rows
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    handleSubmit = (values) => {
        let {
            auth
        } = this.context

        let {
            api,
            selectedUser
        } = this.state 

        let user = {
            ...auth.user,
            ...values,
            id: selectedUser ? selectedUser.id : null,
            areas_id: auth.user.areas_id,
            main_area: values.area.id
        }

        let index = auth.user.areas_id.indexOf(auth.user.main_area)
        user.areas_id.splice(index, 1)
        if (!user.areas_id.includes(user.area.id)) {
            user.areas_id.push(user.area.id)
        }

        this.setState({ showAddUserForm: false  })
 
        auth[api](user, () => {
            this.getUserList()
        }) 
        setTimeout(function() { 
            this.getUserList()
        }.bind(this),500)
        
        // values.id = selectedUser ? selectedUser.id : null

        // auth[api](values)
        //     .then(res => {
        //         this.getUserList()
        //         this.setState({
        //             showModifyUserInfo: false,
        //             showAddUserForm: false,
        //             showDeleteUserForm:false,
        //             showDeleteConfirmation:false,
        //             deleteUserName:'',
        //             selectedUser: null,
        //         })
        //     })
        //     .catch(err => {
        //         console.log(`${api} failed ${err}`)
        //     })
    }

    handleDeleteUserSubmit = (e) => {
        this.setState({   
            showDeleteConfirmation : true, 
            deleteUserName : e.name.label
        })
    }

    handleWarningChecked = () => {
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
    }

    handleClose = () => {
        this.setState({
            showAddUserForm: false,
            showDeleteUserForm: false,
            selectedUser: null,
            title: '',
            api: '',
            showDeleteConfirmation: false,
            deleteUserName:'',
        })
    }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: (e, handleOriginal) => {
                
                axios.post(getMainSecondArea, {
                    username: rowInfo.original.name
                })
                .then(res => { 
                    rowInfo.original.second_area = res.data.rows[0].second_area
                    rowInfo.original.main_area = res.data.rows[0].main_area 
                    this.setState({
                        showAddUserForm: true,
                        selectedUser: rowInfo.original,
                        title: 'edit user',
                        api: 'setUser',
                    })
                })
                .catch(err => {
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
                    className="-highlight text-none"
                    style={{height:'75vh'}}
                    {...styleConfig.reactTable}
                    getTrProps={this.onRowClick}
                    // getTrGroupProps={(state, rowInfo, column, instance) => { 
                    //     return { 
                    //         onMouseEnter: (e, handleOriginal) =>{
                    //             console.log(123)
                    //         }}
                    // }}
                />

                <EditUserForm
                    show={this.state.showAddUserForm}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    title={title}
                    selectedUser={this.state.selectedUser}
                    roleName={this.state.roleName}
                    data = {this.state.data} 
                    areaTable={this.state.areaTable}
                />

                <DeleteUserForm
                    show={this.state.showDeleteUserForm}
                    title={locale.texts.DELETE_USER}
                    handleClose={this.handleClose}
                    data = {this.state.data}
                    handleSubmit = {this.handleDeleteUserSubmit}
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