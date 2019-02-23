/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';

/** Import Presentational Component */
import RecentSearches from '../presentational/RecentSearches';
import SeachableObject from '../presentational/SearchableObject';
import Surveillance from '../presentational/Surveillance';
import AxiosExample from '../../axiosExample';


export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='px-lg-4 py-md-4'>
                <div className='row'>
                    <div className='col'><SeachableObject /></div>
                    <div className='col'><RecentSearches /></div>
                    <div className='col'><ObjectManagementContainer /></div>
                    <div className='col'><Surveillance /></div>
                </div>
            </div>
        )
    }
}