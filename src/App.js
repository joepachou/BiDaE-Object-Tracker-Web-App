import React from 'react';

/** Container Component */
import ContentContainer from './js/components/container/ContentContainer';
import NavbarContainer from './js/components/container/NavbarContainer';
import ObjectListContainer from './js/components/container/ObjectListContainer';


const App = (props) =>{
    
    return (
        <div>
            <div id='navbar'>
                <NavbarContainer />
            </div>
            <div className='my-6' id='contentContainer'>
                <ObjectListContainer />
                <ContentContainer />
            </div>
        </div>
    );
    
};

export default App