/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SigninPage.js

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

import React, { Component } from 'react';
import { 
    Modal, 
    Image, 
    Button,
} from 'react-bootstrap';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import AuthContext from '../../context/AuthenticationContext';
import { 
    Formik, 
    Form, 
    ErrorMessage 
} from 'formik';
import * as Yup from 'yup';
import {
    CenterContainer, JustifyCenterDiv
} from '../BOTComponent/styleComponent';
import FormikFormGroup from '../presentational/FormikFormGroup';
import { 
    Link, 
    useHistory
} from 'react-router-dom';
import routes from '../../config/routes/routes';

const imageLength = 80;

const SigninPage = () => {

    let locale = React.useContext(LocaleContext);
    let auth = React.useContext(AuthContext);
    let history = useHistory();
    return (
        <CenterContainer>
            <div className='d-flex justify-content-center'>
                <Image 
                    src={config.LOGO} 
                    rounded 
                    width={imageLength} 
                    height={imageLength} 
                />
            </div>
            <div className='d-flex justify-content-center'>
                <div className="title mt-1 mb-4">
                    {locale.texts.SLOGAN}
                </div>
            </div>
            <Formik
                initialValues = {{
                    username: '',
                    password: '',
                }}

                validationSchema = {
                    Yup.object().shape({
                    username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                    password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                })}

                onSubmit={(values, actions) => {
                    let callback = () => history.push("/")
                    auth.signin(values, actions, callback)
                }}

                render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        {status &&
                            <div 
                                className='alert alert-danger mb-2 warning'
                            >
                                <i className="fas fa-times-circle mr-2"/>
                                {locale.texts[status.toUpperCase().replace(/ /g, "_")]}
                            </div>
                        }
                        <FormikFormGroup 
                            type="text"
                            name="username"
                            className="mb-4"
                            error={errors.username}
                            touched={touched.username}
                            label={locale.texts.NAME}    
                            tabindex={1}
                        />  
                        <FormikFormGroup 
                            type="password"
                            name="password"
                            className="mb-4"
                            error={errors.password}
                            touched={touched.password}
                            additionalComponent={() => (
                                <Link
                                    to={routes.FORGET_PASSWORD}
                                >
                                    {locale.texts.FORGET_PASSWORD}
                                </Link>
                            )}
                            label={locale.texts.PASSWORD}    
                            tabindex={2}
                        />  
                        <div className='d-flex justify-content-start'>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                disabled={isSubmitting}
                                tabindex={3}
                            >
                                {locale.texts.LOG_IN}
                            </Button>
                        </div>
                    </Form>
                )}
            />
        </CenterContainer>
    )
}

export default SigninPage;