import React from 'react';
import AuthContext from '../context/AuthenticationContext'
import LocaleContext from '../context/LocaleContext'
import Locale from '../Locale'
import Auth from '../Auth'
import config from '../config';

export const AppContext = React.createContext();

const AppContextProvider = (props) => {

    const auth = React.useContext(AuthContext)
    const locale = React.useContext(LocaleContext)

    const initialState = {
        areaId: auth.authenticated ? auth.user.areas_id[0] : config.defaultAreaId
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'setArea':
              return {
                ...state,
                areaId: action.value
              };
            default:
              return state;
        }
    }
    
    const stateReducer = React.useReducer(reducer, initialState)

    const value = {
        auth,
        locale,
        stateReducer
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}


const CombinedContext = props => {
    return (
        <Locale>
            <Auth>
                <AppContextProvider>
                    {props.children}
                </AppContextProvider>
            </Auth>
        </Locale>
    )
}

export default CombinedContext







