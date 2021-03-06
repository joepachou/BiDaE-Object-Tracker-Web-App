/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectRoutes.js

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



const deviceGroupListController = require('../../controllers/deviceGroupListController');
const patientGroupListController = require('../../controllers/patientGroupListController');
let cors = require('cors');

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/deviceGroupList', cors())
    app.options('/data/patientGroupList', cors())
    // app.options('/data/objectPackage', cors())

    app.route('/data/deviceGroupList')
        .get(deviceGroupListController.getDeviceGroupList)
        .post(deviceGroupListController.addDeviceGroupList)
        .put(deviceGroupListController.modifyDeviceGroupList)
        .delete(deviceGroupListController.deleteDeviceGroup)

    app.route('/data/patientGroupList')
        .get(patientGroupListController.getPatientGroupList)
        .post(patientGroupListController.addPatientGroupList)
        .put(patientGroupListController.modifyPatientGroupList)
        .delete(patientGroupListController.deletePatientGroup)

}