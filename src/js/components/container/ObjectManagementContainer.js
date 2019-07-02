import React from 'react';

/** Import Presentational Component */
import ObjectOperation from '../presentational/ObjectOperation.js';
import FormContainer from './FormContainer.js';
import TableContainer from './ObjectListContainer';
import Navs from '../presentational/Navs'
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../js/dataSrc";
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'

export default class ObjectManagement extends React.Component{

    constructor() {
        super();
        this.state = {
            data:[],
            column:[],
            filterData:[],
            isShowModal: false,
            selectedRowData: {},
        }
        this.handleModalForm = this.handleModalForm.bind(this);
        this.getObjectData = this.getObjectData.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    componentDidMount(){
        this.getObjectData();
    }

    getObjectData() {
        axios.get(dataSrc.objectTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name.replace(/_/g, ' ')
                    .toLowerCase()
                    .split(' ')
                    .map( s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),                
                field.accessor = item.name,
                field.headerStyle={
                    textAlign: 'left',
                }
                column.push(field);
            })
            this.setState({
                data: res.data.rows,
                filterData: res.data.rows,
                column: column,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handleModalForm() {
        this.setState({
            isShowModal: true,
        })
    }

    handleSubmitForm() {
        setTimeout(this.getObjectData,500) 
        this.setState({
            isShowModal: false
        })
    }

    render(){
        const { isShowModal, selectedRowData } = this.state

        return (
            <Container fluid className='py-2'>
                <Row className='d-flex w-100 justify-content-around'>
                    <Col className='py-2'>
                        <ReactTable 
                            data = {this.state.filterData} 
                            columns = {this.state.column} 
                            showPagination = {false}
                            noDataText="No Data Available"
                            className="-highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                            isShowModal: true,
                                        })
                                
                                        // IMPORTANT! React-Table uses onClick internally to trigger
                                        // events like expanding SubComponents and pivots.
                                        // By default a custom 'onClick' handler will override this functionality.
                                        // If you want to fire the original onClick handler, call the
                                        // 'handleOriginal' function.
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                    }
                                }
                            }}
                        />
                    </Col>
                </Row>
                <EditObjectForm 
                    show = {isShowModal} 
                    title='Edit Object' 
                    selectedObjectData={selectedRowData} 
                    handleSubmitForm={this.handleSubmitForm}
                />
            </Container>
                    
        )
    }
}