import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Tab, Col, Row, Button, Nav, Container} from 'react-bootstrap';
import ShiftChangeRecord from './ShiftChangeRecord'
import AdminManagementContainer from './AdminManagementContainer'
import EditObjectManagement from './EditObjectManagement'
import AccessControl from '../../presentational/AccessControl'
import MyDeviceManager from './MyDeviceManager';
import MyPatientManager from './MyPatientManager';
import MonitorSetting from "./MonitorSetting";
import UserProfile from "./UserProfile";
import TransferredLocationManagement from "./TransferredLocationManagement";
import RolePermissionManagement from "./RolePermissionManagement"
import { AppContext } from '../../../context/AppContext';
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';
import {
    BrowserView,
    MobileOnlyView,
    TabletView,
    isBrowser
} from 'react-device-detect'

class UserSettingContainer extends React.Component{

    static contextType = AppContext

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        enableBodyScroll(targetElement);

    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }

    pageList = [
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
            component: <ShiftChangeRecord />
        },
        {
            name: "Monitor Setting",
            path: "monitorSetting",
            href: "#MonitorSetting",
            component: <MonitorSetting />
        },
        {
            name: "Transferred Location Management",
            path: "transferredLocationManagement",
            href: "#TransferredLocationManagement",
            component: <TransferredLocationManagement />
        },
        {
            name: "Role Permission Management",
            path: "rolePermissionManagement",
            href: "#RolePermissionManagement",
            component: <RolePermissionManagement />
        }
    ]
    
    render(){
        const  { locale } = this.context

        const style = {

            sidenav: {
                width: isBrowser ? 180 : 0,
            },
            sidemain:{
                marginLeft: isBrowser ? 180 : 0
            },
            container: {
                overflowX: 'hide'
            }
        }

        return (
            <Container 
                fluid 
                className="mt-5 text-capitalize"
                style={style.container}
            >
                <div 
                    className="border-0 BOTsidenav"
                    style={style.sidenav}
                >
                    <div className="border-0 h5 mt-0 mb-1">
                        {locale.texts.USER_SETTING}
                    </div>
                    <div>
                        {this.pageList.map((page, index) => {
                            return (
                                <AccessControl
                                    permission={'route:'+ page.path}
                                    renderNoAccess={() => null}
                                    key={index}
                                >
                                    <a
                                        key={index}
                                        style={style.item}
                                        className="border-0 m-0 my-1" 
                                        href={page.href}
                                        action
                                    >
                                        {locale.texts[page.name.toUpperCase().replace(/ /g, '_')]}
                                    </a>
                                </AccessControl>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="BOTsidemain"
                    style={style.sidemain}
                >
                    {this.pageList.map((page, index) => {
                        return (
                            <AccessControl
                                permission={'route:'+ page.path}
                                renderNoAccess={() => null}
                                key={index}
                            >
                                <div className='mb-5'>
                                    <a 
                                        className='anchor'
                                        id={page.name.replace(/ /g, '')}
                                    />
                                    <div
                                        className='h4'
                                    >
                                        {locale.texts[page.name.toUpperCase().replace(/ /g, '_')]}
                                    </div>
                                    <hr/>
                                    <Row className="w-100d-flex bg-white py-1">
                                        <Col>
                                            {page.component}
                                        </Col>
                                    </Row>
                                </div>
                            </AccessControl>
                        )
                    })}
                </div>
            </Container>     
        )
    }
}

export default UserSettingContainer