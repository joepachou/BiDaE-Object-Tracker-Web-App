/**
 * EditLbeaconForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */

import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
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
  
class EditLbeaconForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            low: '',
            med: '',
            high: '',
            
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    /**
     * EditLbeaconForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to EditLbeaconForm
     */

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose() {
        this.setState({ 
            show: false,
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    handleSubmit(e) {
        const buttonStyle = e.target.style
        const { low, med, high } = this.state
        const lbeaconPackage = {
            uuid: this.props.selectedObjectData.uuid,
            low: low,
            med: med,
            high: high
        }

        axios.post(dataSrc.editLbeacon, {
            formOption: lbeaconPackage
        }).then(res => {
            buttonStyle.opacity = 0.4
            setTimeout(
                function() {
                   this.setState ({
                       show: false,
                   })
                   this.props.handleSubmitForm()
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    }



    handleChange(e) {
        const target = e.target;
        const { name } = target;
        this.setState({
            [name]: target.value
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

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size="md">
                <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                <Modal.Body>
                    <Form >
                        <Row>
                            <Col sm={3}>
                                UUID
                            </Col>
                            <Col sm={9} className='text-muted pb-1'>
                                {selectedObjectData.uuid}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                Location
                            </Col>
                            <Col sm={9} className='text-muted pb-1'>
                                {selectedObjectData.description}
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col className='font-weight-bold'>
                                RSSI Threshold
                            </Col>
                        </Row>

                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                High
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    placeholder={selectedObjectData ? selectedObjectData.name : ''} 
                                    onChange={this.handleChange} 
                                    value={this.state.high} 
                                    name='high'
                                    style={style.input}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Med
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    placeholder={selectedObjectData ? selectedObjectData.name : ''} 
                                    onChange={this.handleChange} 
                                    value={this.state.med} 
                                    name='med'
                                    style={style.input}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Low
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    placeholder={selectedObjectData ? selectedObjectData.name : ''} 
                                    onChange={this.handleChange} 
                                    value={this.state.low} 
                                    name='low'
                                    style={style.input}
                                />
                            </Col>
                        </Form.Group>

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
        );
    }
}

EditLbeaconForm.contextType = LocaleContext;
  
export default EditLbeaconForm;