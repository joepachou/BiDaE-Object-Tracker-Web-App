/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';

/** Import Presentational Component */
import RecentSearches from '../presentational/RecentSearches';
import SeachableObject from '../presentational/SearchableObject';
import Surveillance from '../presentational/Surveillance';
import AxiosExample from '../../axiosExample';
import TabelContainer from './TableContainer';
import ReactTableContainer from './ReactTableContainer';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
    }
    render(){
        return(

            /** "page-wrap" is to use react-burget-menu */
            <div id="page-wrap" className='px-lg-4 py-md-4'>
                <div className='row'>
                    <div className='col-6'><Surveillance /></div>
                    {/* <div className='col-6'><ObjectManagementContainer /></div> */}
                    {/* <div className='col'><TabelContainer /></div> */}
                    {/* <div className='col'><ReactTableContainer /></div> */}
{/* 
                    <div className='col'><SeachableObject /></div>
                    <div className='col'><RecentSearches /></div> */}
                </div>
            </div>
        )
    }
}