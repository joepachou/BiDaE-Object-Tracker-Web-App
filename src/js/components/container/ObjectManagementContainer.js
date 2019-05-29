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
import ModalForm from '../container/ModalForm';

export default class ObjectManagement extends React.Component{

    constructor() {
        super();
        this.state = {
            data:[],
            column:[],
            filterData:[],
            showModalForm: false,
        }
        this.handleType = this.handleType.bind(this);
        this.handleModalForm = this.handleModalForm.bind(this);
    }

    componentDidMount(){
        axios.get(dataSrc.objectTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
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

    handleType(e){
        let filterData = [];
        // switch(e.target.innerText) {
        //     case 'ALL':
        //         searchType = 0;
        //         break;
        //     case 'Inpatient':
        //         searchType = 1;
        //         break;
        //     case 'Medical device':
        //         searchType = 2;
        //         break;
        // }
        // this.setState({
        //     searchType : searchType,
        // })
        if (e.target.innerText === 'All') {
            this.setState({
                filterData: this.state.data,
            })
        } else {
            this.state.data.map(item => {
                if (item.type === e.target.innerText) {
                    filterData.push(item);
                }
            });
            this.setState({
                filterData:filterData,
            })
        }
    }

    handleModalForm() {
        this.setState({
            showModalForm: true,
        }) 
    }

    render(){

        const style = {
            button: {
                
            }
        }

        const { showModalForm } = this.state
        return (
            <Container fluid className='py-2'>
                {/* <Navs navsItem={this.state.navsItem}/> */}
                {/* <div className="d-flex w-100 justify-content-around"> */}
                <Nav className='d-flex align-items-center'>
                    <Button variant="primary" onClick = {this.handleModalForm}>Add Object</Button>
                </Nav>
                {/* <Nav variant="pills" defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/home">Active</Nav.Link>
                    </Nav.Item>
                </Nav> */}
                <Row className='d-flex w-100 justify-content-around'>

                    {/* {console.log(this.state.data)} */}
                    {/* <div className='col-2'>
                        <h2>Objects </h2>
                        <ListGroup variant="flush">
                            <ListGroup.Item onClick={this.handleType} value={0}>All</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={1}>Inpatient</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={2}>Medical device</ListGroup.Item>
                        </ListGroup>
                    </div> */}
                    <Col className='py-2'>
                        <ReactTable 
                            data = {this.state.filterData} 
                            columns = {this.state.column} 
                            showPagination = {false}
                        />
                    </Col>
                </Row>
                <ModalForm show = {showModalForm} title = 'Add Object'/>
            </Container>
                    
        )
    }
}