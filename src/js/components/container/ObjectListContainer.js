import React from 'react';
import { connect } from 'react-redux';

/** Presentational Component */
import ObjectListMenu from '../presentational/ObjectListMenu';


class ObjectListContainer extends React.Component {

    render(){
        return (    
            <ObjectListMenu menuOption={this.props.menuOption} objectList={this.props.objectList} />
        );
    }   
};

/** Which State do you need */
const mapStateToProps = state => {
    return {
        menuOption: state.objectListOption.menuOption,
        objectList: state.objectListOption.objectList,
    }
}

export default connect(mapStateToProps)(ObjectListContainer);