import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'
import { getPDFInfo } from "../../../dataSrc";
import { shiftChangeRecordTableColumn } from '../../../tables'
import ReactTable from 'react-table'
import LocaleContext from '../../../context/LocaleContext'

const Fragment = React.Fragment;

export default class ShiftChangeRecord extends React.Component{

    state = {
        data: [],
        columns: [],
        locale: this.context.abbr
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getPDFInfo()
                this.setState({
                locale: this.context.abbr
            })
        }
    }

    componentDidMount(){
        this.getPDFInfo()
        // this.props.getAPI(this.API)
    }

    getPDFInfo(){
        let locale = this.context
        axios.post(getPDFInfo, {
            locale: locale.abbr
        })
        .then(res => {
            let columns = _.cloneDeep(shiftChangeRecordTableColumn)
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.headerStyle = {
                    textAlign: 'left'
                }
            })
            res.data.rows.map(item => {
                item.shift = item.shift && locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
            })
            // this.API.setShiftChangeRecord(res.data.rows)
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
    }

    // itemLayout(item, index, name){
    //     return <div name={name}>{index + 1} . {item.user_id}, Checked at {moment(item.submit_timestamp).format('LLLL')}</div> 
    // }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: e => {
                let file_path = rowInfo.original.file_path
                let path = `http://${process.env.DATASRC_IP}/${file_path}`
                window.open(path);
            }
        }
    }

    render(){

        const style = {
            listItem: {
                cursor: 'pointer'
            }
        }

        const locale = this.context

        return (
            <ReactTable 
                data={this.state.data} 
                columns={this.state.columns} 
                noDataText={locale.texts.NO_DATA_AVALIABLE}
                className="-highlight w-100"
                style={{height:'75vh'}}
                getTrProps={this.onRowClick}
            />
            // <ListGroup className="w-100 border-0">
            //     {this.state.record.map((record, index)=>{
            //         return (
            //             <ListGroup.Item key={record.id} onClick={this.onClickFile} name={record.file_path} style={style.listItem}>
            //                 {this.itemLayout(record, index, record.file_path)}
            //             </ListGroup.Item>
            //         )   
            //     })}
            // </ListGroup>
        )
    }
}

ShiftChangeRecord.contextType = LocaleContext