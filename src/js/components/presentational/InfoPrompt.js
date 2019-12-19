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
        fontWeight: 500,
        color: 'rgba(101, 111, 121, 0.78)',
    }
}

const InfoPrompt = ({
    searchKey,
    searchResult,
    title, title2
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
                {searchKey ? title : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
            </div>
            <div 
                className="mr-1"
                style={style.alertText}
            >
                {searchKey ? searchResult.filter(item => item.found).length : ""}
            </div>

            <div >
                {searchKey 
                    ?   
                        locale.texts.OBJECTS
                    :   ""
                }
            </div>
            <div style={{width: '50px'}}></div>
            <div 
                className='text-capitalize mr-2' 
                style={style.alertTextTitle}
            >
                {searchKey ? title2 : ""}
            </div>
            <div 
                className="mr-1"
                style={style.alertText}
            >
                {searchKey ? searchResult.filter(item => !item.found).length : ""}
            </div>

            <div >
                {searchKey 
                    ?   
                        locale.texts.OBJECTS
                    :   ""
                }
            </div>
        {/*
            fix bug 4.3
        */}
            {/* <div style={{width: '100px'}}>
            </div>
            <div 
                className='text-capitalize mr-2' 
                style={style.alertTextTitle}
            >
                {searchKey ? title2 : ''}
            </div>
            <div 
                className="mr-1"
                style={style.alertText}
            >
                {searchKey ? searchResult.filter(item => !item.found).length : ""}
            </div>

            <div >
                {searchKey 
                    ?   frequentSearchItem.includes(searchKey)
                        ?   locale.texts[searchKey.toUpperCase().replace(/ /g, '_')]
                        :   searchKey
                    :   ""
                }
            </div> */}
        {/*
            fix bug 4.3
        */}
        </Alert>
    )

}

export default InfoPrompt