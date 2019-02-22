import React from 'react';
import { slide as Menu } from 'react-burger-menu';

export default class Sidebar extends React.Component {

    // constructor(props){
    //     super(props)
    // }
    render(){
        return (
            
            <Menu isOpen={this.props.menuIsOpen} noOverlay>
                <a className="menu-item" href="/">Your Profile</a>

                <a className="menu-item" href="/laravel">Settings</a>

                <a className="menu-item" href="/angular">Connections</a>

                <a className="menu-item" href="/react">About BOT</a>

                <a className="menu-item" href="/vue">Privacy & Terms</a>

                <a className="menu-item" href="/node">Support</a>

                <a className="menu-item" href="/node">Log Out</a>
            </Menu>
        );
    }   
};