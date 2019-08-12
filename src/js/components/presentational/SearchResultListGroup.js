import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import config from '../../config'

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
    }
}

const SearchResultListGroup = ({
    data,
    handleSelectResultItem,
    selection,
    disabled
}) => {
    return (
        <ListGroup onSelect={handleSelectResultItem} className='searchResultListGroup'>
            {data.map((item,index) => {
                let element = 
                    <ListGroup.Item 
                        href={'#' + index} 
                        style={style.listItem} 
                        className='searchResultList' 
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action
                        disabled={disabled}
                    >
                        <Row>
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
                        </Row>
                    </ListGroup.Item>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup;