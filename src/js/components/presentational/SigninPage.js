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
    Field, 
    Form, 
    ErrorMessage 
} from 'formik';
import * as Yup from 'yup';
import {
    CenterContainer
} from '../BOTComponent/styleComponent';
import Select from 'react-select';
import styleConfig from '../../config/styleConfig';
import FormikFormGroup from '../presentational/FormikFormGroup';

const imageLength = 80;

const SigninPage = () => {

    let locale = React.useContext(LocaleContext);
    let auth = React.useContext(AuthContext);

    let areaOptions = Object.values(config.mapConfig.AREA_MODULES)
        .map(areaModule => {
            areaModule.value = areaModule.name
            areaModule.label = locale.texts[areaModule.name]
            return areaModule
        })
    
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
                <div className="title my-1">
                    {locale.texts.SLOGAN}
                </div>
            </div>
            <Formik
                initialValues = {{
                    username: '',
                    password: '',
                    area: null,
                }}

                validationSchema = {
                    Yup.object().shape({
                    username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                    password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                })}

                onSubmit={(values, actions) => {
                    auth.signin(values, actions)
                
                }}

                render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        {status &&
                            <div 
                                className={'alert alert-danger mb-2 warning'}
                            >
                                <i className="fas fa-times-circle mr-2"/>
                                {locale.texts[status.toUpperCase().replace(/ /g, "_")]}
                            </div>
                        }
                        {/* <div className="form-group">
                            <Field 
                                name="username" 
                                type="text" 
                                className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                placeholder={locale.texts.USERNAME}
                            />
                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div> */}
                        <FormikFormGroup 
                            type="text"
                            name="username"
                            label={locale.texts.NAME}    
                        />  
                        <FormikFormGroup 
                            type="password"
                            name="password"
                            additionalField={locale.texts.FORGET_PASSWORD}
                            label={locale.texts.PASSWORD}    
                        />  
                        <Select
                            placeholder={locale.texts.SELECT_LOCATION}
                            value={values.area}
                            options={areaOptions}
                            onChange={value => {
                                setFieldValue('area', value)
                            }}
                            styles={styleConfig.reactSelectNavbar}
                            isSearchable={false}
                            components={{
                                IndicatorSeparator: () => null,
                                // DropdownIndicator:() => null
                            }}
                        />

                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={isSubmitting}
                        >
                            {locale.texts.SIGN_IN}
                        </Button>
                    </Form>
                )}
            />
        </CenterContainer>
    )
}

export default SigninPage;