import React from 'react';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup'
import ModalForm from '../container/ModalForm';
import styled from 'styled-components';


class Navs extends React.Component {
    constructor(){
        super()
        this.state = {
            show : false,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({
            show:true,
        })
    }

    

    render(){

        return (
            <ListGroup variant="flush">
                <ModalForm title='Add new objects'/>
                <ModalForm title='Remove objects'/>
            </ListGroup>
        )
    }
}

export default Navs;