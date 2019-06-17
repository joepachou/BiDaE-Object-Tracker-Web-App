import { 
    IS_OBJECT_LIST_SHOWN, 
    SELECT_OBJECT_LIST,
    RETRIEVE_TRACKING_DATA
} from './actionType';

/** Action Creator for Sidebar */
export const isObjectListShown = (value) => {
    return {
        type: IS_OBJECT_LIST_SHOWN,
        value: value
    }
}

export const selectObjectList = (array) => {
    return {
        type: SELECT_OBJECT_LIST,
        array: array,
    }
}

/** Retrieve tracking data action creator */
export const retrieveTrackingData = (objectInfo) => {
    return {
        type: RETRIEVE_TRACKING_DATA,
        object: objectInfo
    }
}