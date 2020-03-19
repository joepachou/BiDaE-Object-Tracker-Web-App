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
import SiginForm from '../presentational/SigninForm';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import ShiftChange from './ShiftChange'
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import BatteryLevelNotification from "./BatteryLevelNotification"
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import siteConfig from '../../../../site_module/siteConfig';

class NavbarContainer extends React.Component {

    static contextType = AppContext

    state = {
        showSignin: false,
        showShiftChange: false,
        areaTable: [],
    }

    componentDidMount = () => {
        this.getAreaTable()
    }

    getAreaTable = () => {
        retrieveDataHelper.getAreaTable()
            .then(res => {
                this.setState({
                    areaTable: res.data.rows
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
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
            e.preventDefault()
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

    navList = [
        {
            name: "home",
            alias: "home",
            path: "/",
        },
        {
            name: "object management",
            alias: "objectManagement",
            path: "/page/objectManagement",
            permission: "route:objectManagement"

        },
        {
            name: "monitor setting",
            alias: "monitor",
            path: "/page/monitor",
            permission: "route:monitor",
            platform: ['browser']
        },
        {
            name: "report",
            alias: "report",
            path: "/page/report",
            permission: "route:report",
            platform: ['browser', 'tablet']
        },
        {
            name: "shift change record",
            alias: "shiftChange",
            path: "/",
            permission: "user:shiftChange",
            platform: ['browser', 'tablet'],
            event: this.handleClick
        },
        {
            name: "system status",
            alias: "systemStatus",
            path: "/page/systemStatus",
            permission: "route:systemStatus"
        },
        {
            name: "tracking history",
            alias: "trackingPath",
            path: "/page/trackingPath",
            permission: "route:trackingPath"

        },
        {
            name: "big screen",
            alias: "bigScreen",
            path: "/page/bigScreen",
            permission: "route:bigScreen",
            platform: ['browser']
        },
    ]

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
                                    value: siteConfig.areaModules[value.value].id
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
                        {this.navList.map(nav => {
                            return (
                                <AccessControl
                                    permission={nav.permission}
                                    renderNoAccess={() => null}
                                    platform={nav.platform}
                                    key={nav.alias}
                                >
                                    <Nav.Item>
                                        <Link 
                                            to={nav.path} 
                                            className="nav-link nav-route"
                                            name={nav.alias}
                                            onClick={nav.event}
                                        >
                                            {locale.texts[nav.name.toUpperCase().replace(/ /g, '_')]}
                                        </Link>
                                    </Nav.Item>
                                </AccessControl>
                            )
                        })}
                    </Nav>

                    <Nav className='text-capitalize'>
                        <AccessControl
                            permission={'user:batteryNotice'}
                            renderNoAccess={() => null}
                            platform={['browser', 'tablet']}
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
                                            <Dropdown.Divider />
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