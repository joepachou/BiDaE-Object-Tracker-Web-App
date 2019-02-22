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
import Sidebar from './js/Sidebar'


class App extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            menuIsOpen: false,
            text: '123',
        }
        this.updateSidebarStyle = this.updateSidebarStyle.bind(this)
        this.get = this.get.bind(this)
    }

    updateSidebarStyle(menuIsOpen){
        this.setState({
            menuIsOpen: menuIsOpen
        })          
    }

    get(text){
        this.setState({
            text: text,
        })
    }
        
    render() {
        return (
            <div>
                <div id='navbar'>
                    <NavbarContainer />
                </div>
                <div className='my-6' id='content'>
                    <Sidebar menuIsOpen={this.state.menuIsOpen}/>
                    <ContentContainer handleSidebarStyle={this.updateSidebarStyle} />
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);



