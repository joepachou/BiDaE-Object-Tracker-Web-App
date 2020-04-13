import React from 'react'
import {
    Tab,
    Nav
} from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext'
import AccessControl from '../presentational/AccessControl'
import {
    BOTContainer,
    PageTitle,
    BOTNav,
    BOTNavLink
} from '../../config/styleComponent'

const TabletPageComponent = ({
    containerModule,
    setMessage
}) => {

    let locale = React.useContext(LocaleContext)
    let {
        tabList,
        title,
        defaultActiveKey
    } = containerModule
    return (
        <BOTContainer>     
            <PageTitle>                                            
                {title}
            </PageTitle>
            <Tab.Container 
                defaultActiveKey={defaultActiveKey}
            >
                <BOTNav
                    style={{
                        width: 500,
                    }}
                >
                    {tabList.map(tab => {
                        return (
                            <AccessControl
                                renderNoAccess={() => null}
                                platform={tab.platform}
                                key={tab.name}
                            >
                                <Nav.Item>
                                    <BOTNavLink eventKey={tab.name.replace(/ /g, '_')}>
                                        {locale.texts[tab.name.replace(/ /g, '_').toUpperCase()]}
                                    </BOTNavLink>
                                </Nav.Item>
                            </AccessControl>
                        )
                    })}
                </BOTNav>
                <Tab.Content
                    className="my-3"
                >
                    {tabList.map(tab => {
                        let props = {
                            type: tab.name,
                            setMessage,
                        }
                        return (
                            <AccessControl
                                renderNoAccess={() => null}
                                platform={tab.platform}
                                key={tab.name}
                            >
                                <Tab.Pane eventKey={tab.name.replace(/ /g, '_')}> 
                                    {tab.component(props)}
                                </Tab.Pane>
                            </AccessControl>
                        )
                    })}
                </Tab.Content>
            </Tab.Container>
        </BOTContainer>
    )
}
export default TabletPageComponent
