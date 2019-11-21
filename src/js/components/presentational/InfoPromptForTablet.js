import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap'
import { locale } from 'moment';
import { AppContext } from "../../context/AppContext";

const style = {
    alertText: {
        fontSize: '1.2rem',
        fontWeight: 700
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        fontWeight: 1000,
        color: 'rgba(101, 111, 121, 0.78)'
    }
}

var total_number = 0;
const InfoPromptForTablet = ({
    data,
    title,
    searchResultLength,
    searchKey
}) => {
    const context = React.useContext(AppContext);
    //console.log(locale)
    let searchKeyKey = (searchKey === "my patient" || searchKey === "all patient") ? context.locale.texts.PATIENT : context.locale.texts.DEVICES
    return (
            <div>
                <div className='text-capitalize' style={style.alertTextTitle}>{title}</div>
                <div className='text-capitalize' style={style.alertTextTitle}>{searchResultLength}</div>
                <div className='text-capitalize' style={style.alertTextTitle}>{searchKeyKey}</div>
            </div>
    )

}

export default InfoPromptForTablet