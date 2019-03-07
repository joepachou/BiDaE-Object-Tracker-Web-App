import React from 'react';

/** Import Presentational Component */
import ObjectOperation from '../presentational/ObjectOperation.js';
import FormContainer from './FormContainer.js';
import TableContainer from './ObjectListContainer';
import ReactTableContainer from './ReactTableContainer';
import Navs from '../presentational/Navs'
import ModalContainer from './ModalContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import dataAPI from "../../../../dataAPI";
import axios from 'axios';



export default class ObjectManagement extends React.Component{

    constructor() {
        super();
        this.state = {
            navsItem: {
                'Add New Objects': "#",
                'Remove Objects': "#",
                'Mark Objects': "#",
                'Hide Marked Objects': "#",
            },
            data:[],
            column:[],
            filterData:[],
        }
        this.handleType = this.handleType.bind(this);
    }

    componentDidMount(){
        axios.get(dataAPI.objectTable).then(res => {
            // console.log('Get data successfully')
            // console.log(res.data.rows)
            res.data.rows.map(item => {
                switch(item.type) {
                    case 1:
                        item.type = 'Inpatient';
                        break;
                    case 2:
                        item.type = 'Medical device';
                        break;
                    default:
                        item.type = 'Object'
                }
            })
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

    render(){
        return (
            <div id='ObjectManagemnt' className='cmp-block'>
                {/* <Navs navsItem={this.state.navsItem}/> */}
                {/* <div className="d-flex w-100 justify-content-around"> */}
                <div className='row'>
                    {/* {console.log(this.state.data)} */}
                    <div className='col-2'>
                        <h2>Objects </h2>
                        <ListGroup variant="flush">
                            <ListGroup.Item onClick={this.handleType} value={0}>All</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={1}>Inpatient</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={2}>Medical device</ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className='col-10'>
                        <ReactTableContainer data={this.state.filterData} column={this.state.column} />
                    </div>
                </div>
                {/* <ModalContainer /> */}

                {/* <ObjectOperation title={'Manage Objects'}/>
                <ObjectOperation title={'Add new Objects'}/>
                <ObjectOperation title={'Remove Objects'}/>
                <ObjectOperation title={'Mark Objects'}/>
                <ObjectOperation title={'Hide Marked Objects'}/> */}
            </div>
        )
    }
}