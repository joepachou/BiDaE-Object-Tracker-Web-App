import dataSrc from '../dataSrc'
import axios from 'axios'

const retrieveDataHelper = {
    
    /**
     * get the tracking data from object_summary_table
     * @param {*} locale: the abbr in locale context
     * @param {*} userInfo: the user object in auth
     * @param {*} areaId: the area_id of current area or the area_id in stateReducer
     */
    getTrackingData: async function (locale, user, areaId) {
        return await axios.post(dataSrc.getTrackingData,{
            locale,
            user,
            areaId,
        })
    },

    getObjectTable: async function(locale, areaId, objectType) {
        return await axios.post(dataSrc.getObjectTable, {
            locale,
            areaId,
            objectType,
        })
    },
    getLbeaconTable: async function(locale) {
        return await axios.post(dataSrc.getLbeaconTable, {
            locale,
        })
    }
}


export default retrieveDataHelper
