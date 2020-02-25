import React from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import { 
    Formik, 
    Form
} from 'formik';
import {
    ListGroup 
} from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import config from '../../config'

const style = {
    modal: {
        top: '10%',
    },
}

const EditAreasForm = ({
    show,
    handleClose,
    handleSubmit,
    secondaryAreaIdBeforUpdate,
    otherAreaIdBeforUpdate,
    handleBeforUpdateAdd,
    handleBeforUpdateDele,
}) => {
        
    let locale = React.useContext(LocaleContext)

    const { 
        areaOptions
    } = config.mapConfig

    return (
        <Modal 
            show={show} 
            size="md" 
            onHide={handleClose}
            style={style.modal}
            className='text-capitalize'
        >
            <Modal.Header closeButton>
                {locale.texts.EDIT_SECONDARY_AREAS}
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues = {{
                        username: '',
                        password: '',
                    }}
                
                    onSubmit={({ username, password, radioGroup }, { setStatus, setSubmitting }) => {
                        handleSubmit()
                    }}

                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div
                                className="title"
                            >   
                                {locale.texts.SELECTED_AREAS}
                            </div>
                            <ListGroup>
                                {
                                    secondaryAreaIdBeforUpdate.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item
                                                key = {index}
                                            >
                                                {locale.texts[areaOptions[item]]}
                                                <Button variant='link' onClick={()=> handleBeforUpdateDele(item)}>刪除</Button>
                                            </ListGroup.Item>
                                        return element
                                    })
                                }
                            </ListGroup>
                            <div
                                className="title"
                            >   
                                {locale.texts.NOT_SELECTED_AREAS}
                            </div>
                            <ListGroup>
                                {
                                    otherAreaIdBeforUpdate.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item
                                                key = {index}
                                            >
                                                {locale.texts[areaOptions[item]]}
                                                <Button variant='link' onClick={() => handleBeforUpdateAdd(item)}>新增</Button>
                                            </ListGroup.Item>
                                        return element
                                    })
                                }
                            </ListGroup>
                            
                            <Modal.Footer>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.CONFIRM}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default EditAreasForm