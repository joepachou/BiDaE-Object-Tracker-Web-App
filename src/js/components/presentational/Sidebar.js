import React from 'react';
import { slide as Menu } from 'react-burger-menu';



export default class Sidebar extends React.Component {
    constructor(){
        super()
        this.state = {
            customBurgerIcon: false,
            width: 350,
            noOverlay: true,
            isOpen: false,
        }
    }
    render(){
        const { menuOption, objectList } = this.props;
        return (            
            <Menu {...this.state} {...menuOption}>
                {objectList.map((items,index) => {
                    return (
                        <a className="menu-item" href="/" key={index}><div><i class="fas fa-user-alt mr-2"></i>    {items.name}</div></a>
                    )
                })}
            </Menu>
        );
    }   
};
