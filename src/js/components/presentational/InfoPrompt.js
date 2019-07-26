import React from 'react';
import { Alert } from 'react-bootstrap'


const style = {

    alertText: {
        fontSize: '1.2rem',
        fontWeight: '700'
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        fontWeight: 1000,
        color: 'rgba(101, 111, 121, 0.78)'
    }
}

const InfoPrompt = ({
    data
}) => {
    return (
        <Alert variant='secondary' className='d-flex justify-content-start'>
            <div style={style.alertTextTitle}>{'Found '}</div>
            &nbsp;
            &nbsp;
            {Object.keys(data).map((item, index) => {
                return (
                    <div className='d-flex justify-content-start' key={index}>
                        <div style={style.alertText}>
                            {data[item]}
                        </div>
                        &nbsp;
                        <div style={style.alertText}>
                            {item}
                        </div>
                        &nbsp;
                        &nbsp;
                    </div>
                )
            })}
        </Alert>
    )

}

export default InfoPrompt