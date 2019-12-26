import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../dataSrc";
import { Tab, Col, Row, Button, Nav, Container} from 'react-bootstrap';
import ShiftChangeRecord from './ShiftChangeRecord'
import ShiftChangeRecord2 from './ShiftChangeRecord2'
import AdminManagementContainer from './AdminManagementContainer'
import EditObjectManagement from './EditObjectManagement'
import LocaleContext from '../../../context/LocaleContext';
import AccessControl from '../../presentational/AccessControl'
import DeviceManager from './DeviceManager'
import MyDeviceManager from './MyDeviceManager';
import MyPatientManager from './MyPatientManager';
import MonitorSetting from "./MonitorSetting";
import UserProfile from "./UserProfile";
class UserSettingContainer extends React.Component{
    constructor() {
        super();

        this.pageList = [
            {
                name: 'User Profile',
                path: 'userProfile',
                href: '#UserProfile',
                component: <UserProfile />
            },
            {
                name: 'Devices Management',
                path: 'devicesManagement',
                href: '#DevicesManagement',
                component: <MyDeviceManager />
            },
            {
                name: 'Patient Management',
                path: 'patientManagement',
                href: '#PatientManagement',
                component: <MyPatientManager />
            },
            {
                name: 'User Manager',
                path: 'userManager',
                href: '#UserManager',
                component: <AdminManagementContainer />
            },
            {
                name: 'Edit Object Management',
                path: 'editObjectManagement',
                href: '#EditObjectManagement',
                component: <EditObjectManagement />
            },
            {
                name: 'Shift Change Record',
                path: 'shiftChangeRecord',
                href: '#ShiftChangeRecord',
                component: <ShiftChangeRecord2 />
            },
            {
                name: "Monitor Setting",
                path: "monitorSetting",
                href: "#MonitorSetting",
                component: <MonitorSetting />
            }
        ]
    }
    // sideNavMouseOver(e){
    //     e.target.style.fontSize = "1.6rem"
    // }
    // sideNavMouseLeave(e){
    //     e.target.style.fontSize = "1.5rem"
    // }


    render(){
        var indexNumber = 0
        const locale = this.context
        const style = {
            title: {
                fontSize: '1.6rem',
                fontWeight: 600,
            },
            main:{
                //border: 'solid',
                width: '100vw',
                height: '85vh'
            },
            sideNav: {
                //width: '200px',
                //border: 'solid',
                //position: 'fixed'
            },
            component: {
                overflow: 'scroll',
                //border: 'solid'
                //position: 'absolute'
            }
        }

        function onClickHandler(index){
            console.log(index)
        }

        return (
            <Container fluid className="mt-5">
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#UserProfile" className='mt-5' >
                    <Row className='' noGutters>
                        <div className='d-flex flex-row'style={style.main}>
                            <Col lg={2} style={style.sideNav}>
                                <ListGroup variant="flush" className="border-0 text-capitalize">
                                    <ListGroup.Item className="border-0 h5 mt-0 mb-1">{locale.texts.USER_SETTING}</ListGroup.Item>
                                    {this.pageList.map((page, index) => {
                                        return (
                                            <AccessControl
                                                permission={'route:'+ page.path}
                                                renderNoAccess={() => null}
                                                key={index}
                                                //onClick={onClickHandler(page)}
                                            >
                                                <ListGroup.Item 
                                                    key={index}
                                                    style={style.item}
                                                    className="border-0 m-0 my-1" 
                                                    href={page.href}
                                                    action
                                                >
                                                    {locale.texts[page.name.toUpperCase().replace(/ /g, '_')]}
                                                </ListGroup.Item>
                                            </AccessControl>
                                        )
                                    })}
                                </ListGroup>
                            </Col>

                            <Col lg={10} className="" style={style.component}>
                                <Tab.Content>
                                    {this.pageList.map((page, index) => {
                                                return (
                                                    <AccessControl
                                                        permission={'route:'+ page.path}
                                                        renderNoAccess={() => null}
                                                        key={index}
                                                    >
                                                        <Tab.Pane className='mb-5' eventKey={page.href} id={page.name.replace(/ /g, '')}>   
                                                            <div style={style.title} className='text-capitalize'>
                                                                {locale.texts[page.name.toUpperCase().replace(/ /g, '_')]}
                                                            </div>
                                                            <hr/>
                                                            <Row className="w-100d-flex bg-white py-1">
                                                                <Col>
                                                                    {page.component}
                                                                </Col>
                                                            </Row>
                                                        </Tab.Pane >
                                                    </AccessControl>
                                                )
                                    })}
                                </Tab.Content>
                            </Col>
                        </div>
                    </Row>     
                </Tab.Container>  
            </Container>     
        )
    }
}
UserSettingContainer.contextType = LocaleContext;

export default UserSettingContainer