import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import config from '../../config';

const SearchResultListGroup = ({
        data,
        handleSelectResultItem,
        selection,
        disabled,
        action
}) => {

    const locale = React.useContext(LocaleContext);
   
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
            // background: 'rgb(227, 222, 222)',
            // height: 30,
            // width: 30,
        },
        middleText: {
            paddingLeft: 2,
            paddingRight: 2,
        },
        lastText: {
            // textAlign: 'right'
        },
        icon: {
            color: '#007bff'
        },
        list: {
            wordBreak: 'keep-all',
            zIndex: 1
        },
        listGroup: {
            maxHeight: window.innerWidth > 600 
                ? modifiedHeight || 0
                : ''
        }
    }
    return (
        <ListGroup 
            onSelect={handleSelectResultItem} 
            className='searchResultListGroup'
            style={style.listGroup}
        >
            {data.map((item,index) => {
                let element = 
                    <ListGroup.Item 
                        href={'#' + index} 
                        className='searchResultList' 
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action={action}
                        active
                    >
                
                   
                        <Row>
                            <div 
                                className='d-flex justify-content-start text-left' 
                                style={style.list}
                            >
                                    {selection.indexOf(item.mac_address) >= 0 
                                        ? <i className="fas fa-check mx-2 py-1" style={style.icon}></i> 
                                        : <p className='d-inline-block mx-2'>&#9642;</p>
                                    }
                                {item.type},
                                &nbsp;
                                {locale.texts.ACCESS_CONTROL_NUMBER} : {config.ACNOmitsymbol}{item.last_four_acn},
                               
                                {item.status.toUpperCase() !== 'NORMAL' ? locale.abbr === 'en'  
                                    
                                    ? `${locale.texts[item.status.toUpperCase()]} ,`  
                                    : `${locale.texts[item.status.toUpperCase()]} ,`  
                                   
                                 : null 
                                }
                            
                                {item.currentPosition 
                                    ? `${locale.texts.NEAR} ${item.location_description}` 
                                    
                                    : locale.texts.NOT_AVAILABLE
                                }   
                                &nbsp;
                               
                                {item.currentPosition
                                    ? locale.abbr === 'en'
                                        ? item.residence_time
                                        : `,${locale.texts.WHEN}${item.residence_time.substring(0, item.residence_time.length-1)}`
                                    : ' '
                                }
                            </div>
                        </Row>
                        {/* <Row>
                            <Col xs={1} sm={1} lg={1} style={style.firstText}>
                                {selection.indexOf(item.mac_address) >= 0 
                                    ? <i className="fas fa-check" style={style.icon}></i> 
                                    : index + 1
                                }
                            </Col>
                            <Col xs={11} sm={11} lg={11} className='text-left'>
                                {item.type},
                                &nbsp;
                                {locale.texts.LAST_FOUR_DIGITS_IN_ACN}: {item.last_four_acn},
                                &nbsp;
                                {locale.abbr === 'en'
                                    ? `${locale.texts.IS} ${locale.texts[item.status.toUpperCase()]}`
                                    : `${locale.texts.STATUS}${locale.texts[item.status.toUpperCase()]}`
                                },
                                &nbsp;
                                {item.currentPosition 
                                    ? `${locale.texts.NEAR} ${item.location_description}`
                                    : locale.texts.NOT_AVAILABLE
                                }
                                &nbsp;
                                {item.currentPosition
                                    ? locale.abbr === 'en'
                                        ? item.residence_time
                                        : `,${locale.texts.WHEN}${item.residence_time}`
                                    : ' '
                                }
                            </Col>
                        </Row> */}
                        {/* <Row>
                            <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>
                                {selection.indexOf(item.mac_address) >= 0 
                                    ? <i className="fas fa-check" style={style.icon}></i> 
                                    : index + 1
                                }
                            </Col>
                            <Col xs={4} sm={4} lg={4} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                            <Col xs={1} sm={1} lg={1} className="d-flex align-self-center text-muted" style={style.middleText}>{item.last_four_acn}</Col>
                            <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                {item.currentPosition 
                                    ? item.status.toLowerCase() === config.objectStatus.NORMAL
                                        ? `near ${item.location_description}`
                                        : item.status
                                    : 'N/A'
                                }
                            </Col>
                            <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted justify-content-center text-capitalize w" style={style.lastText}>
                                {item.currentPosition
                                    ? item.residence_time
                                    : ''
                                }
                            </Col>
                        </Row> */}
                    </ListGroup.Item>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup;