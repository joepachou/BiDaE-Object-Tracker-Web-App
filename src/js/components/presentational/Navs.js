import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import ModalForm from '../container/ModalForm';


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