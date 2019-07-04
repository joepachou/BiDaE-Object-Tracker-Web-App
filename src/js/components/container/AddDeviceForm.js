import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import config from '../../config';
import { connect } from 'react-redux'
import ReactTable from "react-table/lib/index";
import "react-table/"
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import Axios from 'axios';
import dataSrc from '../../dataSrc';
import Cookies from 'js-cookie';
import _ from 'lodash'
import { get } from 'http';
const SelectTable = selecTableHOC(ReactTable);

class AddDeviceForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            data: null,
            columns: null,
            selection: [],
            selectAll: false,
            selectDevices: [],
            isSave: false,
            
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleAll = this.toggleAll.bind(this)
        this.toggleSelection = this.toggleSelection.bind(this)
        this.isSelected = this.isSelected.bind(this)
    }

  
    handleClose(e) {
        if(this.props.handleAddDeviceFormClose) {
            this.props.handleAddDeviceFormClose();
        }
        this.setState({ 
            show: false,
            selection: this.state.isSave ?  this.state.selection : []
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        
        if(!(_.isEqual(this.props, prevProps)) && this.props.searchResult) {
            let data = this.getData();
            let columns = this.getColumns(this.props.searchResult[0] || [])
            this.setState({
                data: data,
                columns: columns 
            })
        }
        if (prevProps.show != this.props.show) {
            
            this.setState({
                show: this.props.show,
            })
        }
    }

    getData() {

        // Axios.get(dataSrc.objectTable).then( res => {
        //     let columns = this.getColumns(res.data.fields)
        //     this.setState({
        //         data: res.data.rows,
        //         columns: columns
        //     })
        // }).catch( err => {
        //     console.log(err)
        // })

        // Axios.post(dataSrc.userInfo, {
        //     username: Cookies.get('user')
        // }).then( res => {
        //     let columns = this.getColumns(res.data.fields)
        //     this.setState({
        //         data: res.data.rows,
        //         columns: columns
        //     })
        //     console.log(res)
        // }).catch( err => {
        //     console.log(err)
        // })
        let data = this.props.searchResult.filter(item => {
            return item.access_control_number !== this.props.selectedObjectData.access_control_number
        }).map((item, index) => {
            return {
                ...item,
                id: index.toString()
            }
        })
        return data
    }

    getColumns(fieldArray) {

        let columns = []
        
        Object.keys(fieldArray).filter( item => {
            return item === 'location_description' ||
                    item === 'name' || 
                    item === 'access_control_number' 
        }).map(item => {

            let field = {};
            field.Header = item.replace(/_/g, ' ')
                    .split(' ')
                    .map( item => item.charAt(0).toUpperCase() + item.substring(1))
                    .join(' ')
            field.accessor = item
            field.headerStyle={
                textAlign: 'left',
            }
            columns.push(field)
        })
        return columns
    }

    toggleSelection (key, shift, row) {
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

    toggleAll (){
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
    
    isSelected (key){
    /*
        Instead of passing our external selection state we provide an 'isSelected'
        callback and detect the selection state ourselves. This allows any implementation
        for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key);
    };

    handleSubmit(e) {
        let selection = new Set(this.state.selection)
        let selectedDevices = []
        this.state.data.map( item => {
            selection.has(item.id) ? selectedDevices.push(item) : null;
        })
        this.props.addedDevice(selectedDevices)

        this.setState({
            selectDevices: selectedDevices,
            isSave: true,
        })
    }
  
    render() {

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

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },

        }

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="lg">
                    <Modal.Header closeButton className='font-weight-bold'>{this.props.title}</Modal.Header >
                    <Modal.Body>
                        {this.state.data ? (
                            
                            <SelectTable
                                keyField='id'
                                data={this.state.data}
                                columns={this.state.columns}
                                ref={r => (this.selectTable = r)}
                                className="-highlight"
                                showPagination = {false}

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
                            />
                            ) : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        objectInfo: state.retrieveTrackingData.objectInfo
    }
}
export default connect(mapStateToProps)(AddDeviceForm);