import dataSrc from '../dataSrc'
import axios from 'axios'

const retrieveData = {
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


export default retrieveData
