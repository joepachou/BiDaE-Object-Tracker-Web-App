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
import { deleteShiftChangeRecord } from '../../../dataSrc'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
const SelectTable = selecTableHOC(ReactTable);
import { getPDFInfo } from "../../../dataSrc";
import { shiftChangeRecordTableColumn } from '../../../tables'
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
            this.getPDFInfo()
                this.setState({
                locale: this.context.abbr
            })
        }
    }



    getEditObjectRecord = () => {
        let locale = this.context
    }

    componentDidMount = () => {
        this.getPDFInfo()
    }

    itemLayout = (record, index) => {
        return(
            <h5 name={record.id}>
                User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
            </h5>
        ) 
    }


    onCloseForm = () => {
        this.setState({
            showForm: false
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
       
        if(key != 999){
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
    };

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

        // console.log(deleteArray)
        // console.log(this.state.data)
        deleteArray.map( item => {
        this.state.data[item] === undefined ?
              null
            :
            idPackage.push(parseInt(this.state.data[item].id))
        })

        axios.post(deleteShiftChangeRecord, {
            idPackage
        })
        .then(res => {
            this.getPDFInfo()
            this.setState({
                selection: [],
                selectAll: false,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }







    //shift change merge
    getPDFInfo(){
        let locale = this.context
        axios.post(getPDFInfo, {
            locale: locale.abbr
        })
        .then(res => {
            let columns = _.cloneDeep(shiftChangeRecordTableColumn)
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.headerStyle = {
                    textAlign: 'left'
                }
            })
            res.data.rows.map(item => {
                item.shift = item.shift && locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
            })
            // this.API.setShiftChangeRecord(res.data.rows)
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
    }
    //

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: e => {
                let file_path = rowInfo.original.file_path
                let path = `http://${process.env.DATASRC_IP}/${file_path}`
                window.open(path);
            }
        }
    }
    render(){
        const { record } = this.state
        const locale = this.context

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
                {this.state.data ? (
                
                    <SelectTable
                        keyField='id'
                        data={this.state.data}
                        columns={this.state.columns}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        style={{height:'75vh'}}
                        {...extraProps}
                        getTrProps={(state, rowInfo, column, instance) => {
                           
                            return {
                                onClick: (e, handleOriginal) => {
                                    let id = rowInfo.index+1
                                    this.toggleSelection(id)
                                    if (handleOriginal) {
                                        handleOriginal()
                                    }
                                    window.open(`http://${process.env.DATASRC_IP}/${rowInfo.original.file_path}`);
                                
                            //開pdf的功能看有沒有要
                            //  window.open(`http://${process.env.DATASRC_IP}/${rowInfo.original.file_path}`);
                                }
                            }
                        }
                        }
                    />
                    ) : null
                }
                
            </>
            
        )
    }
}
EditObjectManagement.contextType = LocaleContext;

export default EditObjectManagement