/** React Plugin */
import React from 'react';

/** Presentational Component */
import NavBar from '../presentational/Navbar';
// import SearchBar from './searchBar';

export default class HeaderContainer extends React.Component{
    render(){
        return(
            <div>
                <NavBar />
            </div>    
        )
    }
}