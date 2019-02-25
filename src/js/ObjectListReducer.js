import{ SHOW_OBJECT_LIST } from './actionType'

const initialState = {
    objectList :[],
}

function ObjectListReducer (state = initialState, action) {
    switch (action.type) {
        case SHOW_OBJECT_LIST:
            return {
                ...initialState,
                objectList: action.array    
            }
        default:
            return state
    }
}

export default ObjectListReducer