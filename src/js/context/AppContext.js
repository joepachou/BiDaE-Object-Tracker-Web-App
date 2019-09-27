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
        area: auth.authenticated ? auth.user.area : config.surveillanceMap.defaultArea
    }
    const reducer = (state, action) => {
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







