import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import styled from 'styled-components';


class ModalForm extends React.Component {
    
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
            show: false,
        };
    }
  
    handleClose() {
      this.setState({ show: false });
    }
  
    handleShow() {
      this.setState({ show: true });
    }
  
    render() {

        const { title } = this.props;

        const ModalHeader = styled(Modal.Header)`
            padding: 0;
        `

        return (
            <>
                <ListGroup.Item variant="light" onClick={this.handleShow}>{title}</ListGroup.Item>
                    
                <Modal show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header>{title}</Modal.Header>
                    <Modal.Body>
                        <div>Woohoo, you're reading this text in a modal!
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
  
export default ModalForm;