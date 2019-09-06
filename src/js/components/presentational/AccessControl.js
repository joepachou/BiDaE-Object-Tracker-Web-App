import React from 'react';
import AuthContext from '../../context/AuthenticationContext'
import roles from '../../roles'


const AccessControl = ({
    permission,
    children,
    renderNoAccess,
}) => {
    const auth = React.useContext(AuthContext);
    console.log(roles[auth.user.role])
    const permitted = roles[auth.user.role].permission.includes(permission)
    if (permitted) {
        return children;
    }
    return renderNoAccess();
};

export default AccessControl