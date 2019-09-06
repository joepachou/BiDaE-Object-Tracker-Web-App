import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";
import AddableList from './AddableList'
import ModifyUserInfo from './ModifyUserInfo'
import RemoveUserConfirmForm from './RemoveUserConfirmForm'
import { userInfoTableColumn } from '../../../tables'

class AdminManagementContainer extends React.Component{
    state = {
           data: [],
           columns: [],
           selectedUser: null,
           userRole: null,
           locale: this.context.lang
    }
    staticParamter = {
        roleName : []
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.lang !== prevState.locale) {
            this.getRoleNameList()
            this.getUserList()
            this.setState({
                locale: this.context.lang
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
        }).then(res => {
            let columns = _.cloneDeep(userInfoTableColumn)
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase()]
                field.headerStyle = {
                    textAlign: 'left',
                }
            })
            res.data.rows.map(item => {
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
            this.staticParamter.roleName = res.data.rows
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
            selectedUser: null,
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
        })
    }
    removeUser = (e) => {
        e.preventDefault()
        var username = e.target.getAttribute('name')
        this.setState({
            removeCandidate: username,
            showRemoveUserConfirm: true
        })

        
    }
    submitRemoveUserConfirm = () => {
        axios.post(dataSrc.removeUser, {
            username: this.state.removeCandidate
        }).then((res)=>{

            this.setState({
                removeCandidate: null,
                showRemoveUserConfirm: false
            });
            this.getUserList()
        })
        
    }
    closeRemoveUserConfirm = () => {
        this.setState({
            removeCandidate: null,
            showRemoveUserConfirm: false
        })
    }
    render(){
        const {data} = this.state
        const {roleName} = this.staticParamter
        return(
            <div className="w-100">
                <ReactTable 
                    data = {this.state.data} 
                    columns = {this.state.columns} 
                    noDataText="No Data Available"
                    className="-highlight"
                    style={{height:'75vh'}}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.onClickUser(rowInfo.index)
                            }
                        }
                    }}
                />
                <ModifyUserInfo
                    roleName = {roleName}
                    show = {this.state.showModifyUserInfo}
                    user = {this.state.selectedUser}
                    userRole = {this.state.userRole}
                    onClose = {this.onCloseModifyUserInfo}
                    onSubmit = {this.onSubmitModifyUserInfo}
                />
                <RemoveUserConfirmForm 
                    show = {this.state.showRemoveUserConfirm}
                    user = {this.state.removeCandidate}
                    onSubmit = {this.submitRemoveUserConfirm}
                    onClose = {this.closeRemoveUserConfirm}
                />
            </div>
        )
    }
}
AdminManagementContainer.contextType = LocaleContext;

export default AdminManagementContainer