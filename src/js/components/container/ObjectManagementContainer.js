import React from 'react';

/** Import Presentational Component */
import dataSrc from "../../../js/dataSrc";
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'
import LocaleContext from '../../context/LocaleContext.js';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import config from '../../config'
const SelectTable = selecTableHOC(ReactTable);



class ObjectManagementContainer extends React.Component{
        state = {
            column:[],
            data:[],
            isShowEdit: false,
            selection: [],
            selectedRowData: [],
            formTitle:'',
            formPath: '',
            selectAll: false,
        }

    componentDidMount = () => {
        this.getData();
    }

    getData = () => {
        axios.get(dataSrc.getObjectTable)
            .then(res => {
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

                    switch(item.name) {
                        case 'status':
                            field.width = 100
                            break;
                    }

                    column.push(field);
                })
                res.data.rows.map(item => {
                    let checkboxGroup = []
                    Object.keys(config.monitorType).map(index => {
                        if (item.monitor_type & index) {
                            checkboxGroup.push(config.monitorType[index])
                        }
                    })
                    item.monitor_type = checkboxGroup.join(',')
                })
                this.setState({
                    data: res.data.rows,
                    column: column,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleModalForm = () => {
        this.setState({
            isShowEdit: true,
        })
    }

    handleClickButton = (e) => {
        this.setState({
            isShowEdit: true,
            formTitle: e.target.innerText,
            selectedRowData: [],
            formPath: dataSrc.addObject
        })
    }

    handleSubmitForm = () => {
        setTimeout(this.getData, 500) 
        this.setState({
            isShowEdit: false
        })
    }

    toggleSelection = (key, shift, row) => {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state

        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ 
            selection 
        });

    };

    toggleAll = () => {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.selectTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                if (item._original) {
                selection.push(item._original.id);
                }
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = (key) => {
        /*
            Instead of passing our external selection state we provide an 'isSelected'
            callback and detect the selection state ourselves. This allows any implementation
            for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };



    render(){
        const { isShowEdit, selectedRowData } = this.state
        const locale = this.context

        const { selectAll, selectType } = this.state;

        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };
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
                            data = {this.state.data} 
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
                        {/* <SelectTable
                            keyField='id'
                            data={this.state.data}
                            columns={this.state.column}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            defaultPageSize={15} 

                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        let id = rowInfo.original.id
                                        this.toggleSelection(id)
                                
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
                        /> */}
                    </Col>
                </Row>                
                <EditObjectForm 
                    show = {isShowEdit} 
                    title= {this.state.formTitle || locale.EDIT_OBJECT} 
                    selectedObjectData={selectedRowData || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                />                
            </Container>
                    
        )
    }
}

ObjectManagementContainer.contextType = LocaleContext
export default ObjectManagementContainer
