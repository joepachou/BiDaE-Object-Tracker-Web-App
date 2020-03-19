import React from 'react';
import { 
    Container,
    Tab,
    ListGroup
} from 'react-bootstrap';
import ShiftChangeRecord from './UserContainer/ShiftChangeRecord'
import EditObjectManagement from './UserContainer/EditObjectManagement'
import { AppContext } from '../../context/AppContext';

const style = {

    sidenav: {
        width: 150 
    },
    sidemain:{
        marginLeft: 150
    },
    container: {
        overflowX: 'hide'
    }
}

class ReportContainer extends React.Component{

    static contextType = AppContext

    tabList = [
        {
            name: 'Edit Object Management',
            component: (props) => <EditObjectManagement {...props} />
        },
        {
            name: 'Shift Change Record',
            component: (props) => <ShiftChangeRecord {...props}/>,
        },
    ]

    defaultActiveKey = "Edit_Object_Management"

    render(){
        const  { 
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
                        <div className="border-0 h5 mt-0 mb-1">
                            {/* {locale.texts.USER_SETTING} */}
                        </div>
                        <ListGroup variant="flush" className="border-0 text-capitalize">
                            {this.tabList.map((tab, index) => {
                                return (
                                    <ListGroup.Item 
                                        key={index}
                                        className="border-0 m-0 my-1" 
                                        eventKey={tab.name.replace(/ /g, '_')}
                                        action
                                    >
                                        {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                                    </ListGroup.Item>
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
                            console.log(tab.name.replace(/ /g, '_'))
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

export default ReportContainer