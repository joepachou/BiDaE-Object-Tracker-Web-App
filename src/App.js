import React from 'react';

/** Container Component */
import ContentContainer from './js/components/container/ContentContainer';
import NavbarContainer from './js/components/container/NavbarContainer';
import SidebarContainer from './js/components/container/SidebarContainer';


const App = (props) =>{
    
    return (
        <div>
            <div id='navbar'>
                <NavbarContainer />
            </div>
            <div className='my-6' id='content'>
                <SidebarContainer />
                <ContentContainer />
            </div>
        </div>
    );
    
};

export default App