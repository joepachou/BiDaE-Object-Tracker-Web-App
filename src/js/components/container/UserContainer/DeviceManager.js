import React, { Fragment } from 'react';
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
import moment from 'moment'
import LocaleContext from '../../../context/LocaleContext';
import { 
    getObjectTable
} from "../../../dataSrc";
import AxiosFunction from './AxiosFunction'
import { deviceManagerTableColumn } from '../../../tables';
import DeleteForm from '../DeleteForm'
import AddDeviceForm from '../AddDeviceForm'

class EditObjectManagement extends React.Component{

    state = {
        data: [],
        columns: [],
        showForm: false,
        locale: this.context.abbr
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getData()
                this.setState({
                locale: this.context.abbr
            })
        }
    }

    getData = () => {
        let locale = this.context
        axios.post(getObjectTable, {
            locale: this.context.abbr
        })
        .then(res => {
            let myDevice = Cookies.get('user') && JSON.parse(Cookies.get('user')).myDevice 
                ? JSON.parse(Cookies.get('user')).myDevice 
                : []
            let data = []
            res.data.rows.map(item => {
                myDevice.includes(item) ? data.push(item) : null;
            })

            let columns = _.cloneDeep(deviceManagerTableColumn)
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.headerStyle = {
                    textAlign: 'left',
                    textTransform: 'capitalize'
                }
            })
            res.data.rows.map((item, index) => {
                item.id = index + 1
            })
            this.setState({
                data: data,
                columns,
                objectTable: res.data.rows
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount = () => {
        this.getData()
    }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: e => {
                this.setState({
                    showForm: true
                })
            }
        }
    }

    onCloseForm = () => {
        this.setState({
            showForm: false
        })
    }

    handleClick = (e) => {
        const { name } = e.target
        switch(name) {
            case 'edit devices':
                console.log(name)
                this.setState({
                    showForm: true
                })
                break;
        }
    }
    // <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
    //     {this.state.record.map((record, index)=>{
    //         return (
    //             <ListGroup.Item key={index} onClick={this.onClickFile} name={record.id} style={{cursor: 'grab'}}>
    //                 {this.itemLayout(record, index)}
    //             </ListGroup.Item>
    //         )   
    //     })}
    // </ListGroup>
    render(){
        // User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
        // console.log('renderrrrrrr')
        // console.log(this.state.record)
        const { record } = this.state
        const locale = this.context

        return (
            <Fragment>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        onClick={this.handleClick}    
                        name='edit devices'
                    >
                        {locale.texts.EDIT_DEVICES}
                    </Button>
                </ButtonToolbar>
                <ReactTable 
                    data={this.state.data} 
                    columns={this.state.columns} 
                    noDataText={locale.texts.NO_DATA_AVALIABLE}
                    className="-highlight w-100"
                    style={{height:'75vh'}}
                    // getTrProps={this.onRowClick}
                />
                {/* <DeleteForm
                    roleName={this.state.roleName}
                    show={this.state.showForm}
                    onClose={this.onCloseForm}
                    title={'edit record'}
                /> */}
                <AddDeviceForm
                    show={this.state.showForm}
                />
            </Fragment>
        )
    }
}
EditObjectManagement.contextType = LocaleContext;

export default EditObjectManagement