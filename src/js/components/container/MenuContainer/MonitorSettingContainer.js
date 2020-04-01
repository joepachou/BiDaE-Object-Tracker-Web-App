import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Tab, 
    ListGroup,
    Container
} from 'react-bootstrap';
import { monitorSettingPageList } from '../../../config/pages'

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

class MonitorSettingContainer extends React.Component{

    static contextType = AppContext

    state = {
        nowIndex:0,
    }

    tabList = monitorSettingPageList

    defaultActiveKey = "movement_monitor"

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
                                    <ListGroup.Item 
                                        key={index}
                                        className="border-0 m-0 my-1" 
                                        eventKey={tab.name.replace(/ /g, '_')}
                                        onClick={() => this.setState({nowIndex :index})}
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
                                    nowIndex : this.state.nowIndex
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

export default MonitorSettingContainer