import React from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie'
import dataSrc from "../../../dataSrc";
import AddableList from './AddableList'
import LocaleContext from '../../../context/LocaleContext';
import { AppContext } from '../../../context/AppContext';

const Fragment = React.Fragment;

const style = {
    listItem: {
        position: 'relative',
        zIndex: 6,
    }, 
    firstText: {
        paddingLeft: 15,
        paddingRight: 0,
        // background: 'rgb(227, 222, 222)',
        // height: 30,
        // width: 30,
    },
    middleText: {
        paddingLeft: 2,
        paddingRight: 2,
    },
    lastText: {
        // textAlign: 'right'
    },
    icon: {
        color: '#007bff'
    },
    list: {
        wordBreak: 'keep-all',
        // color:'red',
        zIndex: 1
    },
}

class MyDeviceManager extends React.Component{

    static contextType = AppContext

    constructor() {
        super();
        this.state = {
           
        }
        this.device = {
            dataMap: null,
            myDeviceList: null,
            myDevices: null,
            notMyDevices: null
        }
        this.APIforAddableList_1 = null
        this.APIforAddableList_2 = null

        this.API = {
            setAllDevice: (deviceList) => {
                this.allDevices = deviceList
            },
            setMyDevice: (myList) => {
                this.myDevices = myList
            },
            switchDevice: (acn) => {
                let { auth } = this.context;
                let userInfo = auth.user
                let myDevice = userInfo.myDevice || []
                if(acn in this.device.myDevices){
                    this.device.notMyDevices[acn] = this.device.dataMap[acn]
                    delete this.device.myDevices[acn] 
                    let index = myDevice.indexOf(acn)
                    myDevice = [...myDevice.slice(0, index), ...myDevice.slice(index + 1)]
                    this.API.postMyDeviceChange('remove', acn)
                }else if(acn in this.device.notMyDevices){
                    this.device.myDevices[acn] = this.device.dataMap[acn]
                    delete this.device.notMyDevices[acn] 
                    myDevice.push(acn)
                    this.API.postMyDeviceChange('add', acn)
                }else{
                    console.error('acn is not in device list')
                }
                userInfo = {
                    ...userInfo,
                    myDevice
                }
                auth.setCookies('user', userInfo)
                auth.setUserInfo('myDevice', myDevice)
                
                this.APIforAddableList_1.setList(this.device.myDevices)
                this.APIforAddableList_2.setList(this.device.notMyDevices)
            },

            postMyDeviceChange: (mode, acn) => {
                let { auth } = this.context;
                const username = auth.user.name
                axios.post(dataSrc.modifyMyDevice, {
                        username,
                        mode: mode,
                        acn: acn
                    })
                    .then(res => {
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }

        this.functionForAddableList = {
            onClick: (e) => {
                var acn = e.target.getAttribute('name')
                this.API.switchDevice(acn)
            },
            validation: (string) => {
                var re = /^\s*(?<acn>\d{4}-\d{4}-\d{4})\s*$/
                var match = string.match(re)
                if(match){
                    return match.groups['acn']
                }else{
                    return null
                }
            },
            itemLayout: (item, index) => {
                let { locale } = this.context
                return (             
                    <div 
                        className='d-flex justify-content-start text-left' 
                        style={style.list}
                        name={item.access_control_number}
                    >
                        <p className='d-inline-block mx-1'>&#9642;</p>
                        
                        {item.type},
                        &nbsp;
                        {item.access_control_number},
                        &nbsp;
                        {locale.abbr === 'en'
                            ? `${locale.texts.STATUS} ${locale.texts.IS} ${locale.texts[item.status.toUpperCase()]}`
                            : `${locale.texts.STATUS}${locale.texts[item.status.toUpperCase()]}`
                        }
                        &nbsp;
                    </div>
                )
            }
        }


        this.getAPIfromAddableList_1 = this.getAPIfromAddableList_1.bind(this)
        this.getAPIfromAddableList_2 = this.getAPIfromAddableList_2.bind(this)
    }

    getAPIfromAddableList_1(API){
        let { locale } = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_1 = API
        this.APIforAddableList_1.setTitle(locale.texts.MY_DEVICES_LIST)
        this.APIforAddableList_1.setValidation(validation)
        this.APIforAddableList_1.setItemLayout(itemLayout)
        this.APIforAddableList_1.setOnClick(onClick)
    }

    getAPIfromAddableList_2(API){
        let { locale } = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_2 = API
        this.APIforAddableList_2.setTitle(locale.texts.NOT_MY_DEVICES_LIST)
        this.APIforAddableList_2.setValidation(validation)
        this.APIforAddableList_2.setItemLayout(itemLayout)
        this.APIforAddableList_2.setOnClick(onClick)
    }

    componentDidMount(){
        // if(this.props.getAPI){
        //     this.props.getAPI(this.API)
        // }else{
        //     console.error('please set attributes called "getAPI" for UserSettingContainer')
        // }
        this.getObjectData()
    }

    getObjectData() {
        let { locale, auth } = this.context
        axios.post(dataSrc.getObjectTable, {
            locale: locale.lang,
            areaId: auth.user.areas_id,
        }).then(res => {
            let data = res.data.rows
            var dataMap = {}

            for(var item of data){
                dataMap[item.access_control_number] = item
            }
            this.device.dataMap = dataMap

            axios.post(dataSrc.getUserInfo, {
                username: JSON.parse(Cookies.get('user')).name
            }).then((res) => {
                var myDeviceList = res.data.rows[0].mydevice || []
                var allDeviceList = Object.keys(dataMap)

                this.device.myDeviceList = myDeviceList
                var myDevices = {}, notMyDevices = {}

                for(var acn of allDeviceList){
                    if(myDeviceList.includes(acn)){
                        myDevices[acn] = dataMap[acn]
                    }else{
                        notMyDevices[acn] = dataMap[acn]
                    }
                }

                this.device.myDevices = myDevices
                this.device.notMyDevices = notMyDevices
                this.APIforAddableList_1.setList(myDevices)
                this.APIforAddableList_2.setList(notMyDevices)
            }).catch(err => {
                console.log(err)
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    
    render(){
        return (
            <Fragment>
                <Row className="w-100 d-flex bg-white">
                    <Col>
                        <AddableList
                            getAPI={this.getAPIfromAddableList_1}
                        />
                    </Col>
                </Row>
                {/* <Row>
                    <Col xl={2} className='p-5 d-flex flex-column align-self-center text-center'>
                        <i className="fas fa-angle-double-right fa-2x"></i>
                        <i className="fas fa-angle-double-left fa-2x"></i>
                    </Col>
                </Row> */}
                <Row className='mt-2'>
                    <Col>
                        <AddableList
                            getAPI={this.getAPIfromAddableList_2}
                        />
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default MyDeviceManager