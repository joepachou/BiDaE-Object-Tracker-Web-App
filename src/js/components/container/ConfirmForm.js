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
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import moment from 'moment';

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            formOption: {
                name: '',
                type: '',
                status: '', 
                transferredLocation: null,
            }
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
  
    handleClose(e) {
        console.log(123)
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
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
        const { selectedObjectData } = this.props
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
                formOption: {
                    name: selectedObjectData.name,
                    type: selectedObjectData.type,
                    status: selectedObjectData.status,
                    transferredLocation: selectedObjectData.transferred_location ? {
                        'value' : selectedObjectData.transferred_location,
                        'label' : selectedObjectData.transferred_location
                    } : null,
                }
            })
        }
    }

    handleSubmit(e) {
        this.props.handleConfirmFormSubmit(e)
    }

    handleCheck(e) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                status: e.target.value,
            }
        })
    }

    handleSelect(selectedOption) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                transferredLocation: selectedOption,
            }
        })
    }

  
    render() {

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            }
        }

        const { title, selectedObjectData } = this.props;
        const { name, type, status, transferredLocation } = this.state.formOption;

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="lg">
                    <Modal.Header closeButton>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={3}>
                                    Name
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control 
                                        type="text" 
                                        placeholder={selectedObjectData ? selectedObjectData.name : ''} 
                                        onChange={this.handleChange} 
                                        value={name} 
                                        name='name'
                                        style={style.input}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalPassword">
                                <Form.Label column sm={3}>
                                    Type
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control 
                                        type="text" 
                                        placeholder={selectedObjectData ? selectedObjectData.type : ''} 
                                        onChange={this.handleChange} 
                                        value={type} 
                                        name='type'
                                        style={style.input}
                                        disabled
                                    />
                                </Col>
                            </Form.Group> 
                        </Form>
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h5>{selectedObjectData.status}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().format('LLLL')}</h6>    
                            </Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;