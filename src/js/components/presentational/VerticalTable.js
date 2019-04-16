import React from "react";
import Table from 'react-bootstrap/Table'
import styled from 'styled-components';



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
                    <td className="text-left " style={tdStyle}>{props.item.name}</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right font-weight-bold" style={thStyle}>Object Type</th>
                    <td className="text-left" style={tdStyle}>{props.item.type}</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right table_th" style={thStyle}>Location</th>
                    <td className="text-left" style={tdStyle}>{props.item.location}</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right table_th" style={thStyle}>Status</th>
                    <td className="text-left" style={tdStyle}>{props.item.status}</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right table_th" style={thStyle}>Access control number</th>
                    <td className="text-left" style={tdStyle}>{props.item.ACN}</td>
                </tr>
                <tr className="table-tr">
                    <th className="text-right table_th" style={thStyle}>Manufacturer ID</th>
                    <td className="text-left" style={tdStyle}>{Math.floor(Math.random() * 1000)}</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default VerticalTable;
