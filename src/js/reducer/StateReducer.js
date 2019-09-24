import React from 'react'
import { AppContext } from '../context/AppContext'

export const initialState = {
    area: "IIS_SINICA_FLOOR_FOUR"
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'changeArea':
          return {
            ...state,
            area: action.value
          };
        default:
          return state;
    }
}

const StateReducer = {
    initialState,
    reducer
}

export default StateReducer
