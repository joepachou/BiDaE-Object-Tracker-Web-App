import { 
    IS_OBJECT_LIST_SHOWN, 
    SELECT_OBJECT_LIST 
} from './actionType';

/** Action Creator  */
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