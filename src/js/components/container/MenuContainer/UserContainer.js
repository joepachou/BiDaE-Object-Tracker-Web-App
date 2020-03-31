import React from 'react';
import { 
    Col, 
    Row, 
    Container
} from 'react-bootstrap';
import AccessControl from '../../presentational/AccessControl'
import { AppContext } from '../../../context/AppContext';
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';
import {
    isBrowser
} from 'react-device-detect'
import {
    userContainerPageList
} from '../../../config/pages'

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

    pageList = userContainerPageList
    
    render(){
        const  { locale } = this.context

        const style = {

            sidenav: {
                width: isBrowser ? 200 : 0,
            },
            sidemain:{
                marginLeft: isBrowser ? 200 : 0
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
                                    platform={page.platform}
                                >
                                    <a
                                        key={index}
                                        style={style.item}
                                        className="border-0 m-0 my-1" 
                                        href={page.href}
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
                                platform={page.platform}
                            >
                                <div className='mb-5'>
                                    <a 
                                        className='anchor'
                                        id={page.name.replace(/ /g, '')}
                                    />
                                    <div
                                        className='h5'
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