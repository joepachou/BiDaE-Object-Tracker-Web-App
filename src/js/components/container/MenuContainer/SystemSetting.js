import React from 'react';
import { AppContext } from '../../../context/AppContext';
import RolePermissionManagement from '../UserContainer/RolePermissionManagement'
import AdminManagementContainer from './AdminManagementContainer'
import TransferredLocationManagement from '../TransferredLocationManagement'
import AccessControl from '../../presentational/AccessControl'
import LBeaconTable from '../LBeaconTable';
import GatewayTable from '../GatewayTable'
import messageGenerator from '../../../helper/messageGenerator'
import { toast } from 'react-toastify';

import { 
    Tab, 
    ListGroup,
    Container
} from 'react-bootstrap';

const style = {

    sidenav: {
        width: 150,
    },
    sidemain:{
        marginLeft: 150
    },
    container: {
        overflowX: 'hide'
    },
}

class SystemSetting extends React.Component{

    static contextType = AppContext

    setMessage = (type, msg, isSetting) => {

        switch(type) {
            case 'success':
                this.toastId = messageGenerator.setSuccessMessage(msg)
                break;
            case 'error':
                if (isSetting && !this.toastId) {
                    this.toastId = messageGenerator.setErrorMessage(msg)
                } 
                break;
            case 'clear':
                this.toastId = null;
                toast.dismiss(this.toastId)
                break;
        }
    }

    tabList = [
        {
            name: 'user manager',
            permission: "route:bigScreen",
            component: (props) => <AdminManagementContainer {...props}/>,
            platform: ['browser'],
        },
        {
            name: "transferred location management",
            component: (props) => <TransferredLocationManagement {...props}/>,
        },
        {
            name: "Role Permission Management",
            permission: "rolePermissionManagement",
            component: (props) => <RolePermissionManagement {...props}/>,
            platform: ['browser', 'tablet']
        },
        {
            name: "lbeacon",
            component: (props) => <LBeaconTable {...props}/>,
            platform: ['browser', 'tablet']
        },
        {
            name: "gateway",
            component: (props) => <GatewayTable {...props}/>,
            platform: ['browser', 'tablet']
        }
    ]

    defaultActiveKey = "user_manager"

    render() {
        let {
            locale
        } = this.context

        return (
            <Container 
                fluid 
                className="mt-5 text-capitalize"
                style={style.container}
            >     
                <Tab.Container 
                    transition={false} 
                    defaultActiveKey={this.defaultActiveKey}
                    className='mt-5' 
                >
                    <div 
                        className="border-0 BOTsidenav"
                        style={style.sidenav}
                    >            
                        <ListGroup 
                            variant="flush" 
                            className="border-0"
                        >
                            {this.tabList.map((tab, index) => {
                                return (
                                    <AccessControl
                                        permission={tab.permission}
                                        renderNoAccess={() => null}
                                        platform={tab.platform}
                                        key={tab.name}
                                    >
                                        <ListGroup.Item 
                                            key={index}
                                            className="border-0 m-0 my-1 text-capitalize" 
                                            eventKey={tab.name.replace(/ /g, '_')}
                                            action
                                        >
                                            {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                                        </ListGroup.Item>
                                    </AccessControl>
                                )
                            })}  
                        </ListGroup>      
                                      
                    </div>
                    <div
                        className="BOTsidemain"
                        style={style.sidemain}
                    >           
                        <Tab.Content>
                            {this.tabList.map((tab, index) => {
                                let props = {
                                    type: tab.name,
                                    setMessage: this.setMessage
                                }
                                return (
                                    <Tab.Pane 
                                        eventKey={tab.name.replace(/ /g, '_')}
                                        key={tab.name.replace(/ /g, '_')}
                                    >
                                        <div
                                            className='h5'
                                        >
                                            {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                                        </div>
                                        <hr/>
                                        {tab.component(props)}
                                    </Tab.Pane>
                                )
                            })}
                        </Tab.Content>         
                    </div>
                </Tab.Container>
            </Container>
        )
    }
}

export default SystemSetting