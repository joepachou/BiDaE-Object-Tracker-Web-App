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
    DeleteUserArea
} from "../../../dataSrc"
import {
    Row,
    Col,
} from "react-bootstrap"


let elseArray = []
let  rows_data = []
class UserProfile extends React.Component{

    static contextType = AppContext
    state= {
     
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
        rows_data:[],

    }
   
    componentDidMount = () => {
        this.getUserData()
        this.getAreaTable()
      }
   
      getUserData =() =>{
        const {auth} = this.context
        axios.post(getUserArea, {
            user_id: auth.user.id
        })
        .then(res => {
           this.setState({userData : res.data.rows})
           let updataAuthAreas_ID = [] //因為auth裡面是陣列 res抓出來是json 轉一下
           res.data.rows.map(item=>{
               updataAuthAreas_ID.push(item.area_id)
           })
           auth.user.areas_id =updataAuthAreas_ID

           let { stateReducer } = this.context
           let [{areaId}, dispatch] = stateReducer
           dispatch({
               type: 'setArea',
               value: updataAuthAreas_ID
           })

        })
        .catch(err => {
            console.log(err)
        })

      }

      getAreaTable = () => {

          let { locale } = this.context
          console.log(locale)
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
                    noteArray[parseInt(nowArea.area_id)] ='已選擇'
                })
                console.log(noteArray)
                console.log(auth.user)
                noteArray[parseInt(auth.user.main_area)] = '首要地區'
                mainAreaBtn[parseInt(auth.user.main_area)] = true
               
                res.data.rows.map(item=>{
                    if (process.env.SITES_GROUP.includes(parseInt(item.id)) ){
                       noteCount +=1    
                      rows_data.push({
                        area : locale.texts[item.name],
                        add :   <Button  name={item.name} disabled={mainAreaBtn[noteCount]} variant="outline-success" className="text-capitalize"  onClick={this.handleAddArea}>{'新增'}</Button>,
                        remove :   <Button  name={item.name} disabled={mainAreaBtn[noteCount]}  variant="outline-info" className="text-capitalize"  onClick={this.handleRemoveArea}>{'移除'}</Button>,
                        note : noteArray[noteCount]
                        })
                    }
                    })
                this.setState({rows_data})
                })
                .catch(err => {
                    console.log(err)
                })
          })
          .catch(err => {
              console.log(err)
          })
      }
 

 

    constructor(props){
        super(props);

        this.upDate = this.upDate.bind(this);
    }

    upDate(picture){
       
    }

    handleAddArea =(e) =>{
       
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
                   item.note = '已選擇'
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
        const { locale } = this.context
        console.log(locale)
        const {auth} = this.context;
        //console.log(config.mapConfig.areaModules)
        const style = {
            userProfileContainer: {
                height: '250px',
                //border: 'solid'
            },
            userImageAndUpload: {
                height: '250px',
                //border: 'solid',
                width:'220px'
            },
            userImage:{
                height: '220px',
               
                width: '220px',
                //border: 'solid',
                borderRadius: '99rem',
            },
            uploadButton: {
                color: "black"
            }
        }
        // const key = Object.keys(config.mapConfig.areaOptions)
        // const value = Object.values(config.mapConfig.areaOptions)
   

        return(
             //    頭像
            // <div className='d-flex flex-row'style={style.userProfileContainer}>
            //     <div className='d-flex flex-column' style={style.userImageAndUpload}>
            //         <Image src={userProfileImg} style={style.userImage} />  
            //     </div>
            //     <div className='d-flex flex-column'>
            //         <p>名字 : {auth.user.name}</p>
            //         <p>職位 : {auth.user.role}</p>
            //         <p>ID編號 ：{auth.user.id}</p>
            //         {
            //             key.map(function(item, index, array){
            //                 if(item == auth.user.areas_id){
            //                     return <p>地區 : {value[index]}</p>
            //                 }
            //             })
            //         }
            //     </div>

            // </div>

           

            <div className='d-flex flex-row'>
     

                <Row >
                    <Col>
                        <MDBTable>
                        <MDBTableHead columns={this.state.columns} />
                        <MDBTableBody rows={this.state.rows_data} />
                        </MDBTable>
                    </Col>
                </Row>
   
           

            </div>



        )
    }
}

export default UserProfile;