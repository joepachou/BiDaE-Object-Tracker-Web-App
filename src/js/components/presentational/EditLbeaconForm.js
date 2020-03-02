import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { Formik, Field, Form } from 'formik';
import RadioButtonGroup from "../container/RadioButtonGroup"
import RadioButton from "./RadioButton"
import FormikFormGroup from './FormikFormGroup'

/**
 * EditLbeaconForm will update if user selects one of the object table.
 * The selected object data will transfer from ObjectMangentContainer to EditLbeaconForm
 */
  
const EditLbeaconForm = ({
    title,
    selectedObjectData,
    show,
    handleClose,
    handleSubmit
}) => {

    let locale = React.useContext(LocaleContext)

    let {
        danger_area,
        uuid,
        room,
        description
    } = selectedObjectData

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="md"
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header >
            <Modal.Body>
                <Formik
                    initialValues = {{
                        description: description || '',
                        danger_area: danger_area 
                            ?   danger_area.toString()
                            :   '0',
                        room: room || '',
                        uuid: uuid
                    }}

                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        let {
                            description,
                            danger_area,
                            room
                        } = values
                        let lbeaconSettingPackage = {
                            uuid: selectedObjectData.uuid,
                            description,
                            danger_area,
                            room,
                        }
                        axios.post(dataSrc.editLbeacon, {
                            formOption: lbeaconSettingPackage
                        }).then(res => {
                            setTimeout(
                                function() {
                                    handleClose()
                                    handleSubmit()
                                }
                                .bind(this),
                                1000
                            )
                        }).catch( error => {
                            console.log(error)
                        })
                    }}

                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <Form >
                            <FormikFormGroup 
                                type="text"
                                name="uuid"
                                label={locale.texts.UUID}
                                error={errors.uuid}
                                touched={touched.uuid}
                                placeholder=""
                                disabled
                            />
                            <FormikFormGroup 
                                type="text"
                                name="description"
                                label={locale.texts.LOCATION_SELECTION}
                                error={errors.description}
                                touched={touched.description}
                                placeholder=""
                            />
                            <FormikFormGroup 
                                type="text"
                                name="room"
                                label={locale.texts.ROOM}
                                placeholder=""
                            />
                            <FormikFormGroup 
                                type="text"
                                name="danger_area"
                                label={locale.texts.DANGER_AREA}
                                error={errors.danger_area}
                                touched={touched.danger_area}
                                placeholder=""
                                component={() => (
                                    <RadioButtonGroup
                                        id="danger_area"
                                        label={locale.texts.DANGER_AREA}
                                        value={values.danger_area}
                                        error={errors.danger_area}
                                        touched={touched.danger_area}
                                    >
                                        <Field
                                            component={RadioButton}
                                            name="danger_area"
                                            id="1"
                                            label={locale.texts.ENABLE}
                                        />
                                        <Field
                                            component={RadioButton}
                                            name="danger_area"
                                            id="0"
                                            label={locale.texts.DISABLE}
                                        />
                                    </RadioButtonGroup>
                                )}
                            />
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClose} 
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
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
    );
}
        
export default EditLbeaconForm;