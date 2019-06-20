import React from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';

const mydevice = new Set(['9992-3301-0001', '0002-9338-0003'])

class FrequentSearch extends React.Component {

    constructor(){
        super()

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let searchResult = [];
        let notFoundObject = [];
        Object.values(this.props.searchableObjectData).map( item => {
            if (mydevice.has(item.access_control_number)) {
                searchResult.push(item);
                // mydevice.delete(item.access_control_number)
            }
        })
        this.props.getResultData(mydevice)
    }

    render() {


        const locale = this.context;

        return (
            <Col id='frequentSearch' className=''>
                <h6 className="font-weight-bold">{locale.frequent_searches.toUpperCase()}</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item onClick={this.handleClick}>My Device</ListGroup.Item>
                </ListGroup>
        
            </Col>
        )
    }
}

FrequentSearch.contextType = LocaleContext;

export default FrequentSearch;