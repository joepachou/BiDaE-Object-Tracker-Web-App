/** React Library */
import React from 'react';
import ReactDOM from 'react-dom';

/** Redux related Library  */
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';

/** Bootstrap Custom CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/** Import Custom CSS */
import './js/customCSS';

/** Container Component */
import App from './App'
import sidebarReducer from './js/SidebarReducer';


const reducers = combineReducers({
    sidebarOption: sidebarReducer,
})
const store = createStore(reducers)

store.subscribe(() => console.log(store.getState()))



const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, rootElement
);




