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

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class ChangeStatusForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            formOption: {
                status: 'Normal', 
                transferredLocation: null,
            }
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
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
        const { selectedObjectData } = this.props;

        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
                formOption: {
                    name: selectedObjectData ? selectedObjectData.name : '',
                    type: selectedObjectData ? selectedObjectData.type : '',
                    status: selectedObjectData ? selectedObjectData.status : '',
                    transferredLocation: selectedObjectData && selectedObjectData.transferred_location ? {
                        'value' : selectedObjectData.transferred_location,
                        'label' : selectedObjectData.transferred_location
                    } : null,
                }
            })
        }
    }

    handleSubmit(e) {
        const button = e.target;
        const { mac_address, name, type } = this.props.selectedObjectData;
        const { status, transferredLocation } = this.state.formOption;
        console.log(this.props)
        const postOption = {
            name: name,
            type: type,
            status: status,
            transferredLocation: transferredLocation || '',
            mac_address: mac_address
        }
        axios.post(dataSrc.editObject, {
            formOption: postOption
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                   this.setState ({
                       show: false,
                   }) 
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
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
                            <hr/>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column sm={3}>
                                        Status
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Normal"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            value="Normal"
                                            checked={status === 'Normal'}
                                            onChange={this.handleCheck}                                     
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Broken"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                            value="Broken"
                                            checked={status === 'Broken'}

                                            onChange={this.handleCheck}   
                                        />
                                        <Form.Row>
                                            <Form.Group as={Col} sm={4}>
                                                <Form.Check
                                                    custom
                                                    type="radio"
                                                    label="Transferred"
                                                    name="formHorizontalRadios"
                                                    id="formHorizontalRadios3"
                                                    value="Transferred"
                                                    checked={status === 'Transferred'}
                                                    onChange={this.handleCheck}   
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} sm={8} >
                                                    <Select
                                                        placeholder = "Select Location"
                                                        value = {transferredLocation}
                                                        onChange={this.handleSelect}
                                                        options={options}
                                                        isDisabled = {status === 'Transferred' ? false : true}
                                                    />
                                            </Form.Group>
                                            
                                        </Form.Row>
                                    </Col>
                                </Form.Group>
                             </fieldset>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

ChangeStatusForm.contextType = LocaleContext;
  
export default ChangeStatusForm;