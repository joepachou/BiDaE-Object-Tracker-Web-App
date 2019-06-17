import{ 
    IS_OBJECT_LIST_SHOWN, 
    SELECT_OBJECT_LIST,
} from '../action/actionType';


const initialState = {
    menuOption : {
        isOpen: false,
    },
    objectList :[],

}

function ObjectListReducer (state = initialState, action) {
    switch (action.type) {
        case IS_OBJECT_LIST_SHOWN:
            return {
                ...state,
                menuOption : {
                    ...this,
                    isOpen: true,
                }
                
            }
        case SELECT_OBJECT_LIST:
            return {
                ...state,
                objectList: action.array    
            }
        default:
            return state
    }
}

export default ObjectListReducer