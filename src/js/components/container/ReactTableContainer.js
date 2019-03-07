import React from "react";
import axios from 'axios';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import dataAPI from "../../../../dataAPI";


export default class ReactTableContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            data:[],
            column:[],
        }
    }

    render() {      
        return (
            <div>
                <ReactTable
                  data={this.props.data}
                  columns={this.props.column}
                />
            </div>
        )
      }
  
}
