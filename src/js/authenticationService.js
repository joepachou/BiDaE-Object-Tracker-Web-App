import Axios from 'axios';
import dataSrc from '../js/dataSrc'
import 'babel-polyfill';
import Cookies from 'js-cookie';


async function signin (username, password) {
    let result = await Axios.post(dataSrc.signin, {
        username: username,
        password: password
    })

    return result
}

const signout = () => {
    Cookies.remove('userInfo')
    const authentication = {
        authentication: false,
        userInfo: {}
    }
    return authentication
}

export const authenticationService = {
    signin, 
    signout
}