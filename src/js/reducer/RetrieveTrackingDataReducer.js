import { RETRIEVE_TRACKING_DATA } from '../action/actionType';

const initialState = {
    objectInfo: {},
}

function RetrieveTrackingDataReducer (state = initialState, action) {
    switch(action.type) {
        case (RETRIEVE_TRACKING_DATA):
            return  action.object
            
        default:
            return state
            
    }
}

export default RetrieveTrackingDataReducer;