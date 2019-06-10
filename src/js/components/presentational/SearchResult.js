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
            }, 
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
            }

        }

        return(
            <>
                <div className='text-left'>
                    <h5>Search Result</h5>
                </div>
                {/* <Tab.Container id="left-tabs-example" defaultActiveKey="#0"> */}
                    <Row className=''style={{height:'100%'}} >
                        {result.length === 0 
                        ?   <Col className='text-left' style={style.noResultDiv}>
                                <em>no result</em>
                            </Col> 
                        
                        :   <Col className='border px-0 overflow-auto'>
                                <ListGroup variant="flush" onSelect={this.editObject}>
                                    {result.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} style={style.listItem} className='searchResultList' eventKey={index} key={index}>
                                                <div className="d-flex justify-content-between">
                                                    <div className="font-weight-bold text-left">{index + 1}.</div>
                                                    <div className="font-weight-bold">{item.type}</div>
                                                    <div>xxxx-xxxx-{item.access_control_number.slice(10, 14)}</div>
                                                    <div>near {item.location_description}</div>
                                                </div>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col> 
                        }
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