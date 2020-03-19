import React from 'react';
import 'react-table/react-table.css';
import { 
    Row, 
    Col 
} from 'react-bootstrap'
import SurveillanceContainer from './SurveillanceContainer';
import config from '../../../config';
import _ from 'lodash'
import axios from 'axios';
import dataSrc from '../../../dataSrc'
import { AppContext } from '../../../context/AppContext'
import retrieveDataHelper from '../../../helper/retrieveDataHelper';

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        legendDescriptor: [],
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.interval = setInterval(this.getTrackingData, config.mapConfig.intervalTime)
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    addSearchedIndex = (trackingData, queue) => {
        for(var i in queue){
            var addresses = queue[i].result_mac_address
            trackingData = trackingData.map(item =>{
                if(addresses.includes(item.mac_address)){
                    item.searched = parseInt(i) + 1
                    item.pinColor = queue[i].pin_color_index
                }
                return item
            } )
        }
        trackingData = trackingData.map(item => {
            if(item.searched === undefined){
                item.searched = -1
                item.pinColor = -1
            }
            return item
        })

        return trackingData
    } 

    countItemsInQueue = (data, index) => {
        
        var count = data.filter(item => {
            return item.searched == index + 1
        }).length
        return count
    }

    getTrackingData = () => {
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {
            axios.post(dataSrc.getSearchQueue)
                .then(searchQueue => {

                    const rawTrackingData = res.data
                    const queue = searchQueue.data.rows

                    // used for legend, with text description and image icon
                    var trackingData = this.addSearchedIndex(rawTrackingData, queue)

                    var legendDescriptor = queue.map((queue1, index) => {
                        return {
                            text: queue1.key_word,
                            pinColor: config.mapConfig.iconColor.pinColorArray[queue1.pin_color_index],
                            itemCount:  this.countItemsInQueue(trackingData, index)
                        }    
                    })                

                    this.setState({
                        trackingData: res.data,
                        legendDescriptor,
                    })
                })
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)
        })
    }
    
    render(){

        const style = {
            pageWrap: {
                overflow: "hidden hidden",
            },
        }
        
        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" 
                className='mx-1 my-2' 
                style={style.pageWrap} 
            >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                    <Col id='searchMap' className="pl-2 pr-1" >
                        <SurveillanceContainer 
                            proccessedTrackingData={this.state.trackingData}
                            legendDescriptor = {this.state.legendDescriptor}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MainContainer




