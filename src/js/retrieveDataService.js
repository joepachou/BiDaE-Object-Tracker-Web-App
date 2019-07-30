import Axios from 'axios';
import dataSrc from './dataSrc'
import 'babel-polyfill';
import Cookies from 'js-cookie';


async function getTrackingData () {
    return await Axios.get(dataSrc.getTrackingData)
}

const signout = () => {
    Cookies.remove('userInfo')
    const authentication = {
        authentication: false,
        userInfo: {}
    }
    return authentication
}

export const retrieveDataService = {
    getTrackingData,
    signout
}