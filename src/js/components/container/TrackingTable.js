import React from 'react';
import { 
    Container
} from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { AppContext } from '../../context/AppContext';
import {
    Tabs, 
    Tab,
    TabList, 
    TabPanel 
} from 'react-tabs';
import {
    trackingTableColumn
} from '../../config/tables'
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import { toast } from 'react-toastify';
import LBeaconTable from './LBeaconTable'
import GatewayTable from './GatewayTable' 
import messageGenerator from '../../helper/messageGenerator';
 

class TrackingTable extends React.Component{
    static contextType = AppContext

    state = {
        trackingData: [],
        trackingColunm: [],
        tabIndex: 0,
        locale: this.context.locale.lang,
    }

    toastId = null;

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.lang !== prevState.locale) {
            this.getTrackingData();
            this.setState({
                locale: locale.lang
            })
        }
    }

    componentDidMount = () => {
        this.getTrackingData()
    }

    componentWillUnmount = () => {
        toast.dismiss(this.toastId)
    }


    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {
            this.setMessage('clear')
            let column = _.cloneDeep(trackingTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                if (field.accessor == '_id') {
                    field.headerStyle = {
                        textAlign: 'center',
                    }
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.map((item, index) => {
                item.status = locale.texts[item.status.toUpperCase()]
                item.transferred_location = ''
                item._id = index + 1;
                // item.transferred_location 
                //     ? locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')]
                //     : ''
            })
            this.setState({
                trackingData: res.data,
                trackingColunm: column
            })
        })
        .catch(err => {
            this.setMessage(true)
            this.setMessage(
                'error',
                'connect to database failed',
                true,
            )

            console.log(`get tracking data failed ${err}`);
        })
    }

    setMessage = (type, msg, isSetting) => {

        switch(type) {
            case 'success':
                this.toastId = messageGenerator.setSuccessMessage(msg)
                break;
            case 'error':
                if (isSetting && !this.toastId) {
                    this.toastId = messageGenerator.setErrorMessage(msg)
                } 
                break;
            case 'clear':
                this.toastId = null;
                toast.dismiss(this.toastId)
                break;
        }
    }

    render(){
        return(
            <ReactTable 
                style={{height:'75vh'}}
                data={this.state.trackingData} 
                columns={this.state.trackingColunm} 
                pageSizeOptions={[5, 10]}
                resizable={true}
                freezeWhenExpanded={false}
            />
        )
    }
}

export default TrackingTable;