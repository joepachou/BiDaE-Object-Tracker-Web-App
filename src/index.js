import React from 'react';
import ReactDOM from 'react-dom';
// import FormContainer from "./js/components/container/FormContainer.jsx";
import SideBar from './js/sidebar';
import Content from './js/content';
import HeaderContainer from './js/headerContainer'; 
import './css/App.css';
import './css/sidebar.css'

/** Bootstrap custom css */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import SearchTableContainer from './js/SearchTableContainer';
import FormContainer from './js/components/container/FormContainer.jsx';
import LoginPageContainer from './js/LoginPageContainer';


class App extends React.Component {
        
    render() {
        return (
            <div>
                
                <div><HeaderContainer/></div>
                {/* <div><SideBar /></div> */}
                <SearchTableContainer />
                {/* <Content /> */}
                <div className="container">
                    <LoginPageContainer />
                </div>
                
            </div>
        );
    }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);



