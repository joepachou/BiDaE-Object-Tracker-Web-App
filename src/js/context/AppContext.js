import React from 'react';
import AuthContext from '../context/AuthenticationContext'
import LocaleContext from '../context/LocaleContext'
import Locale from '../Locale'
import Auth from '../Auth'
import config from '../config';
import StateReducer from '../reducer/StateReducer'

export const AppContext = React.createContext();

const AppContextProvider = (props) => {

    const auth = React.useContext(AuthContext)
    const locale = React.useContext(LocaleContext)

    const initialState = {
        // areaId: auth.authenticated ? auth.user.areas_id[0] : config.mapConfig.defaultAreaId,
        areaId: config.mapConfig.defaultAreaId,
        shouldUpdateTrackingData: true
    }
    
    const stateReducer = React.useReducer(StateReducer, initialState)

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







