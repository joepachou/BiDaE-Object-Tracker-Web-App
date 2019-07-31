import React from 'react';
import { Modal, Button, Form, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'
  
class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            showAddDeviceForm: false,
            showNotesControl: false,
            notesText:'',
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addedDevice = this.addedDevice.bind(this);
        this.handleAddDeviceFormClose = this.handleAddDeviceFormClose.bind(this)
    }
  
    handleClose(e) {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false ,
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
                isShowForm: true,
            })
        }
    }

    handleChange(e) {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    handleClick(e) {
        const item = e.target.innerText.toLowerCase();
        switch(item) {
            case 'add device':
                this.setState({
                    showAddDeviceForm: true
                })
                break;
            case 'remove device':
                console.log(item)
                break;
            case 'add notes':
            case 'hide notes':
                this.setState({
                    showNotesControl: !this.state.showNotesControl
                })
                break;

        }
    }

    addedDevice(selectedDevice) {
        this.setState({
            addedDevices: selectedDevice,
            showAddDeviceForm: false,
        })
    }

    handleAddDeviceFormClose() {
        this.setState({
            showAddDeviceForm: false
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
                
            },
            notesControl: {
                display: this.state.showNotesControl ? null : 'none', 
            },
            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            }
        }

        const { title } = this.props;

        const colProps = {
            titleCol: {
                xs: 5,
                sm: 5
            },
            inputCol: {
                xs: 7,
                sm: 7,
            }
        }

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md">
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <div>
                        <div className='m-3' style={style.deviceList}>
                            {this.props.selectedObjectData.map((item,index) => {
                                    return (
                                        <div key={index}>
                                            {index > 0 ? <hr/> : null}
                                            <Row key={index}>
                                                <Col xs={12} sm={8}>
                                                    <Row>
                                                        <Col {...colProps.titleCol}>
                                                            Device Type
                                                        </Col>
                                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                            {item.type}
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col {...colProps.titleCol}>
                                                            Device Name
                                                        </Col>
                                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                            {item.name}
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col {...colProps.titleCol}>
                                                            ACN
                                                        </Col>
                                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                            {item.access_control_number}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} sm={4} className='d-flex align-items-center'>
                                                    <Image src={tempImg} width={80}/>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                            })}
                        </div>
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center text-capitalize'>
                                <h5>{this.props.selectedObjectData.length > 0 && this.props.selectedObjectData[0].status}
                                    {this.props.selectedObjectData.status === config.objectStatus.TRANSFERRED
                                        ? '  to  ' + this.props.selectedObjectData.transferredLocation
                                        : null
                                    }
                                </h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().format('LLLL')}</h6>    
                            </Col>
                        </Row>
                        {this.props.selectedObjectData.status === config.objectStatus.RESERVE && 
                            <>
                                <hr/>
                                <Row className='d-flex justify-content-center'>
                                    <ButtonToolbar >
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>
                                            Delay by 10 minutes
                                        </Button>
                                    </ButtonToolbar>
                                </Row>
                            </>
                        }

                        <Form style={style.notesControl}>
                        <hr/>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control 
                                    as="textarea" 
                                    rows="3" 
                                    placeholder='notes...' 
                                    value={this.state.notesText}
                                    name='notesText'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.props.handleConfirmFormSubmit}>
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