import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext';
import config from "../../config"

const style = {
    alertText: {
        fontSize: '1.2rem',
        fontWeight: 700
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        fontWeight: 1000,
        color: 'rgba(101, 111, 121, 0.78)',
    }
}

const InfoPrompt = ({
    searchKey,
    searchResult,
    title
}) => {
    const appContext = React.useContext(AppContext);
    const { locale } = appContext
    const frequentSearchItem = Object.values(config.frequentSearchOption)

    return (
        <Alert variant='secondary' className='d-flex justify-content-start'>
            <div 
                className='text-capitalize mr-2' 
                style={style.alertTextTitle}
            >
                {searchKey ? title : "請選擇"}
            </div>
            <div 
                className="mr-1"
                style={style.alertText}
            >
                {searchKey ? searchResult.filter(item => item.found).length : ""}
            </div>

            <div >
                {searchKey 
                    ?   frequentSearchItem.includes(searchKey)
                        ?   locale.texts[searchKey.toUpperCase().replace(/ /g, '_')]
                        :   searchKey
                    :   ""
                }
            </div>
        </Alert>
    )

}

export default InfoPrompt