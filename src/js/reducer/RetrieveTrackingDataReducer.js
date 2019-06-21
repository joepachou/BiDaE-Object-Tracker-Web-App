import { RETRIEVE_TRACKING_DATA, SHOULD_UPDATE_TRACKING_DATA } from '../action/actionType';
import config from '../config';

const initialState = {
    shouldTrackingDataUpdate: config.surveillanceMap.startInteval,
    objectInfo: {},
}

function RetrieveTrackingDataReducer (state = initialState, action) {
    switch(action.type) {
        case RETRIEVE_TRACKING_DATA:
            return {
                ...state,
                objectInfo: action.object
            } 
        case SHOULD_UPDATE_TRACKING_DATA:
            return {
                ...state,
                shouldTrackingDataUpdate: action.value
            }

        default:
            return state
            
    }
}

export default RetrieveTrackingDataReducer;