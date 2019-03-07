import React from "react";

import ReactTable from "react-table";
import 'react-table/react-table.css';


export default class ReactTableContainer extends React.Component {

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
