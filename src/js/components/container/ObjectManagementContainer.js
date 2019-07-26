import React from 'react';

/** Import Presentational Component */
import dataSrc from "../../../js/dataSrc";
import Axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'
import LocaleContext from '../../context/LocaleContext.js';

class ObjectManagementContainer extends React.Component{

    constructor() {
        super();
        this.state = {
            data:[],
            column:[],
            filterData:[],
            isShowEdit: false,
            selectedRowData: [],
            formTitle:'',
            formPath: '',
        }
        this.handleModalForm = this.handleModalForm.bind(this);
        this.getData = this.getData.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getData() {
        Axios.get(dataSrc.getObjectTable).then(res => {
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
            isShowEdit: true,
        })
    }

    handleClickButton(e) {
        this.setState({
            isShowEdit: true,
            formTitle: e.target.innerText,
            selectedRowData: [],
            formPath: dataSrc.addObject
        })
    }

    handleSubmitForm() {
        setTimeout(this.getData,500) 
        this.setState({
            isShowEdit: false
        })
    }

    render(){
        const { isShowEdit, selectedRowData } = this.state
        const locale = this.context
        return (
            <Container fluid className='py-2'>
                <Row className='mt-1'>
                    <Col>
                        <Button variant='primary' className='text-capitalize' onClick={this.handleClickButton}>
                            {locale.ADD_OBJECT}
                        </Button>
                    </Col>
                </Row>
                <Row className='d-flex w-100 justify-content-around'>
                    <Col className='py-2'>
                        <ReactTable 
                            data = {this.state.filterData} 
                            columns = {this.state.column} 
                            noDataText="No Data Available"
                            className="-highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                            isShowEdit: true,
                                            formTitle: locale.EDIT_OBJECT,
                                            formPath: dataSrc.editObject
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
                    show = {isShowEdit} 
                    title= {this.state.formTitle || locale.EDIT_OBJECT} 
                    selectedObjectData={selectedRowData} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                />                
            </Container>
                    
        )
    }
}

ObjectManagementContainer.contextType = LocaleContext
export default ObjectManagementContainer
