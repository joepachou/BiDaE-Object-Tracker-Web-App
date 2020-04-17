import React, { Fragment } from 'react';
import { 
    Fade,
    
} from 'react-transition-group'
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import config from '../../../config' 
import { 
    Nav,
    Tab,
} from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../../context/AppContext';
import AccessControl from '../../presentational/AccessControl'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'
import ImportObjectTable from '../../presentational/ImportObjectTable'
import ImportPatientTable from '../../presentational/ImportPatientTable' 
import DissociationForm from '../DissociationForm'
import retrieveDataHelper from '../../../service/retrieveDataHelper'
import {
    BOTContainer,
    BOTNavLink,
    BOTNav,
    PageTitle
} from '../../../config/styleComponent'


class ObjectManagementContainer extends React.Component{
    static contextType = AppContext
    
    state = {
        column:[], //設備列表的欄位設定
        columnImport:[],//匯入的欄位設定
        columnPatient:[],//病人列表的欄位設定
        data:[],//object data
        dataImport: [],//object import data
        dataPatient:[],//patient data
        dataImportPatient:[],// patient import data
        objectTable: [],//ＤＢ抓出來的object table data   
        locale: this.context.locale.abbr,
        tabIndex: 0, 
        roomOptions: {}, 
        // transferredLocationList: [], 
        filterSelection: {
            statusOptions: config.statusOptions.map(item => {
                return {
                    value: item,
                    label: this.context.locale.texts[item.replace(/ /g, '_').toUpperCase()]
                }
            }),
            monitorTypeOptions: config.monitorOptions.map(item => {
                return {
                    value: item,
                    label: item 
                }
            })
           
        },
        objectFilter: [],
        patientFilter: [],
        formTitle:'',
        areaTable: [],
        loadingFlag : false,
        filteredData: [],
        filteredPatient: [],
    }

    defaultActiveKey = "devices_table"
    
    render(){
        const {  
            filterSelection
        } = this.state

        const { locale } = this.context

        let typeSelection = filterSelection.typeList ? Object.values(filterSelection.typeList) : null;
        return (     
            <BOTContainer>     
                <PageTitle>                                            
                    {locale.texts.OBJECT_MANAGEMENT}
                </PageTitle>
                <Tab.Container 
                    transition={Fade}
                    defaultActiveKey={this.defaultActiveKey}
                >
                    <BOTNav>
                        <Nav.Item>
                            <BOTNavLink eventKey="devices_table">
                                {locale.texts.DEVICE_FORM}
                            </BOTNavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <BOTNavLink eventKey="patients_table">
                                {locale.texts.PATIENT_FORM}
                            </BOTNavLink>
                        </Nav.Item>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey="import_devices">
                                    {locale.texts.IMPORT_DEVICES_DATA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey="import_patients">
                                    {locale.texts.IMPORT_PATIENTS_DATA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                    </BOTNav>
                    <Tab.Content
                        className="my-3"
                    >
                        <Tab.Pane eventKey="devices_table"> 
                            <ObjectTable
                                importData={this.state.dataImport}
                                objectTable={this.state.objectTable} 
                                addObjectFilter = {this.addObjectFilter}
                                removeObjectFilter ={ this.removeObjectFilter}
                                typeSelection = {typeSelection}
                                filterSelection={this.state.filterSelection}
                                areaTable={this.state.areaTable}
                                loadingFlag = {this.state.loadingFlag}
                            /> 
                        </Tab.Pane>

                        <Tab.Pane eventKey="patients_table">
                            <PatientTable
                                importData={this.state.dataImport}
                                objectTable={this.state.objectTable} 
                                addPatientFilter = {this.addPatientFilter}
                                removePatientFilter = {this.removePatientFilter}
                                typeSelection = {typeSelection}
                                filterSelection={this.state.filterSelection}
                                dataImportPatient = {this.state.dataImportPatient}
                                physicianList={this.state.physicianList}
                                roomOptions={this.state.roomOptions} 
                                areaTable={this.state.areaTable}
                                loadingFlag = {this.state.loadingFlag}
                            />
                        </Tab.Pane>
                        
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Tab.Pane eventKey="import_devices">
                                <ImportObjectTable />
                            </Tab.Pane>
                        </AccessControl>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Tab.Pane eventKey="import_patients">
                                <ImportPatientTable />
                            </Tab.Pane>
                        </AccessControl>
                    </Tab.Content>
                </Tab.Container>
            </BOTContainer>
        )
    }
}

export default ObjectManagementContainer
