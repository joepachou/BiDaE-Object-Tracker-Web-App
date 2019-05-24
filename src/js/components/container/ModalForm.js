import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import styled from 'styled-components';


class ModalForm extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
            show: this.props.show,
            editObjectFormIsShow: false,
            
        };
    }
  
    handleClose() {
        this.setState({ 
            show: false 
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                editObjectFormIsShow: true,
            })
        }
    }

  
    render() {

        const { title } = this.props;

        const style = {
            button: {
                
            }
        }

        return (
            <>
                {/* <Button onClick={this.handleShow} variant="primary" style={style.button}>{title}</Button> */}

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