import{ UPDATE_MENU_OPTION } from './actionType';
import{ SHOW_OBJECT_LIST } from './actionType'


const initialState = {
    menuOption : {
        isOpen: false,
    },
    objectList :[],

}

function reducer (state = initialState, action) {
    switch (action.type) {
        case UPDATE_MENU_OPTION:
            return {
                ...state,
                menuOption : {
                    ...this,
                    isOpen: true,
                }
                
            }
        case SHOW_OBJECT_LIST:
            return {
                ...state,
                objectList: action.array    
            }
        default:
            return state
    }
}

export default reducer