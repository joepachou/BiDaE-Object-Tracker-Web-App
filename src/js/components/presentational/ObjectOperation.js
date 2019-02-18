import React from 'react';
import PropTypes from "prop-types";

const ObjectOperation = (props) =>{
    return(
        <div>
            <h2><a>{props.title}</a></h2>
        </div>
    )
}

ObjectOperation.propTypes = {
    title : PropTypes.string.isRequired
}

ObjectOperation.defaultProps = {
    title : 'New Operation'
}

export default ObjectOperation;