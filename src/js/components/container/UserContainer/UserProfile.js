import React from 'react';
import { Button, Image} from 'react-bootstrap';
import userProfileImg from '../../../../img/icon/userProfile.png';
import { AppContext } from '../../../context/AppContext';
import ImageUploader from 'react-images-upload';
import config from '../../../config';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';
import axios from 'axios';
import {
    getAreaTable,
    getUserArea,
    addUserArea,
    DeleteUserArea,
    modifyUserInfo
} from "../../../dataSrc"
import {
    Row,
    Col,
} from "react-bootstrap"
import NumberPicker from '../NumberPicker';
let elseArray = []
let  rows_data = []

class UserProfile extends React.Component{

    static contextType = AppContext

    state= {
        locale: '',
        userData:[],
        mainArea:'',
        elseArea:[],
        columns: [
            {
              label: 'Area',
              field: 'area',
              sort: 'asc',
            },
            {
                label: 'Add',
                field: 'add',
                sort: 'asc'
              },
            {
              label: 'Remove',
              field: 'remove',
              sort: 'asc'
            },
            {
                label: 'Note',
                field: 'note',
                sort: 'asc'
              }
           
          ],
        settingColumns: [
          {
            label: 'Settings',
            field: 'setting',
            sord: 'asc'
          },
          {
            label: '',
            field: 'choice',
            sort: 'asc'
          }
        ],
        rows_data:[],
        userInfo: null

    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.setState({
                locale: this.context.locale.abbr,
                rows_data:[]
            })
            this.getAreaTable();
        }
    }

    componentDidMount = () => {
        const {
            auth
        } = this.context
        this.setState({
          userInfo: auth.user
        })
        this.getUserData()
        this.getAreaTable()
      }
   
      getUserData =() =>{
        const {auth} = this.context
        axios.post(getUserArea, {
            user_id: auth.user.id
        })
        .then(res => {

           let updataAuthAreas_ID = [] //因為auth裡面是陣列 res抓出來是json 轉一下
           res.data.rows.map(item=>{
               updataAuthAreas_ID.push(item.area_id)
           })
           auth.user.areas_id =updataAuthAreas_ID

           this.setState({
                userData : res.data.rows
            })

        })
        .catch(err => {
            console.log(err)
        })

      }

      getAreaTable = () => {
          let { locale } = this.context
          const {auth} = this.context
          rows_data = []
          this.setState({rows_data})
          axios.post(getAreaTable, {
              locale: locale.abbr
          })
          .then(res => {
                axios.post(getUserArea, {
                user_id: auth.user.id
                })
                .then(res_UserArea => {
                    let noteCount =0;
                    let mainAreaBtn = []
                    let noteArray = []
                    res_UserArea.data.rows.map(nowArea => {
                        noteArray[parseInt(nowArea.area_id)] =locale.texts.ALREADY_CHOOSE
                    })
                    noteArray[parseInt(auth.user.main_area)] = locale.texts.MAIN_AREA
                    mainAreaBtn[parseInt(auth.user.main_area)] = true
                
                    if (rows_data == ''){//避免有兩個一樣的資料，像是２筆變４筆
                        res.data.rows.map(item=>{
                        if (process.env.SITES_GROUP.includes(parseInt(item.id)) ){
                        noteCount +=1    
                        rows_data.push({
                            area : locale.texts[item.name],
                            add :   <Button  name={item.name} disabled={mainAreaBtn[noteCount]} variant="outline-success" className="text-capitalize"  onClick={this.handleAddArea}>{locale.texts.ADD}</Button>,
                            remove :   <Button  name={item.name} disabled={mainAreaBtn[noteCount]}  variant="outline-info" className="text-capitalize"  onClick={this.handleRemoveArea}>{locale.texts.REMOVE}</Button>,
                            note : noteArray[noteCount]
                            })
                        }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
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

    handleAddArea =(e) =>{
        let { locale } = this.context
        let { name } = e.target
        const {auth} = this.context;
        this.state.elseArea.includes(name) ? null :   elseArray.push(name)
        this.setState({
            elseArea:elseArray,
        })

    
        let repeatFlag = false;
        this.state.userData.map(item =>{
            item.area_id == config.mapConfig.areaList.indexOf(name) ? repeatFlag = true : null
        })
        if (repeatFlag != true) { // 還沒新增到db
            axios.post(addUserArea, {
                user_id: auth.user.id,
                area_id:config.mapConfig.areaList.indexOf(name)
            })
            .then(res => {
                console.log('query:已新增,' + config.mapConfig.areaList.indexOf(name) )
                this.getUserData()
            })
            .catch(errr => {
                console.log(errr)
            })
        }else{
            console.log('query:已在當前區域')
        }

        let itemCount = 1
        rows_data = this.state.rows_data
        rows_data.map(item=>{
              if(itemCount == config.mapConfig.areaList.indexOf(name)){
                   item.note = locale.texts.ALREADY_CHOOSE
              }
             itemCount = itemCount+1
        })
        this.setState({rows_data})


    }

    handleRemoveArea =(e) =>{
        let { name } = e.target
        const {auth} = this.context;
        this.state.elseArea.includes(name) ? elseArray.splice(elseArray.indexOf(name),1) :  null
        this.setState({
            elseArea:elseArray,
        })

    //    console.log(auth)
    //    console.log(auth.user.areas_id.indexOf(name))        
    //     let deleteCount = 0;
    //     auth.user.areas_id.map(item=>{
    //         console.log(item + '==' + name)
    //         if (item == config.mapConfig.areaList.indexOf(name))
    //         {
    //           delete auth.user.areas_id[deleteCount]  
    //         }
    //         deleteCount +=1
    //     })
    //     console.log(auth)

       let isDeletePresence = false; // 當前擁有的地區權限有沒有目前要移除的點
           
           this.state.userData.map(item =>{
               item.area_id == config.mapConfig.areaList.indexOf(name) ? isDeletePresence = true : null
           })


           if (isDeletePresence == true) { // 有在列表裡 欠刪
            axios.post(DeleteUserArea, {
                user_id: auth.user.id,
                area_id:config.mapConfig.areaList.indexOf(name)
            })
            .then(res => {
                console.log('query:已刪除,' + config.mapConfig.areaList.indexOf(name) )
                this.getUserData()
            })
            .catch(errr => {
                console.log(errr)
            })
        }else{
            console.log('query:未在當前區域')
        }
 

        let itemCount = 1
        rows_data = this.state.rows_data
        rows_data.map(item=>{
              if(itemCount == config.mapConfig.areaList.indexOf(name)){
                   item.note = ''
              }
             itemCount = itemCount+1
        })
        this.setState({rows_data})

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
                                auth.user.areas_id.map(id => {
                                    return locale.texts[areaOptions[id]]
                                }).join('/')
                            }
                        </p>
                    </div>
                </div>
                <Row className="m-3" style={{width: '100%'}}>
                    <Col>
                        <MDBTable>
                        <MDBTableHead columns={this.state.columns} />
                        <MDBTableBody rows={this.state.rows_data} />
                        </MDBTable>
                    </Col>
                </Row>
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
            </div>
        )
    }
}

export default UserProfile;