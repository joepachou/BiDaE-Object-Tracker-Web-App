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
import { 
    gatewayTableColumn
} from '../../tables';
import { AppContext } from '../../context/AppContext';
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm' 

const SelectTable = selecTableHOC(ReactTable);


class GatewayTable extends React.Component{
    
    static contextType = AppContext
    
    state = {  
        showDeleteConfirmation:false,
        selectedRowData: '',
        gatewayData: [],
        gatewayColunm: [],
        showEdit: false,
        selection:[],
        selectAll :false,
        selectType:''
    }

    componentDidMount = () => {
        this.getGatewayData();
        this.getGatewayDataInterval = this.startSetInterval ? setInterval(this.getGatewayData, config.healthReport.pollGatewayTableIntevalTime) : null;
    }

    componentWillUnmount = () => {
        clearInterval(this.getGatewayDataInterval);
    }

    getGatewayData = () => {
        let { 
            locale
        } = this.context
        retrieveDataHelper.getGatewayTable(
            locale.abbr
        )
        .then(res => {
            this.props.setErrorMessage(false)
            let column = _.cloneDeep(gatewayTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                gatewayData: res.data.rows,
                gatewayColunm: column
            })
        })
        .catch(err => {
            this.props.setErrorMessage(true)
            console.log(`get gateway data failed ${err}`);
        })
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
        let rowsCount = 0 ; 
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.props.data
 
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
            
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item.id)
                } 
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
        this.state.gatewayData.map (item => {
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ?   deleteArray.push(deleteCount.toString())
                :   null          
            })
                deleteCount +=1
        })

        deleteArray.map( item => {
            this.state.gatewayData[item] === undefined 
                ?   null
                :   idPackage.push(parseInt(this.state.gatewayData[item].id))
            }) 
            axios.post(deleteGateway, {
                idPackage
            })
            .then(res => {
                this.props.setMessage('success', 'delete gateway success')
                this.getGatewayData()
                this.setState({
                    selection: [],
                    selectAll: false,
                    showDeleteConfirmation: false
                })
            })
            .catch(err => {
                console.log(err)
            })
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
                    data={this.state.gatewayData} 
                    columns={this.state.gatewayColunm}
                    ref={r => (this.selectTable = r)}
                    className="-highlight"
                    style={{height:'75vh'}}
                    onPageChange={(e) => {
                        this.setState({
                            selectAll:false,
                            selection:''
                        })
                    }} 
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
                    handleSubmit={this.deleteRecordGateway}
                />
            </div>

        )
    }
}
export default GatewayTable
