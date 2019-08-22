import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'
import { Formik, Form } from 'formik';
  
class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    render() {

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            }
        }

        const { title } = this.props;

        const colProps = {
            titleCol: {
                xs: 3,
                sm: 3
            },
            inputCol: {
                xs: 9,
                sm: 9,
            }
        }

        return (
            <>  
                <Modal 
                    id='confirmForm' 
                    show={this.state.show} 
                    onHide={this.handleClose} 
                    size="md"
                >
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <div className='modalDeviceListGroup' style={style.deviceList}>
                            {this.props.selectedObjectData.map((item,index) => {
                                return (
                                    <div key={index} >
                                        {index > 0 ? <hr/> : null}
                                        <Row noGutters={true}>
                                            <Col xs={1} sm={1} className='d-flex align-items-center'>
                                                {null}
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        Type
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.type}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        Name
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
                                            {/* <Col xs={3} sm={3} className='d-flex align-items-center'>
                                                <Image src={tempImg} width={80}/>
                                            </Col> */}
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
                        <Formik    
                            onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                                this.props.handleConfirmFormSubmit()
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" onClick={this.handleClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="text-capitalize" variant="primary" disabled={isSubmitting}>
                                            Send
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;