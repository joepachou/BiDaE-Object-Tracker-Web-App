/** React Plugin */
import React from 'react';
import ReactDOM from 'react-dom';


/** Bootstrap Custom CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/** Import Custom CSS */
import './customCSS';

/** Container Component */
import ContentContainer from './js/components/container/ContentContainer';
import NavbarContainer from './js/components/container/NavbarContainer';
import Sidebar from './js/Sidebar';


class App extends React.Component {

    render() {
        return (
            <div>
                <div id='navbar'>
                    <NavbarContainer />
                </div>
                <div className='my-6' id='content'>
                    <Sidebar />
                    <ContentContainer />
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById('root');
ReactDOM.render(
    <App />, rootElement
);



