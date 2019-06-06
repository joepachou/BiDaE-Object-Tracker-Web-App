import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import VerticalTable from '../presentational/VerticalTable';
import ModalForm from '../container/ModalForm';
import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';



class SearchResult extends React.Component {

    constructor(){
        super()
        this.state = {
            showEditObjectForm: false,
            selectObjectIndex:0,
        }
        
        this.editObject = this.editObject.bind(this)
    }


    editObject(eventKey) {
        this.setState({
            showEditObjectForm: true,
            selectObjectIndex: eventKey,
        })
    }

    render() {
        const locale = this.context;
        const { result, searchKey, refresh } = this.props;
        const { showEditObjectForm, selectObjectIndex } = this.state;

        const style = {
            listItem: {
                position: 'relative',
                zIndex: 6,
            }
        }

        return(
            <>
                {/* <Alert variant={"secondary"} className='text-left'>
                <h6 className='d-inline font-weight-bold'>{locale.search_result.toUpperCase()}</h6> 
                    <h6 className="d-inline pl-3">{result.length}</h6>
                        <h6 className="d-inline pl-3">{searchKey}</h6>
                            <h6 className="d-inline pl-2">on</h6>
                                    <h6 className="d-inline pl-2">F4</h6>
                </Alert> */}
                <div className='text-left'>
                    <h6>Search Result</h6>
                </div>
                {/* <Tab.Container id="left-tabs-example" defaultActiveKey="#0"> */}
                    <Row className=''style={{height:'100%'}} >
                        <Col className='border px-0 overflow-auto'>
                            <ListGroup variant="flush" onSelect={this.editObject}>
                                {result.map((item,index) => {
                                    let element = 
                                        <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={index} key={index}>
                                            <div className="d-flex justify-content-around text-left">
                                                <div className="font-weight-bold">{index + 1}.</div>
                                                <div className="font-weight-bold">{item.name}</div>
                                                <div>ACN: xxxx-xxxx-00{item.id}</div>
                                                <div>location: {item.location_description}</div>
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
                {/* </Tab.Container> */}
                <ChangeStatusForm 
                    show={showEditObjectForm} 
                    title='Edit Object' 
                    selectedObjectData={result.length ? result[selectObjectIndex] : null} 
                    searchKey={searchKey}
                />
            </>
        )
    }
}
SearchResult.contextType = LocaleContext;

export default SearchResult;