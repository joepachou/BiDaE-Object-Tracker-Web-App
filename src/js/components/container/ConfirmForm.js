import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import config from '../../config';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { AppContext } from '../../context/AppContext';
  
class ConfirmForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,
        isShowForm: false,
        reserveInitTime: moment(),
        isDelayTime: false
    };

  
    handleClose = (e) => {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false ,
            isDelayTime: false
        });
    }
  
    handleShow = () => {
        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    handleButtonClick = (e) => {
        const { name }  = e.target
        switch(name) {
            case "reserve":
            // console.log(this.state.reserveInitTime)
                this.setState({
                    isDelayTime: true
                })
        }
    }

    getPrompt = () => {
        
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

        const { 
            title,
            selectedObjectData
        } = this.props;

        const {
            isDelayTime
        } = this.state

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

        const { locale } = this.context

        let hasSelectedObjectData = selectedObjectData[0] ? true : false;
        let isTransferObject = hasSelectedObjectData && selectedObjectData[0].status === config.objectStatus.TRANSFERRED ? true : false;
        let isReservedObject = hasSelectedObjectData && selectedObjectData[0].status === config.objectStatus.RESERVE ? true : false;

        return (
            <>  
                <Modal 
                    id='confirmForm' 
                    show={this.state.show} 
                    onHide={this.handleClose} 
                    size="md"
                >
                    <Modal.Header 
                        closeButton 
                        className='font-weight-bold text-capitalize'
                    >
                        {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                    </Modal.Header >
                    <Modal.Body>
                        <div className='modalDeviceListGroup' style={style.deviceList}>
                            {selectedObjectData.map((item,index) => {
                                return (
                                    <div key={index} >
                                        {index > 0 ? <hr/> : null}
                                        <Row noGutters={true} className='text-capitalize'>
                                            <Col>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.NAME}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.name}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.TYPE}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.type}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.ACN}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.asset_control_number}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center text-capitalize'>
                                <div className="d-flex flex-column" >
                                    <h5 className="d-flex justify-content-center">
                                        { hasSelectedObjectData && locale.texts[selectedObjectData[0].status.toUpperCase()]}
                                        &nbsp;
                                        { isTransferObject && locale.texts.TO}
                                    </h5>

                                    {isTransferObject
                                        ?   <h5>
                                                <div>{selectedObjectData[0].transferred_location.value.split(',').map(item => {
                                                            return locale.texts[item.toUpperCase().replace(/ /g, '_')]
                                                        }).join('/')}
                                                </div>
                                            </h5>
                                        : null
                                    }
                                    {isReservedObject &&
                                        <> 
                                            {isReservedObject && locale.texts.FROM}
                                            <div className='d-flex justify-content-center'>
                                            {/* {console.log(this.state.reserveInitTime)} */}
                                            {console.log('render')}
                                                {isDelayTime
                                                    ?   moment().add(config.reservedDelayTime, 'minutes').locale(locale.abbr).format("LT")
                                                    :   moment().locale(locale.abbr).format("LT")
                                                }
                                                ~
                                                {isDelayTime
                                                    ?   moment().add(config.reservedInterval + config.reservedDelayTime, 'minutes').locale(locale.abbr).format("LT")
                                                    :   moment().add(config.reservedInterval, 'minutes').locale(locale.abbr).format("LT")
                                                }                                            
                                            </div>
                                            <Row className='d-flex justify-content-center'>
                                                <ButtonToolbar >
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        className='mr-2 text-capitalize' 
                                                        onClick={this.handleButtonClick}
                                                        name="reserve"
                                                        disabled={isDelayTime}
                                                    >
                                                        {locale.texts.DELAY_BY} {config.reservedDelayTime} {locale.texts.MINUTES}
                                                    </Button>
                                                </ButtonToolbar>
                                            </Row>
                                        </>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().locale(locale.abbr).format(config.confirmFormTimeFormat)}</h6>    
                            </Col>
                        </Row>
                        <Formik    
                            onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                                this.props.handleConfirmFormSubmit(isDelayTime)
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form>
                                    <Modal.Footer>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.handleClose}
                                            className="text-capitalize"
                                        >
                                            {locale.texts.CANCEL}
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="text-capitalize" 
                                            variant="primary" 
                                            disabled={isSubmitting}
                                        >
                                            {locale.texts.SEND}
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
  
export default ConfirmForm;