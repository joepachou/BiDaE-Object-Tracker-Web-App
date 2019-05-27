import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import VerticalTable from '../presentational/VerticalTable';


class ModalForm extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    
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

    handleSubmit(e) {
        console.log(this);

        e.preventDefault();
    }

  
    render() {

        const { title, selectedObjectData } = this.props;

        const style = {
            button: {
                
            }
        }

        return (
            <>
                {/* <Button onClick={this.handleShow} variant="primary" style={style.button}>{title}</Button> */}
                <Modal show={this.state.show} onHide={this.handleClose} >
                {console.log(selectedObjectData)}
                    <Modal.Header>{title}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group as={Row} >
                                <Form.Label column sm={5}>
                                    Device Name
                                </Form.Label>
                                <Col sm={7} >
                                    <Form.Control type="text" placeholder={selectedObjectData ? selectedObjectData.name : null} disabled/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={5} >
                                    Device Type
                                </Form.Label>
                                <Col sm={7} >
                                    <Form.Control type="text" placeholder={selectedObjectData ? selectedObjectData.name : null} disabled/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={5}>
                                    ACN
                                </Form.Label>
                                <Col sm={7} >
                                    <Form.Control type="text" placeholder={selectedObjectData ? selectedObjectData.id : null} disabled/>
                                </Col>
                            </Form.Group>
                            <hr></hr>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column sm={4}>
                                        Status
                                    </Form.Label>
                                    <Col sm={8}>
                                    
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Normal"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Broken"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Transferred"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                        />
                                        <select class="custom-select custom-select-lg mb-3" disabled>
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
                                            
                                    </Col>
                                </Form.Group>
                             </fieldset>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
  
export default ModalForm;