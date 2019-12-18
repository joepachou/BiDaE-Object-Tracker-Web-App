import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import config from '../../config';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { AppContext } from '../../context/AppContext';
import { Container } from 'react-grid-system';
import dataSrc from '../../dataSrc'
  
class DownloadPdfRequestForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: this.props.show,
        isShowForm: false,
    };

  
    handleClose = (e) => {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false ,
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

    handleChange = (e) => {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    handleClickButton = e => {
        
        let { name } = e.target
        switch(name) {
            case "viewReport":
                window.open(this.props.pdfPath);
                break;
            case "downloadReport":
                var link = document.createElement('a');
                link.href = `/${this.props.pdfPath}`;
                link.download = "";
                link.click();
                break;
            case "close":
                this.props.close()
                break;
        }
    }

    render() {

        const { locale } = this.context

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
            },
            downloadPdfRequest: {
                // position: "absolute",
                zIndex: 6000,
                // top: '20%',
                // left: '-10%',
                // right: 'auto',
                // bottom: 'auto',
                padding: 0,
            },
            icon: {
                check: {
                    color: 'green'
                }
            },
            anchor: {
                display: "none",
            }
            // confirmForm: {
            //     position: "static",
            // }
        }

        return (
            <Modal 
                id='downloadPdfRequest' 
                show={this.props.show} 
                onHide={this.handleClose} 
                size="sm"
                style={style.downloadPdfRequest}
            >
                <Modal.Body className="py-2">
                    <Formik    
                        onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                            this.props.handleDownloadPdfRequestFormSubmit()
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="d-flex justify-content-center">
                                <i className="fas fa-check-circle text-center d-flex align-items-center" style={style.icon.check}></i>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={this.handleClickButton}
                                    className="text-capitalize"
                                    name="viewReport"
                                >
                                    {locale.texts.VIEW_REPORT}
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={this.handleClickButton}
                                    className="text-capitalize"
                                    name="downloadReport"
                                >
                                    {locale.texts.DOWNLOAD_REPORT}
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={this.handleClickButton}
                                    className="text-capitalize"
                                    name="close"
                                >
                                    {locale.texts.CLOSE}
                                </Button>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default DownloadPdfRequestForm;