import { 
    UPDATE_MENU_OPTION, 
    SHOW_OBJECT_LIST 
} from './actionType';

/** Action Creator  */
export const updateMenuOption = (value) => {
    return {
        type: UPDATE_MENU_OPTION,
        value: value
    }
}

export const showObjectList = (array) => {
    return {
        type: SHOW_OBJECT_LIST,
        array: array,
    }
}