/** React Plugin */
import React from 'react';
import { 
    BrowserRouter as Router, 
    Route, 
    Link, 
    NavLink 
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import { 
    Navbar, 
    Nav, 

    Image, 
    Dropdown  
} from 'react-bootstrap'
import SiginForm from './SigninForm';
import config from '../../config';
import AccessControl from './AccessControl';
import ShiftChange from '../container/ShiftChange'
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import BatteryLevelNotification from "../container/BatteryLevelNotification"

class NavbarContainer extends React.Component {

    static contextType = AppContext

    state = {
        showSignin: false,
        showShiftChange: false,
    }

    handleSigninFormSubmit = () => {
        this.setState({
            showSignin: false,
        })
    }

    handleClose = () => {
        this.setState({
            showSignin: false,
            showShiftChange: false
        })
    }

    handleClick = (e) => {
        let name = e.target.getAttribute('name')
        switch(name) {
            case "shiftChange":
            this.setState({
                showShiftChange: true
            })
            break;
            case "signin":
            this.setState({
                showSignin: true,
            })
            break;
        }
    }

    handleShiftChangeRecordSubmit = () => {
        this.setState({
            showShiftChange: false
        })
    }

    render= () => {
        const style = {
            navbar: {
                boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
                fontWeight: '450',
                marginBottom: 10,
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
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                }),
                
                control: () => ({
                    width: 200,
                }),
                
                singleValue: (provided, state) => ({
                    opacity: state.isDisabled ? 0.5 : 1,
                    transition: 'opacity 300ms',
                    cursor: 'pointer',
                }),

            }
        }
        const { 
            locale, 
            auth, 
            stateReducer 
        } = this.context;
        const [{ areaId }, dispatch] = stateReducer
        const { 
            showSignin, 
            showShiftChange
        } = this.state;

        const {
            areaOptions,
            defaultAreaId,
        } = config.mapConfig

        const options = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')],
            }
        })

        let selectedArea = {
            value: areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0],
            label: this.context.locale.texts[areaOptions[areaId]] || 
                this.context.locale.texts[areaOptions[defaultAreaId]] || 
                this.context.locale.texts[Object.values(areaOptions)[0]]
        }

        return (
            <Navbar
                id="navbar"  
                bg="white" 
                className="navbar sticky-top navbar-light text-capitalize" 
                expand="lg"
                fixed="top" 
                collapseOnSelect
                style={style.navbar}
            >
                <Navbar.Brand className='px-0 mx-0'>  
                    <Nav.Item className="nav-link nav-brand d-flex align-items-center px-0 " style={style.navbarBrand}>
                        <Image
                            alt=""
                            src={config.image.logo}
                            width={50}
                            className="d-inline-block align-top px-1"
                        />
                        <Select
                            placeholder = {locale.texts.SELECT_LOCATION}
                            name="select"
                            value = {selectedArea}
                            options={options}
                            onChange={value => {
                                let { stateReducer } = this.context
                                let [{areaId}, dispatch] = stateReducer
                                dispatch({
                                    type: 'setArea',
                                    value: config.mapConfig.areaModules[value.value].id
                                })
                            }}
                            styles={style.customStyles}
                            isSearchable={false}
                            components={{
                                IndicatorSeparator: () => null,
                                DropdownIndicator:() => null
                            }}
                        />
                    </Nav.Item> 
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="responisve-navbar-nav" />
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
                            permission={'route:objectManagement'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/objectManagement" className="nav-link nav-route" >{locale.texts.OBJECT_MANAGEMENT}</Link></Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'route:systemStatus'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/systemStatus" className="nav-link nav-route" >{locale.texts.SYSTEM_STATUS}</Link></Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'user:shiftChange'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item
                                className="nav-link nav-route" 
                                name="shiftChange"
                                onClick={this.handleClick}
                            >
                                {locale.texts.SHIFT_CHANGE_RECORD}
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={'route:bigScreen'}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item><Link to="/page/bigScreen" className="nav-link nav-route" >{locale.texts.BIG_SCREEN}</Link></Nav.Item>
                        </AccessControl>

                    </Nav>
                    <Nav className='text-capitalize'>
                        <AccessControl
                            permission={'user:batteryNotice'}
                            renderNoAccess={() => null}
                        >
                            <BatteryLevelNotification />
                        </AccessControl>
                        <Nav.Item 
                            className="nav-link nav-route" 
                            name={'en'}
                            onClick={(e) => locale.changeLocale(e, auth)}                         
                        >
                            {locale.toggleLang().nextLangName}
                        </Nav.Item>
                        {auth.authenticated
                            ?   (
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant='light'
                                        id="collasible-nav-dropdown" 
                                    >
                                        <i className="fas fa-user-alt" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        bsPrefix='bot-dropdown-menu-right  dropdown-menu '
                                    >
                                        <div className="dropdownWrapper">
                                            <LinkContainer to="/page/userSetting" className="bg-white">
                                                <Dropdown.Item className="lang-select">
                                                    {auth.user.name}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Divider />
                                            <LinkContainer to='/page/about' className="bg-white">
                                                <Dropdown.Item className="lang-select">
                                                    {locale.texts.ABOUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/" className="bg-white">
                                                <Dropdown.Item className="lang-select" onClick={auth.signout}>
                                                    {locale.texts.SIGN_OUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown> 
                            )

                            :   (
                                <Nav.Item 
                                    className="nav-link nav-route" 
                                    onClick={this.handleClick}
                                    name="signin"
                                >
                                    {locale.texts.SIGN_IN}
                                </Nav.Item>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>

                <SiginForm 
                    show={showSignin}
                    handleSubmit={this.handleSigninFormSubmit}
                    handleClose={this.handleClose}
                    signin={auth.signin}
                />
                <ShiftChange 
                    show={showShiftChange}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleShiftChangeRecordSubmit}
                    userInfo={auth.user}
                />
            </Navbar>
        );
    }
}

export default NavbarContainer;