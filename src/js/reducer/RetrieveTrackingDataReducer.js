import { 
    SHOULD_UPDATE_TRACKING_DATA,
} from '../action/actionType';
import config from '../config';

const initialState = {
    shouldTrackingDataUpdate: config.surveillanceMap.startInteval,
}

function RetrieveTrackingDataReducer (state = initialState, action) {
    switch(action.type) {
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