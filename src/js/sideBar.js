import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import { subscribe } from '../globalState';


class Sidebar extends React.Component {
    constructor(){
        super()
        this.state = {
            menuOption: {
                noOverlay: true,
            }
        }
    }
    render(){
        return (            
            <Menu {...this.state.menuOption} {...this.props.menuOption}>
                <a className="menu-item" href="/">Your Profile</a>
            </Menu>
        );
    }   
};
    

// HOC, Higher Order Component
function connect (Component) {
    class Wrapper extends React.Component{

        constructor(){
            super()
            this.updateState = this.updateState.bind(this)
        }
        componentDidMount(){
            subscribe(this.updateState)
        }

        updateState(globalState) {
            this.setState(globalState)
        }

        render(){
            return <Component {...this.state} />
        }
    }
    return Wrapper
}

export default connect(Sidebar);