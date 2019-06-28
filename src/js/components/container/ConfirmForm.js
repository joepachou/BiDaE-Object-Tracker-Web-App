import React from 'react';
import { Modal, Button, Form, Row, Col, Image} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'

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

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md">
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                        <Row>
                                <Col sm={10}>
                                    <Row>
                                        <Col sm={5}>
                                            Device Type
                                        </Col>
                                        <Col sm={7} className='text-muted pb-1'>
                                            {selectedObjectData.type}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={5}>
                                            Device Name
                                        </Col>
                                        <Col sm={7} className='text-muted pb-1'>
                                            {selectedObjectData.name}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={5}>
                                            ACN
                                        </Col>
                                        <Col sm={7} className='text-muted pb-1'>
                                            {selectedObjectData.access_control_number}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={2} className='d-flex align-items-center'>
                                    <Image src={tempImg} width={60}/>
                                </Col>
                            </Row>
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