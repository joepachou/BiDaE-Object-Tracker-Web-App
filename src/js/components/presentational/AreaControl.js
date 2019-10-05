import React from 'react';
import AuthContext from '../../context/AuthenticationContext'
import roles from '../../roles'


const AreaControl = ({
    permission,
    children,
    renderNoAccess,
}) => {
    const auth = React.useContext(AuthContext);
    if (1) {
        return children;
    }
    return renderNoAccess();
};

export default AreaControl