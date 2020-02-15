import React from 'react';
import AuthContext from '../../context/AuthenticationContext'
import roles from '../../roles'


const AccessControl = ({
    permission,
    children,
    renderNoAccess,
}) => {
    const auth = React.useContext(AuthContext);
    let ownedPermissions = auth.user.permissions
    console.log(ownedPermissions, permission)
    const permitted = ownedPermissions.includes(permission) 
    // const permitted = true
    if (permitted) {
        return children;
    }
    return renderNoAccess();
};

export default AccessControl