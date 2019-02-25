import React from 'react';
import { connect } from 'react-redux';

/** Presentational Component */
import Sidebar from '../presentational/Sidebar';


class SidebarContainer extends React.Component {

    render(){
        return (    
            
            <Sidebar menuOption={this.props.menuOption} objectList={this.props.objectList} />
                 
        );
    }   
};

/** Which State do you need */
const mapStateToProps = state => {
    return {
        menuOption: state.sidebarOption.menuOption,
        objectList: state.sidebarOption.objectList,
    }
}

export default connect(mapStateToProps)(SidebarContainer);