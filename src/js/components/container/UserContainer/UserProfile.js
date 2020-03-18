import React from 'react';
import { 
    Button, 
    Image, 
    ListGroup
} from 'react-bootstrap';
import { AppContext } from '../../../context/AppContext';
import config from '../../../config';
import axios from 'axios';
import {
    getAreaTable,
    getUserArea,
    addUserArea,
    DeleteUserArea,
    modifyUserInfo
} from "../../../dataSrc"
import NumberPicker from '../NumberPicker';
import cloneDeep from 'lodash/cloneDeep';
import EditAreasForm from '../../presentational/EditAreasForm'
import retrieveDataHelper from '../../../helper/retrieveDataHelper';

class UserProfile extends React.Component{

    static contextType = AppContext

    state= {
        show: false,
        locale: '',
        userData:[],
        mainArea:'',
        elseArea:[],
        userInfo: null,
        upadateAreaId: [],
        totalAreaId: [],
        secondaryAreaId: [],
        secondaryAreaIdBeforUpdate:[],
        otherAreaId: [],
        otherAreaIdBeforUpdate: []
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getAreaTable();
            this.setState({
                locale: this.context.locale.abbr,
            })
        }
    }

    componentDidMount = () => {
        const {
            auth
        } = this.context
        this.getUserData()
        this.getAreaTable()
        this.setState({
          userInfo: auth.user
        })

    }
   
    getUserData =() =>{
        const { 
            areaOptions
        } = config.mapConfig

        const {
            auth
        } = this.context
        let userIdList = []

        axios.post(getUserArea, {
            user_id: auth.user.id
        })
        .then(res => {
        
            res.data.rows.map(item=>{
                userIdList.push(item.area_id)
            })

            auth.user.areas_id = userIdList

            this.setState({
                userData : res.data.rows,
                secondaryAreaId : userIdList
            })
        })
        .catch(err => {
            console.log(err)
        })
    
    }

    getAreaTable = () => {

        const {
            auth
        } = this.context
        const { 
            areaOptions
        } = config.mapConfig

        retrieveDataHelper.getAreaTable()
            .then(res => {
                let totalAreaIdList = []

                res.data.rows.map( item =>{
                    totalAreaIdList.push(item.id)
                })

                let otherAreaIdList = []
                totalAreaIdList.map( item => {
                    let check = true

                    auth.user.areas_id.map( item2=> {
                        if( item == item2){
                            check = false
                        }
                    })
                    if(check == true){
                        otherAreaIdList.push(item)
                    }
                })

                this.setState({
                    otherAreaId: otherAreaIdList,
                    totalAreaId: totalAreaIdList,
                })

            })
            .catch(err => {
                console.log(err)
            })
    }

    resetFreqSearchCount = (value) => {
        const {
            auth
        } = this.context;
        
        if (value) {
            let userInfo = this.state.userInfo
            userInfo.freqSearchCount = value
            this.setState({
                userInfo: userInfo
            })
            axios.post(modifyUserInfo, {
                info: userInfo,
                username: userInfo['name']
            }).then(res => {
                auth.setUserInfo('freqSearchCount', value)
            }) 
        }
    }

    handleAddArea =(areaId) =>{

        const { 
            locale,
            auth 
        } = this.context

        axios.post(addUserArea, {
            user_id: auth.user.id,
            area_id: areaId
        })
        .then(res => {
            console.log('query:已新增,' + areaId )
        })
        .catch(errr => {
            console.log(errr)
        })
    }

    handleRemoveArea = (areaId) =>{

        const { 
            locale,
            auth 
        } = this.context

        axios.post(DeleteUserArea, {
            user_id: auth.user.id,
            area_id: areaId
        })
        .then(res => {
            console.log('query:已刪除,' + areaId )
        })
        .catch(errr => {
            console.log(errr)
        })
    }

    handleShowModal = () => {
        
        this.setState({
            secondaryAreaIdBeforUpdate : this.state.secondaryAreaId,
            otherAreaIdBeforUpdate: this.state.otherAreaId,
            show: true
        })
    }

    handleCloseModal = () => {
        this.setState({
            show: false
        })
    }

    handleCloseModalwithSave = () => {
        this.state.secondaryAreaIdBeforUpdate.map(item => {
            var check = true
            this.state.secondaryAreaId.map(item2 => {
                if( item == item2) check = false
            })
            if(check == true)　this.handleAddArea(item)
        })

        this.state.secondaryAreaId.map(item => {
            var check = true
            this.state.secondaryAreaIdBeforUpdate.map(item2 => {
                if( item == item2) check = false
            })
            if( check == true) this.handleRemoveArea(item)
        })
        this.setState({
            secondaryAreaId : this.state.secondaryAreaIdBeforUpdate,
            otherAreaId: this.state.otherAreaIdBeforUpdate,
            show: false
        })
    }

    handleBeforUpdateAdd = (e) => {
        let chooseList = cloneDeep(this.state.secondaryAreaIdBeforUpdate)
        let didntchooseList = cloneDeep(this.state.otherAreaIdBeforUpdate)

        chooseList.push(e)
        var indx = didntchooseList.indexOf(e)
        didntchooseList.splice(indx,1)

        this.setState({
            secondaryAreaIdBeforUpdate : chooseList,
            otherAreaIdBeforUpdate: didntchooseList
        })
    }

    handleBeforUpdateDele = (e) => {
        let chooseList = cloneDeep(this.state.secondaryAreaIdBeforUpdate)
        let didntchooseList = cloneDeep(this.state.otherAreaIdBeforUpdate)
        
        didntchooseList.push(e)
        var indx = chooseList.indexOf(e)
        chooseList.splice(indx,1)
        
        this.setState({
            secondaryAreaIdBeforUpdate : chooseList,
            otherAreaIdBeforUpdate: didntchooseList
        })
    }

    render(){
        const { 
            locale,
            auth 
        } = this.context

        const { 
            areaOptions
        } = config.mapConfig

        return(
            <div
                className="text-capitalize d-flex flex-column"
            >
                <div>
                    <div className="title ">
                        {locale.texts.ABOUT_YOU}
                    </div>
                    <div>
                        <p>
                            {locale.texts.ID}:{auth.user.id}
                        </p>
                        <p>
                            {locale.texts.NAME}: {auth.user.name}
                        </p>
                    </div>
                </div>
                <hr/>
                <div>
                    <div className="title ">
                        {locale.texts.YOUR_SERVICE_AREAS}
                    </div>
                    <div>
                        <p>
                            {locale.texts.MAIN_AREA}: {locale.texts[areaOptions[auth.user.main_area]]}
                        </p>
                        <p>
                            {locale.texts.SECONDARY_AREAS}: {
                                this.state.secondaryAreaId.map(id => {
                                    return locale.texts[areaOptions[id]]
                                }).join('/')
                            }
                            <Button 
                                variant='link' 
                                onClick={this.handleShowModal}
                            >
                                {locale.texts.EDIT}
                            </Button>
                        </p>
                    </div>
                </div>
                <hr/>
                <div>
                    <div 
                        className="title"
                    >
                        {locale.texts.PREFERENCE}
                    </div>
                    <div 
                        className="d-flex justify-content-start align-items-center"
                    >
                        {locale.texts.NUMBER_OF_SEARCH_HISTORY}: 
                        <NumberPicker
                            name="numberPicker"
                            value={auth.user.freqSearchCount}
                            onChange={this.resetFreqSearchCount}
                            length={10}
                        />
                    </div>

                </div>
                <EditAreasForm 
                    show={this.state.show} 
                    handleClose={this.handleCloseModal}
                    otherAreaIdBeforUpdate={this.state.otherAreaIdBeforUpdate}
                    secondaryAreaIdBeforUpdate={this.state.secondaryAreaIdBeforUpdate}
                    handleSubmit={this.handleCloseModalwithSave}
                    handleBeforUpdateDele={this.handleBeforUpdateDele}
                    handleBeforUpdateAdd={this.handleBeforUpdateAdd}
                />
            </div>
        )
    }
}

export default UserProfile;