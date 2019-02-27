import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import ListItem from './ListItem';
import BOTLogo from '../../../img/BOTLOGO.png'


export default class Sidebar extends React.Component {
    constructor(){
        super()
        this.state = {
            customBurgerIcon: false,
            width: 400,
            noOverlay: true,
            isOpen: false,
        }

    }
    render(){
        const { menuOption, objectList } = this.props;

        const customListStyle = {
            paddingRight: '0.5em',
        }
        return (            
            <Menu {...this.state} {...menuOption}>
                {/* <div id='TopBox' style={TopBoxStyle}>
                    <h3>lbeacon number : </h3>
                </div> */}
                {/* <div className="card" style="width: 18rem">
                    <img className="card-img-top" src={BOTLogo} width={5} alt="Card image cap"/>
                    <div className="card-body">
                        <p className="card-text">一樓大廳</p>
                    </div>
                </div> */}
                <div className="list-group list-group-flush" style={customListStyle}>
                    {objectList.map((items,index) => {
                        return (
                            <ListItem key={index} href={'123'} itemName={items.name} />
                        )
                    })}
                </div>
            </Menu>
        );
    }   
};
