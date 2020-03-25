import React from 'react';
import { 
    Modal, 
    Button, 
    ListGroup
} from 'react-bootstrap'
import { 
    Formik, 
    Field, 
    Form, 
} from 'formik';
import * as Yup from 'yup';
import FormikFormGroup from '../presentational/FormikFormGroup'
import moment from 'moment'
import { AppContext } from '../../context/AppContext';
import ScrollArea from 'react-scrollbar'
import LocaleContext from '../../context/LocaleContext';

const style = {
    index: {
        minWidth: 10,
    },
    item: {
        minWidth: 30,
    },
    scrollArea: {
        maxHeight: 300
    },
    blockOne: {
        minWidth: 'initial'
    }
}

class PatientViewModal extends React.Component {
   
    static contextType = AppContext

    state = {
        display: false,
    }

    render() {

        let {
            show, 
            handleClose,
            handleSubmit,
            data,
            title
        } = this.props

        let {
            locale,
            auth
        } = this.context

        let recordBlock = {
            display: this.state.display ? '' : 'none',
        }
        return (
            <Modal  
                show={show}
                onHide={handleClose} 
                size="md" 
                className='text-capitalize'
                enforceFocus={false}
                style={style.modal}
            >
                <Modal.Header 
                    closeButton 
                >
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            notes: data ? data.notes : ""
                        }}
    
                        validationSchema = {
                            Yup.object().shape({
    
                        })}
    
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            handleSubmit(values)
                        }}
    
                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <FormikFormGroup 
                                    type="text"
                                    name="name"
                                    label={locale.texts.NAME}
                                    value={data.name}
                                    error={errors.name}
                                    touched={touched.name}
                                    placeholder=""
                                    disabled
                                />
                                <FormikFormGroup 
                                    type="text"
                                    name="asset_control_number"
                                    label={locale.texts.PATIENT_NUMBER}
                                    error={errors.asset_control_number}
                                    value={data.asset_control_number}
                                    touched={touched.asset_control_number}
                                    placeholder=""
                                    disabled
                                />
                                <hr/>
                                <FormikFormGroup 
                                    type="textarea"
                                    name="notes"
                                    label={locale.texts.NOTES}
                                    error={errors.notes}
                                    touched={touched.notes}
                                />
                                <hr/>
                                <div
                                    className="mb-2 cursor-pointer"
                                    onClick={() => {
                                        this.setState({
                                            display: !this.state.display
                                        })
                                    }}                                    
                                >
                                    {locale.texts.PATIENT_HISTORICAL_RECORD} 
                                    &nbsp;
                                    <i 
                                        className={`fas ${this.state.display ? 'fa-angle-up' : 'fa-angle-down'}`}
                                    />
                                </div>
                                <div
                                    style={recordBlock}
                                >
                                    <hr style={{margin: 0}}></hr>
                                    <ScrollArea
                                        // smoothScrolling={true}
                                        horizontal={false}
                                        style={style.scrollArea}
                                    >
                                        <ListGroup
                                            className='text-none px-0'
                                        >
                                            {data.record && data.record.map((item, index) => {
                                                return (
                                                    recordBlockTypeTwo(item, index, locale)
                                                )
                                            })}
                                        </ListGroup>
                                    </ScrollArea>
                                </div>
                                
                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="text-capitalize" 
                                        onClick={handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                    >
                                        {locale.texts.SAVE}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}    

const recordBlockTypeOne = (item, index, locale) => {

    return (
        <ListGroup.Item
            key={index}
            className="d-flex justify-content-start"
            style={style.blockOne}
        >
            <div 
                style={style.index}
            >
                &bull;
            </div>
            &nbsp;
            <div 
                key={index} 
                className="pb-1"
                style={style.row}
            >
                {moment(item.create_timestamp).locale(locale.abbr).format('YYYY/MM/DD hh:mm')},
                &nbsp;
                {item.notes}
            </div>
        </ListGroup.Item>
    )
}

const recordBlockTypeTwo = (item, index, locale) => {

    return (
        <ListGroup.Item
            key={index}
            style={style.blockOne}
        >
            <div
                className="d-flex justify-content-start"
            >
                <div 
                    style={style.index}
                    className="d-flex align-items-center"
                >
                    &bull;
                </div>
                <div
                    className="font-color-black"
                >
                    {moment(item.create_timestamp).locale(locale.abbr).format('YYYY/MM/DD hh:mm:ss')}
                </div>
            </div>

            <div 
                key={index} 
                className="pb-1"
                style={style.row}
            >
                {item.notes}
            </div>
        </ListGroup.Item>
    )
}
  
export default PatientViewModal;