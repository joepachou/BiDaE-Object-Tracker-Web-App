import React from 'react';
import { 
    Button, 
    ButtonToolbar 
} from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './../presentational/EditLbeaconForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import config from '../../config';
import { 
    deleteLBeacon,
} from "../../dataSrc"
import { 
    lbeaconTableColumn,
} from '../../tables';
import { AppContext } from '../../context/AppContext';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import retrieveDataHelper from '../../helper/retrieveDataHelper'

const SelectTable = selecTableHOC(ReactTable);

class LbeaconTable extends React.Component{
    
    static contextType = AppContext
    
    state = {  
        lbeaconData: [],
        lbeaconColumn: [],
        showDeleteConfirmation:false,
        selectedRowData: '',
        showEdit: false,
        selection:[],
        selectAll :false,
        selectType:''
    }

    componentDidMount = () => {
        this.getLbeaconData();
        this.getLbeaconDataInterval = this.startSetInterval ? setInterval(this.getLbeaconData, config.healthReport.pollLbeaconTabelIntevalTime) : null;
    }

    componentWillUnmount = () => {
        clearInterval(this.getLbeaconDataInterval);
    }

    getLbeaconData = () => {

        let { locale } = this.context
        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res => {
            this.props.setMessage('clear')
            let column = _.cloneDeep(lbeaconTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                lbeaconData: res.data.rows,
                lbeaconColumn: column,
                showEdit: false
            }) 
        })
        .catch(err => {
            this.props.setMessage(
                'error', 
                true,
                'connect to database failed'
            )
            console.log(`get lbeacon data failed ${err}`);
        })

    }

    handleClose = () => {
        this.setState({ 
            showDeleteConfirmation: false,
            selectedRowData: '',
            showEdit: false, 
            selectAll :false,
            selectType:''
        })
    }  

    handleSubmitForm = () => {
        this.props.setMessage(
            'success', 
            'edit lbeacon success'
        )
        this.getLbeaconData()
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
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item.id)
                } 
            });
        } else {
            selection = [];
        }
        this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };
 
    deleteRecord = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
        this.state.lbeaconData.map (item => {
        
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                    ?   deleteArray.push(deleteCount.toString())
                    :   null          
            })
                deleteCount +=1
        })

       

        deleteArray.map( item => {
            this.state.lbeaconData[item] === undefined 
                ?   null
                :   idPackage.push(parseInt(this.state.lbeaconData[item].id))
            }) 
            axios.post(deleteLBeacon, {
                idPackage
            })
            .then(res => {
                this.getLbeaconData()
                this.props.setMessage(
                    'success', 
                    null,
                    'delete lbeacon success'
                )
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
                                showDeleteConfirmation: true
                            })
                        }}
                    >
                        {locale.texts.DELECT_LBEACON}
                    </Button>
                </ButtonToolbar>
                <SelectTable
                    keyField='id'
                    data={this.state.lbeaconData}
                    columns={this.state.lbeaconColumn}
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
                                    showEdit: true,
                                })
                            }
                        }
                    }}
                />
                <EditLbeaconForm 
                    show= {this.state.showEdit} 
                    title={'edit lbeacon'}
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmit={this.handleSubmitForm}
                    handleClose={this.handleClose}
                />

                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.deleteRecord}
                />
            </div>

        )
    }
}
export default LbeaconTable
