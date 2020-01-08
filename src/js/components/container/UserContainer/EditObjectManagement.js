import React from 'react';
import { 
    Button,
    ButtonToolbar
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'
import LocaleContext from '../../../context/LocaleContext';
import { getEditObjectRecord } from "../../../dataSrc";
import AxiosFunction from './AxiosFunction'
import { editObjectRecordTableColumn } from '../../../tables';
import DeleteForm from '../DeleteForm'
import { deleteEditObjectRecord } from '../../../dataSrc'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
const SelectTable = selecTableHOC(ReactTable);


class EditObjectManagement extends React.Component{

    state = {
        data: [],
        columns: [],
        showForm: false,
        locale: this.context.abbr,
        selectAll: false,
        selection: [],
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
                    textTransform: 'capitalize'
                }
            })
            res.data.rows.map((item, index) => {
                item._id = index + 1
                item.new_status = locale.texts[item.new_status.toUpperCase().replace(/ /g, '_')]
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
    // <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
    //     {this.state.record.map((record, index)=>{
    //         return (
    //             <ListGroup.Item key={index} onClick={this.onClickFile} name={record.id} style={{cursor: 'grab'}}>
    //                 {this.itemLayout(record, index)}
    //             </ListGroup.Item>
    //         )   
    //     })}
    // </ListGroup>

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
                selection.push(item._original._id);
                }
            });
        }
        this.setState({ selectAll, selection });
    };

    toggleSelection = (key, shift, row) => {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        let selection = [...this.state.selection];
     
        key = typeof key === 'number' ? key : parseInt(key.split('-')[1])
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
        {console.log(selection)}
        // update the state
        this.setState({ 
            selection 
        });

    };

    isSelected = (key) => {
        /*
            Instead of passing our external selection state we provide an 'isSelected'
            callback and detect the selection state ourselves. This allows any implementation
            for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    deleteRecord = () => {
        // console.log(this.state.selection)
        // console.log(this.state.data)
        let idPackage = []
        this.state.selection.map( item => {
            idPackage.push(parseInt(this.state.data[item - 1].id))
        })
        axios.post(deleteEditObjectRecord, {
            idPackage
        })
        .then(res => {
            this.getEditObjectRecord()
            this.setState({
                selection: [],
                selectAll: false,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

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

        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const { selectAll, selectType } = this.state;


        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        return (
            
            <>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        onClick={this.deleteRecord}    
                    >
                        {locale.texts.DELETE}
                    </Button>
                </ButtonToolbar>
                {/* <ReactTable 
                    data={this.state.data} 
                    columns={this.state.columns} 
                    noDataText={locale.texts.NO_DATA_AVALIABLE}
                    className="-highlight w-100"
                    style={{height:'75vh'}}
                    // getTrProps={this.onRowClick}
                /> */}
                {this.state.data ? (
                
                    <SelectTable
                        keyField='_id'
                        data={this.state.data}
                        columns={this.state.columns}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        style={{height:'75vh'}}
                        // showPagination = {false}
                        {...extraProps}
                        getTrProps={(state, rowInfo, column, instance) => {
                          
                            return {
                                onClick: (e, handleOriginal) => {
                                    let id = rowInfo.original._id
                                    {console.log('dd')}
                                    {console.log(rowInfo)}
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
                    />
                    ) : null
                }
                {/* <DeleteForm
                    roleName={this.state.roleName}
                    show={this.state.showForm}
                    onClose={this.onCloseForm}
                    title={'edit record'}
                /> */}
            </>
        )
    }
}
EditObjectManagement.contextType = LocaleContext;

export default EditObjectManagement