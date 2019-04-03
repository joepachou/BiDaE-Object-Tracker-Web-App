/** React Library */
import React from 'react';
import ReactDOM from 'react-dom';

/** Redux related Library  */
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';

/** Bootstrap Custom CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/** Import Custom CSS */
import './js/customizedCSS';

/** Container Component */
import App from './App'
import objectListReducer from './js/reducer/ObjectListReducer';


const reducers = combineReducers({
    objectListOption: objectListReducer,
})
const store = createStore(reducers)

store.subscribe(() => console.log(store.getState()))



const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, rootElement
);




