import React from 'react';

import Banner from './navbar';
import SearchBar from './searchBar';

export default class HeaderContainer extends React.Component{
    render(){
        return(
            <div>
                <Banner />
                <SearchBar />
            </div>    
        )
    }
}