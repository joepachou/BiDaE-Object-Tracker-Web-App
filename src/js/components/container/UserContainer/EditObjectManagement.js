import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'
import LocaleContext from '../../../context/LocaleContext';
import { getEditObjectRecord } from "../../../dataSrc";
import AxiosFunction from './AxiosFunction'
import { editObjectRecordTableColumn } from '../../../tables';

class EditObjectManagement extends React.Component{

    state = {
        data: [],
        columns: [],
        locale: this.context.abbr
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getEditObjectRecord()
                this.setState({
                locale: this.context.abbr
            })
        }
    }

    getEditObjectRecord = () => {
        let locale = this.context
        axios.post(getEditObjectRecord, {
            locale: this.context.abbr
        })
        .then(res => {
            let columns = _.cloneDeep(editObjectRecordTableColumn)
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.headerStyle = {
                    textAlign: 'left',
                }
            })
            res.data.rows.map((item, index) => {
                item.id = index + 1
            })
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount = () => {
        this.getEditObjectRecord()
    }

    itemLayout = (record, index) => {
        return(
            <h5 name={record.id}>
                User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
            </h5>
        ) 
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
        // const column = [
        //     {
        //         Header: 'No.',
        //         Cell: ({row}) => {
        //             return <div className="d-flex justify-content-center w-100 h-100">{row._index}</div>
        //         },
        //     },
        //     {
        //         Header: 'User',
        //         Cell: ({row}) => {
        //             return <div className="d-flex justify-content-center w-100 h-100">{row._original.edit_user_id}</div>
        //         }
        //     },
        //     {
        //         Header: 'Edit Time',
        //         Cell: ({row}) => {
        //             return <div className="d-flex justify-content-center w-100 h-100">{moment(row._original.edit_time).format('LLLL')}</div>
        //         }
        //     },
        // ]
        const onRowClick = (state, rowInfo, column, instance) => {
            return {
                onClick: e => {
                    this.onClickFile(e)
                }
            }
        }
        return (
            <ReactTable 
                data={this.state.data} 
                columns={this.state.columns} 
                noDataText={locale.texts.NO_DATA_AVALIABLE}
                className="-highlight w-100"
                style={{height:'75vh'}}
                getTrProps={onRowClick}
            />
            
        )
    }
}
EditObjectManagement.contextType = LocaleContext;

export default EditObjectManagement