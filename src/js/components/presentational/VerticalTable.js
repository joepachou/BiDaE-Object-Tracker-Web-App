import React from "react";
import Table from 'react-bootstrap/Table'



const VerticalTable = (props) => {


    const tdStyle = {
        padding: 0,
        paddingLeft: 5,
        border: 'hidden',
        color: 'grey',
        width: '50%', 
        fontSize: '1.5vmin',

    }

    const thStyle = {
        padding:0,
        border: 'hidden',
        width: '50%', 
        fontSize: '1.5vmin',
    }    

    return (
        <Table>
            <tbody className="text-uppercase">
                <tr className="table-tr" >
                    <th className="text-right font-weight-bold" style={thStyle}>Name</th>
                    <td className="text-left " style={tdStyle}>123</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right font-weight-bold" style={thStyle}>Object Type</th>
                    <td className="text-left" style={tdStyle}>123</td>
                </tr>

            </tbody>
        </Table>
    )
}

export default VerticalTable;
