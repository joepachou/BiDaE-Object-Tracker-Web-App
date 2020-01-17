import dataSrc from '../dataSrc'
import axios from 'axios'

const retrieveData = {
    getObjectTable: async function(locale, areaId, objectType) {
        return await axios.post(dataSrc.getObjectTable, {
            locale,
            areaId,
            objectType,
        })
    }

}


export default retrieveData
