import React from 'react';

/** Import Presentational Component */
import ObjectOperation from '../presentational/ObjectOperation.js';

export default class ObjectManagement extends React.Component{

    render(){
        return (
            <div id='ObjectManagemnt'>
                <ObjectOperation title={'Manage Objects'}/>
                <ObjectOperation title={'Add new Objects'}/>
                <ObjectOperation title={'Remove Objects'}/>
                <ObjectOperation title={'Mark Objects'}/>
                <ObjectOperation title={'Hide Marked Objects'}/>
            </div>
        )
    }
}