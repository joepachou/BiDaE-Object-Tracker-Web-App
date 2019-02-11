import React from 'react';
import ReactDOM from 'react-dom';
// import FormContainer from "./js/components/container/FormContainer.jsx";
import sidebar from "./sidebar";
import Banner from './banner'
import SideBar from './sidebar';
import './App.css';


class App extends React.Component {
  render() {
    return (
        <div>
            <Banner /> 
            <SideBar />
            
        </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);



