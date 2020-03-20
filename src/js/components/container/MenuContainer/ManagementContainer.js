import React from 'react';
import { AppContext } from '../../../context/AppContext';
import ObjectManagement from './ObjectManagementContainer';
import AdminManagementContainer from './AdminManagementContainer'
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

class ManagementContainer extends React.Component{

    static contextType = AppContext

    tabList = [
        {
            name: 'object management',
            component: (props) => <ObjectManagement {...props}/>
        },
        {
            name: 'user manager',
            component: (props) => <AdminManagementContainer {...props}/>
        },
    ]

    defaultActiveKey = "object_management"

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

export default ManagementContainer