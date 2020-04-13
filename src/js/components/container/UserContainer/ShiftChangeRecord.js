import React from 'react';
import { 
    Button,
    ButtonToolbar
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import dataSrc from "../../../dataSrc"
import selecTableHOC from 'react-table/lib/hoc/selectTable';
const SelectTable = selecTableHOC(ReactTable);
import { shiftChangeRecordTableColumn } from '../../../config/tables'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { AppContext } from '../../../context/AppContext';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import styleConfig from '../../../config/styleConfig';

class ShiftChangeRecord extends React.Component{

    static contextType = AppContext

    state = {
        data: [],
        columns: [],
        showForm: false,
        locale: this.context.abbr,
        selectAll: false,
        selection: [],
        showDeleteConfirmation: false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getShiftChangeRecord()
                this.setState({
                locale: this.context.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getShiftChangeRecord()
    }

    getShiftChangeRecord(){
        let {
            locale
        } = this.context

        retrieveDataHelper.getShiftChangeRecord(locale.abbr)
            .then(res => {
                let columns = _.cloneDeep(shiftChangeRecordTableColumn)
                columns.map(field => {
                    field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                    field.headerStyle = {
                        textAlign: 'left',
                        textTransform: 'capitalize'
                    }
                })
                res.data.rows.map(item => {
                    item.shift = item.shift && locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
                })
                this.setState({
                    data: res.data.rows,
                    columns,
                })
            })
            .catch(err => {
                console.log(`get shift change record failed ${err}`)
            })
    }

    toggleAll = () => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            currentRecords.forEach(item => {
                if (item._original) {
                selection.push(item._original.id);
                }
            });
        }
      
       
        this.setState({ selectAll, selection });
    };

    toggleSelection = (key, shift, row) => {
       
        if(key != 999){  //多的
        let selection = [...this.state.selection];
        const selectThis = this.state.selectThis ? false : true;

        key = typeof key === 'number' ? key : parseInt(key.split('-')[1])
        const keyIndex = selection.indexOf(key.toString());
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex+1)
            ];
            
        } else {
         
            selection.push(key.toString());
        }
 
        this.setState({ selectThis, selection });
        }

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    }

    deleteRecord = () => {


        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;

        this.state.data.map (item => {
    
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
        this.state.data[item] === undefined ?
              null
            :
            idPackage.push(parseInt(this.state.data[item].id))
        })

        axios.post(dataSrc.deleteShiftChangeRecord, {
            idPackage
        })
        .then(res => {
            this.getShiftChangeRecord()
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

    handleCloseDeleteConfirmForm = () => {
        this.setState({
            showDeleteConfirmation: false,
        })
    }

    handleSubmitDeleteConfirmForm = (pack) => {
        this.deleteRecord()
    }

    render(){
        const {
            locale
         } = this.context

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
                <ButtonToolbar
                    className="mb-2"
                >                    
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        size="sm"
                        onClick={() => {
                            this.setState({
                                showDeleteConfirmation: true
                            })
                        }}    
                    >
                        {locale.texts.DELETE}
                    </Button>
                </ButtonToolbar>
                {this.state.data && (
                    <SelectTable
                        keyField='id'
                        data={this.state.data}
                        columns={this.state.columns}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        style={{height:'75vh'}}
                        {...extraProps}
                        {...styleConfig.reactTable}
                        getTrProps={(state, rowInfo, column, instance) => {
                           
                            return {
                                onClick: (e, handleOriginal) => {
                                    let id = rowInfo.index+1
                                    this.toggleSelection(id)
                                    if (handleOriginal) {
                                        handleOriginal()
                                    }
                                    window.open(dataSrc.pdfUrl(rowInfo.original.file_path));
                                }
                            }
                        }}
                    />)
                }
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleCloseDeleteConfirmForm}
                    handleSubmit={this.handleSubmitDeleteConfirmForm}
                />
            </>
        )
    }
}

export default ShiftChangeRecord