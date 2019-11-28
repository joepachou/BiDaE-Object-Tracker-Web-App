/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Image, Dropdown  } from 'react-bootstrap'
import SigninPage from '../container/SigninPage';
import config from '../../config';
import AccessControl from './AccessControl';
import ShiftChange from '../container/ShiftChange'
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';

class NavbarContainer extends React.Component {

    static contextType = AppContext

    state = {
        isShowSigninForm: false,
        isShowShiftChange: false,
        auth: this.context.auth
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { auth } = this.context
        if (!(_.isEqual(prevState.auth, auth))) {
            const [{ areaId }, dispatch] = this.context.stateReducer
            const { auth } = this.context
            dispatch({
                type: "setArea",
                value: auth.authenticated ? auth.user.areas_id[0] : config.mapConfig.defaultAreaId
            })
            this.setState({
                auth,
            })
        }
    }

    handleSigninFormShowUp = () => {
        this.setState({
            isShowSigninForm: true,
            isShowSignupForm: false,
        })
    }

    handleSignupFormShowUp = () => {
        this.setState({
            isShowSigninForm: false,
        })
        setTimeout(
            function (){
                this.setState({
                    isShowSignupForm: true,
                })
            }.bind(this),
            300
        )
    }

    handleSigninFormSubmit = () => {
        this.setState({
            isShowSigninForm: false,
        })
    }

    handleSignupFormSubmit = () => {
        setTimeout(
            function(){
                this.setState({
                    isShowSignupForm: false,
                })
            }.bind(this),
            1000
        )
    }

    handleSignFormClose = () => {
        this.setState({
            isShowSigninForm: false,
            isShowSignupForm: false,
        })
    }

    handleShiftChangeRecordShowUp = () => {
        this.setState({
            isShowShiftChange: true
        })
    }

    handleShiftChangeRecordClose = () => {
        this.setState({
            isShowShiftChange: false
        })
    }

    render= () => {
        const style = {
            navbar: {
                boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
                fontWeight: '450',
                marginBottom: 10
            },
            navbarBrand: {
                color: 'black'
            },
            select: {
                border: 0,
            },
            customStyles: {

                option: (provided, state) => ({
                    ...provided,
                //   borderBottom: '1px dotted pink',
                //   color: state.isSelected ? 'red' : 'blue',
                    padding: '0.5rem',
                    fontSize: '1rem'
                }),

                control: () => ({
                  // none of react-select's styles are passed to <Control />
                    width: 230,
                }),
                
                singleValue: (provided, state) => {
                    const opacity = state.isDisabled ? 0.5 : 1;
                    const transition = 'opacity 300ms';
                
                    return { ...provided, opacity, transition };
                }
            }
        }
        const { locale, auth, stateReducer } = this.context;
        const [{ areaId }, dispatch] = stateReducer

        const { 
            isShowSigninForm, 
            isShowShiftChange
        } = this.state;

        const options = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')],
            }
        })

        let selectedArea = {
            value: config.mapConfig.areaOptions[areaId],
            label: this.context.locale.texts[config.mapConfig.areaOptions[areaId]],
        }

        return (
            <Navbar id='navbar' bg="white" className="navbar sticky-top navbar-light" expand='lg' style={style.navbar}>
                <Navbar.Brand className='px-0 mx-0 text-capitalized'>  
                    <Nav.Item className="nav-link nav-brand d-flex align-items-center px-0 text-capitalized" style={style.navbarBrand}>
                        <Image
                            alt=""
                            src={config.image.logo}
                            width={50}
                            className="d-inline-block align-top px-1"
                        />
                        {/* <div className="text-capitalize">
                            {locale.texts[config.mapConfig.areaOptions[areaId]]}
                        </div> */}
                        <Select
                            placeholder = {locale.texts.SELECT_LOCATION}
                            name="select"
                            value = {selectedArea}
                            className="text-capitalize"
                            onChange={value => {
                                let { stateReducer } = this.context
                                let [{areaId}, dispatch] = stateReducer
                                dispatch({
                                    type: 'setArea',
                                    value: config.mapConfig.areaModules[value.value].id
                                })
                            }}
                            options={options}
                            // isDisabled={values.radioGroup !== config.objectStatus.TRANSFERRED}
                            styles={style.customStyles}
                            isSearchable={false}
                            components={{
                                IndicatorSeparator: () => null,
                                DropdownIndicator:() => null
                            }}
                        />
                    </Nav.Item>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">  
                    <Nav className="mr-auto text-capitalize my-auto" >
                        <Nav.Item><Link to="/" className="nav-link nav-route" >{locale.texts.HOME}</Link></Nav.Item>
                        <AccessControl
                            permission={'route:geofence'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/geofence" className="nav-link nav-route" >{locale.texts.GEOFENCE}</Link></Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'route:systemStatus'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/systemStatus" className="nav-link nav-route" >{locale.texts.SYSTEM_STATUS}</Link></Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'route:objectManagement'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/objectManagement" className="nav-link nav-route" >{locale.texts.OBJECT_MANAGEMENT}</Link></Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'user:shiftChange'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item
                                className="nav-link nav-route" 
                                onClick={this.handleShiftChangeRecordShowUp}
                            >
                                {locale.texts.SHIFT_CHANGE_RECORD}
                            </Nav.Item>
                        </AccessControl>

                        <Nav.Item><Link to="/page/bigScreen" className="nav-link nav-route" >{locale.texts.BIG_SCREEN}</Link></Nav.Item>

                    </Nav>
                    <Nav className='text-capitalize'>
                        <Nav.Item 
                            className="nav-link nav-route" 
                            onClick={locale.changeLocale}
                            name={'en'}
                        >
                            {locale.toggleLang().nextLangName}
                        </Nav.Item>
                        {auth.authenticated
                            ? 
                                <NavDropdown title={<i className="fas fa-user-alt"></i> }id="collasible-nav-dropdown" alignRight>
                                    <LinkContainer to="/page/userSetting" className="bg-white">
                                        <NavDropdown.Item className="lang-select">{auth.user.name}</NavDropdown.Item>
                                    </LinkContainer>
                                    <Dropdown.Divider />
                                    {/* <AccessControl
                                        permission={'user:shiftChange'}
                                        renderNoAccess={() => null}
                                    >
                                        <NavDropdown.Item 
                                            className="lang-select" 
                                            onClick={this.handleShiftChangeRecordShowUp}
                                        >
                                            {locale.texts.SHIFT_CHANGE_RECORD}
                                        </NavDropdown.Item>
                                        <Dropdown.Divider />
                                    </AccessControl> */}
                                    <LinkContainer to="/" className="bg-white">
                                        <NavDropdown.Item className="lang-select" onClick={auth.signout}>{locale.texts.SIGN_OUT}</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown> 
                            : 
                                <Nav.Item className="nav-link nav-route" onClick={this.handleSigninFormShowUp}>{locale.texts.SIGN_IN}</Nav.Item>
                        }
                    </Nav>
                </Navbar.Collapse>

                <SigninPage 
                    show={isShowSigninForm}
                    handleSigninFormSubmit={this.handleSigninFormSubmit}
                    handleSignupFormShowUp={this.handleSignupFormShowUp}
                    handleSignFormClose={this.handleSignFormClose}
                    signin={auth.signin}
                />
                <ShiftChange 
                    show = {isShowShiftChange}
                    handleShiftChangeRecordSubmit = {this.handleShiftChangeRecordSubmit}
                    handleShiftChangeRecordClose={this.handleShiftChangeRecordClose}
                    userInfo={auth.user}
                />
            </Navbar>
        );
    }
}

export default NavbarContainer;