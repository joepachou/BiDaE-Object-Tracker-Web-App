import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../dataSrc";
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import MyDeviceManager from './MyDeviceManager'
import ShiftChangeRecord from './ShiftChangeRecord'
import AdminManagementContainer from './AdminManagementContainer'
import EditObjectManagement from './EditObjectManagement'
import LocaleContext from '../../../context/LocaleContext';
import AccessControl from '../../presentational/AccessControl'
import AuthenticationContext from '../../../context/AuthenticationContext';

class UserSettingContainer extends React.Component{
    constructor() {
        super();
        this.pageList = [
            {
                name: 'Devices Management',
                path: 'devicesManagement',
                component: <MyDeviceManager />
            },
            {
                name: 'Shift Change Record',
                path: 'shiftChangeRecord',
                component: <ShiftChangeRecord />
            },
            {
                name: 'User Manager',
                path: 'userManager',
                component: <AdminManagementContainer />
            },
            {
                name: 'Edit Object Management',
                path: 'editObjectManagement',
                component: <EditObjectManagement />
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
        const locale = this.context
        const style = {
            item: {
                // fontSize: '1.2rem'
            },
            sideNav: {
                // position: 'fixed',
            },
            component: {
                position: 'relative'
            }
        }
        return (
            <Container fluid className='mt-5' >
                <Row className='' noGutters>
                    <Col lg={2} style={style.sideNav}>
                        <ListGroup variant="flush" className="border-0 text-capitalize">
                            <ListGroup.Item className="border-0 h5 pt-0">{locale.texts.USER_SETTING}</ListGroup.Item>
                            {this.pageList.map((page, index) => {
                                return(
                                    <AccessControl
                                        permission={'route:'+ page.path}
                                        renderNoAccess={() => null}
                                    >
                                        <ListGroup.Item 
                                            key={index}
                                            style={style.item}
                                            className="border-0 m-0" 
                                            href={'#' + page.name.replace(/ /g, '')}
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
                        {this.pageList.map((page, index) => {
                            return (
                                <AccessControl
                                    permission={'route:'+ page.path}
                                    renderNoAccess={() => null}
                                >
                                    <div className='mb-5' key={index} id={page.name.replace(/ /g, '')}>   
                                        <h5 className='text-capitalize'>
                                            {locale.texts[page.name.toUpperCase().replace(/ /g, '_')]}
                                        </h5>
                                        <hr/>
                                        <Row className="w-100d-flex bg-white py-1">
                                            <Col>
                                                {page.component}
                                            </Col>
                                        </Row>
                                    </div >
                                </AccessControl>
                            )
                        })}
                    </Col>
                </Row>     
            </Container>       
        )
    }
}
UserSettingContainer.contextType = LocaleContext;

export default UserSettingContainer