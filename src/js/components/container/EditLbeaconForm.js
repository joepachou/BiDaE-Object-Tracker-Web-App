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
  
class EditLbeaconForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            formOption: {
                low_rssi: '',
                med_rssi: '',
                high_rssi: '',
            }
            
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
        if (prevProps.show != this.props.show && this.props.show) {
            this.setState({
                show: this.props.show,
                formOption: {
                    low_rssi: this.state.formOption.low_rssi || this.props.selectedObjectData.low_rssi,
                    med_rssi: this.state.formOption.med_rssi || this.props.selectedObjectData.med_rssi,
                    high_rssi: this.state.formOption.high_rssi || this.props.selectedObjectData.high_rssi
                }
            })
        }
    }
  
    handleClose() {
        this.props.handleCloseForm()
        this.setState({ 
            show: false,
            selectedObjectData: {},
            formOption: {
                low_rssi: '',
                med_rssi: '',
                high_rssi: '',
            }
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    handleSubmit(e) {
        const buttonStyle = e.target.style
        const lbeaconSettingPackage = this.state.formOption
        lbeaconSettingPackage.uuid = this.props.selectedObjectData.uuid
        axios.post(dataSrc.editLbeacon, {
            formOption: lbeaconSettingPackage
        }).then(res => {
            buttonStyle.opacity = 0.4
            setTimeout(
                function() {
                    this.setState({
                        formOption: {},
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
            formOption: {
                ...this.state.formOption,
                [name]: target.value
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
                                Low
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    onChange={this.handleChange} 
                                    value={this.state.formOption.low_rssi} 
                                    name='low_rssi'
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
                                    onChange={this.handleChange} 
                                    value={this.state.formOption.med_rssi} 
                                    name='med_rssi'
                                    style={style.input}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                High
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    onChange={this.handleChange} 
                                    value={this.state.formOption.high_rssi} 
                                    name='high_rssi'
                                    style={style.input}
                                />
                            </Col>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={this.handleClose}>
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