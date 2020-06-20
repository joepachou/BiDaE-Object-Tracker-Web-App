/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditLbeaconForm.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import { Formik, Field, Form } from 'formik';
import FormikFormGroup from './FormikFormGroup';
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
        uuid,
        description,
        comment,
        danger_area,
        room,
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
                        uuid: uuid,
                        comment: comment,
                    }}

                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        let {
                            description,
                            danger_area,
                            room
                        } = values
                        let lbeaconSettingPackage = {
                            ...selectedObjectData,
                            description,
                            comment,
                            danger_area,
                            room,
                        }
                        let callback = () => messageGenerator.setSuccessMessage(
                                            'save success'
                                        )  
                        handleSubmit(lbeaconSettingPackage)
                        callback()
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
                                label={locale.texts.DESCRIPTION}
                                error={errors.description}
                                touched={touched.description}
                                placeholder=""
                            />
                            <FormikFormGroup 
                                type="text"
                                name="comment"
                                label={locale.texts.COMMENT}
                                placeholder=""
                                name="room"
                                label={locale.texts.ROOM}
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