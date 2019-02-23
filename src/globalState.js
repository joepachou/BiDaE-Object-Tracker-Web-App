import UPDATE_MENU_OPTION from './actionType';

// Store

let callbacks = [];

let globalState = {
    menuOption:{
        isOpen: false,
    }
}

const notifyAll = () => {
    for(var i = 0; i < callbacks.length; i++){
        callbacks[i](globalState)
    }
}

export const subscribe = (callback) => {
    callbacks.push(callback)
}


export const setGlobalState = (state) => {
    globalState =  state;
    notifyAll();
}

export const dispatch = (action) => {
    /** new state = reducer(currenState, action) */
    globalState = reducer(globalState, action)
    notifyAll();
}

const reducer = (globalState, action) => {
    switch (action.type) {
        case UPDATE_MENU_OPTION:
            return {
                ...globalState,
                menuOption: {
                    isOpen: action.value
                }
            }
        default:
            return globalState
    }
}