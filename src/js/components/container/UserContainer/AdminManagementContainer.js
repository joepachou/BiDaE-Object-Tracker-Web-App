import React from 'react';
import { 
    Col, 
    Row, 
    ListGroup,
    ButtonToolbar,
    Button
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";
import AddableList from './AddableList'
import ModifyUserInfo from './ModifyUserInfo'
import RemoveUserConfirmForm from './RemoveUserConfirmForm'
import { userInfoTableColumn } from '../../../tables'
import AddUserForm from '../AddUserForm';
const Fragment = React.Fragment;

class AdminManagementContainer extends React.Component{
    state = {
           data: [],
           columns: [],
           selectedUser: '',
           userRole: null,
           locale: this.context.abbr,
           showModifyUserInfo: false,
           showAddUserForm: false,
           roleName: [],
    }
    staticParamter = {
        roleName : []
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getRoleNameList()
            this.getUserList()
            this.setState({
                locale: this.context.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getRoleNameList()
        this.getUserList()
    }

    getUserList = () => {
        let locale = this.context
        axios.post(dataSrc.getUserList,{
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
                item.role_type = locale.texts[item.role_type.toUpperCase()]
            })
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
    }
    getUserRole = (selectedUser, callBack) => {
        if(selectedUser){
            axios.post(dataSrc.getUserRole,{
                username: selectedUser.name
            }).then((res) => {
                var userRole = ''
                if(res.data.length !== 0){
                    userRole = res.data.rows[0].name
                }
                callBack(userRole)
            })
        }
        
    }

    getRoleNameList = () => {
        axios.post(dataSrc.getRoleNameList,{
        }).then(res => {
            let rows = _.cloneDeep(res.data.rows)
            rows.filter(item => item.name !== "guest" )
            this.setState({
                roleName: res.data.rows
            })
            // this.staticParamter.roleName = res.data.rows
        })
    }
    
    onClickUser = (index) => {
        this.getUserRole(this.state.data[index], (userRole) => {
            this.setState({
                showModifyUserInfo: true,
                selectedUser: this.state.data[index],
                userRole: userRole
            })
        })
    }

    onCloseModifyUserInfo = () => {
        this.setState({
            showModifyUserInfo: false, 
            selectedUser: '',
            userRole: null,
        })
    }

    onSubmitModifyUserInfo = (newInfo) => {
        axios.post(dataSrc.setUserRole,{
            username: this.state.selectedUser.name,
            ...newInfo
        }).then(res => {
            this.setState({
                showModifyUserInfo: false,
                selectedUser: null,
                userRole: null,
            })
            setTimeout(
                this.getUserList(),1500
            )

        })
    }

    // removeUser = (e) => {
    //     e.preventDefault()
    //     var username = e.target.getAttribute('name')
    //     this.setState({
    //         removeCandidate: username,
    //         showRemoveUserConfirm: true
    //     })
    // }

    submitRemoveUserConfirm = () => {
        axios.post(dataSrc.removeUser, {
            username: this.state.selectedUser.name
        }).then((res)=>{
            this.setState({
                showModifyUserInfo: false, 

                // showRemoveUserConfirm: false
            });
            setTimeout(
                this.getUserList(),1000
            )
        })
    }

    // closeRemoveUserConfirm = () => {
    //     this.setState({
    //         removeCandidate: null,
    //         showRemoveUserConfirm: false
    //     })
    // }

    addUser = () => {
        this.setState({
            showAddUserForm: true
        })
    }

    onCloseAddUserForm = () => {
        this.setState({
            showAddUserForm: false
        })
        setTimeout(
            this.getUserList(), 1500
        )
    }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: (e, handleOriginal) => {
                this.onClickUser(rowInfo.index)
            }
        }
    }

    render(){
        const locale = this.context
        return (
            <Fragment>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        onClick={this.addUser}    
                    >
                        {locale.texts.ADD_USER}
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
                <ModifyUserInfo
                    roleName = {this.state.roleName}
                    show = {this.state.showModifyUserInfo}
                    user={this.state.selectedUser}
                    userRole = {this.state.userRole}
                    onClose = {this.onCloseModifyUserInfo}
                    onSubmit = {this.onSubmitModifyUserInfo}
                    removeUser={this.submitRemoveUserConfirm}
                />
                <AddUserForm
                    roleName={this.state.roleName}
                    show={this.state.showAddUserForm}
                    onClose={this.onCloseAddUserForm}
                    title={'add user'}
                />
                {/* <RemoveUserConfirmForm 
                    show = {this.state.showRemoveUserConfirm}
                    user = {this.state.removeCandidate}
                    onSubmit = {this.submitRemoveUserConfirm}
                    onClose = {this.closeRemoveUserConfirm}
                /> */}
            </Fragment>
        )
    }
}
AdminManagementContainer.contextType = LocaleContext;

export default AdminManagementContainer