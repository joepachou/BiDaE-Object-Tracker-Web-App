import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import VerticalTable from '../presentational/VerticalTable';
import ModalForm from '../container/ModalForm';
import LocaleContext from '../../context/LocaleContext';



class SearchResult extends React.Component {

    constructor(){
        super()
        this.state = {
            showEditObjectForm: false,
        }
        
        this.editObject = this.editObject.bind(this)
    }


    editObject(e) {
        this.setState({
            showEditObjectForm: true,
        })
    }

    render() {
        const locale = this.context;
        const { result, searchKey } = this.props;
        const { showEditObjectForm } = this.state;

        return(
            <>
                {/* <Alert variant={"secondary"} className='text-left'>
                <h6 className='d-inline font-weight-bold'>{locale.search_result.toUpperCase()}</h6> 
                    <h6 className="d-inline pl-3">{result.length}</h6>
                        <h6 className="d-inline pl-3">{searchKey}</h6>
                            <h6 className="d-inline pl-2">on</h6>
                                    <h6 className="d-inline pl-2">F4</h6>
                </Alert> */}
                <h6>Search Result</h6>
                <Tab.Container id="left-tabs-example" defaultActiveKey="#0">
                    <Row className=''style={{height:'100%'}} >
                        <Col className='border px-0 overflow-auto'>
                            <ListGroup variant="flush">
                                {result.map((item,index) => {
                                    let element = 
                                        <ListGroup.Item href={'#' + index} className='searchResultList' onClick={this.editObject}>
                                            <div className="d-flex flex-column text-left">
                                                <div className="font-weight-bold py-1">{item.name}</div>
                                                <small>ACN: xxxx-xxxx-00{item.id}</small>
                                                <small>location: {item.location}</small>
                                            </div>
                                        </ListGroup.Item>
                                    return element
                                })}
                            </ListGroup>
                        </Col>
                        {/* <Col className=' border px-0' >
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
                        </Col> */}
                    </Row>
                </Tab.Container>

                <ModalForm show={showEditObjectForm}/>
            </>
        )
    }
}
SearchResult.contextType = LocaleContext;

export default SearchResult;