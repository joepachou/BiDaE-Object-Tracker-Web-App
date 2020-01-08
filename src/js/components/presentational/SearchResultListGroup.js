import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import { getDescription } from '../../helper/descriptionGenerator'


const SearchResultListGroup = ({
        data,
        handleSelectResultItem,
        selection,
        disabled,
        action
}) => {

    const { locale } = React.useContext(AppContext);
   
    if (document.getElementById('searchPanel')) {
        var searchPanelElementHeight = document.getElementById('searchPanel').clientHeight
        var searchContainerElementHeight = document.getElementById('searchContainer').clientHeight
        var factor = 0.8
        var modifiedHeight = Math.floor((searchPanelElementHeight - searchContainerElementHeight) * factor)
    }

    const style = {
        listItem: {
            position: 'relative',
            zIndex: 6,
        }, 
        firstText: {
            paddingLeft: 15,
            paddingRight: 0,
        },
        middleText: {
            paddingLeft: 2,
            paddingRight: 2,
        },

        icon: {
            color: '#007bff'
        },
        list: {
            wordBreak: 'keep-all',
            zIndex: 1,
            overFlow: 'hidden scroll'
        },
    }

    return (
        <ListGroup 
            onSelect={handleSelectResultItem} 
            style={style.listGroup}
        >
            {data.map((item,index) => {
                let element = 
                    <ListGroup.Item 
                        href={'#' + index} 
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action={action}
                        active
                    >
                        <Row>
                            <div 
                                className='d-inline-flex justify-content-start text-left' 
                                style={style.list}
                            >   
                                {selection.indexOf(item.mac_address) >= 0 
                                    ? <i className="fas fa-check mx-2 py-1" style={style.icon}></i> 
                                    : config.mapConfig.iconOptions.showNumber
                                        ?   <p className='d-inline-block mx-2'>{index + 1}.</p>
                                        :   <p className='d-inline-block mx-2'>&#9642;</p>
                                }
                                {getDescription(item, locale, config)}
                            </div>
                        </Row>
                    </ListGroup.Item>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup