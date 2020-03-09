import React from 'react';
import { Container,  Nav, Button, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'; 
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import config from '../../config';
import {  
    deleteGateway
} from "../../dataSrc" 
import { AppContext } from '../../context/AppContext';
import {
    Tabs, 
    Tab,
    TabList, 
    TabPanel 
} from 'react-tabs';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm' 
const SelectTable = selecTableHOC(ReactTable);



class GatewayTable extends React.Component{
    
    static contextType = AppContext
    
    state = {  
        showDeleteConfirmation:false,
        selectedRowData: '',
        showEdit: false,
        selection:[],
        selectAll :false,
        selectType:''
    }

    handleClose = () => {
        this.setState({ 
            showDeleteConfirmation: false,
            selectedRowData: '',
            showEdit: false,
            selection:[],
            selectAll :false,
            selectType:''
        })
    }  

    handleSubmitForm = () => {
        this.setState({
            showDeleteConfirmation:true
        })
        this.props.refreshData()
    }


    toggleSelection = (key, shift, row) => {
         
        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ 
            selection 
        });
    };

    toggleAll = () => {
      
        const selectAll = this.state.selectAll ? false : true;
        let selection = [];
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.props.data
 
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item => {
                selection.push(item.id);
            });
        }else{
            selection = [];
        }
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };
 

    deleteRecordGateway = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
        this.props.gatewayData.map (item => {
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ? 
                deleteArray.push(deleteCount.toString())
                : 
                null          
            })
                deleteCount +=1
        })

        deleteArray.map( item => {
            this.props.gatewayData[item] === undefined ?
                null
                :
                idPackage.push(parseInt(this.props.gatewayData[item].id))
            }) 

            axios.post(deleteGateway, {
                idPackage
            })
            .then(res => {
                this.setState({
                    selection: [],
                    selectAll: false,
                    showDeleteConfirmation: false
                })
            })
            .catch(err => {
                console.log(err)
            })

            this.handleSubmitForm()
    }


    render(){
        const {  
            selectedRowData,
            selectAll,
            selectType,
        } = this.state

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
       
        const { locale } = this.context 
        return(
            <div> 
                <ButtonToolbar>
                            <Button 
                                variant="outline-primary" 
                                className='mb-1 text-capitalize mr-2'
                                onClick={() => {
                                    this.setState({
                                        deleteObjectType: 'gateway',
                                        showDeleteConfirmation: true
                                    })
                                }}
                            >
                                {locale.texts.DELECT_GATEWAY}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.props.gatewayData} 
                            columns={this.props.gatewayColunm}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                        })
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                    }
                                }
                            }}
                    />
 
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={  this.deleteRecordGateway }
                />
            </div>

        )
    }
}
export default GatewayTable
