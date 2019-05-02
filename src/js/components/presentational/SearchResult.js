import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import VerticalTable from '../presentational/VerticalTable';
import LocaleContext from '../../context/LocaleContext';



class SearchResult extends React.Component {
    render() {
        const locale = this.context;
        const { result, searchKey } = this.props;
        return(
            <>
                <Alert variant={"secondary"} className='text-left'>
                <h6 className='d-inline font-weight-bold'>{locale.search_result.toUpperCase()}</h6> 
                    <h6 className="d-inline pl-3">{result.length}</h6>
                        <h6 className="d-inline pl-3">{searchKey}</h6>
                            <h6 className="d-inline pl-2">on</h6>
                                    <h6 className="d-inline pl-2">F4</h6>
                </Alert>

                <Tab.Container id="left-tabs-example" defaultActiveKey="#0">
                    <Row className=''style={{height:'100%'}} >
                        <Col className='border px-0 overflow-auto'>
                            <ListGroup variant="flush">
                                {result.map((item,index) => {
                                    let element = 
                                        <ListGroup.Item href={'#' + index} className='searchResultList' >
                                            <div className="d-flex flex-column text-left">
                                                <div className="font-weight-bold py-1">{item.name}</div>
                                                <small>ACN: xxxx-xxxx-{item.ACN.slice(10,14)}</small>
                                                <small>location: {item.location}</small>
                                            </div>
                                        </ListGroup.Item>
                                    return element
                                })}
                            </ListGroup>
                        </Col>
                        <Col className=' border px-0' >
                            <Tab.Content >
                                {result.map((item,index) => {
                                    let element = 
                                        <Tab.Pane eventKey={'#' + index} className=''>
                                            <img src={item.img} width='100' className='py-4' />
                                            <VerticalTable item={item}/>
                                        </Tab.Pane>
                                    return element
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </>
        )
    }
}
SearchResult.contextType = LocaleContext;

export default SearchResult;