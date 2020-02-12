import React from 'react';
import AuthContext from '../../context/AuthenticationContext'
import roles from '../../roles'


const AccessControl = ({
    permission,
    children,
    renderNoAccess,
}) => {
    const auth = React.useContext(AuthContext);
    console.log(auth)
    let ownedPermissions = auth.user.permissions
    const permitted = ownedPermissions.includes(permission)
    if (permitted) {
        return children;
    }
    return renderNoAccess();
};

export default AccessControl