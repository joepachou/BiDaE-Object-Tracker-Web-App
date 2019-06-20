import React from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';

class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.state = {
            hasGetUserInfo: false,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.state.hasGetUserInfo) {
            axios.get(dataSrc.userInfo).then( res => {
                var mydevice = new Set(res.data.rows[0].mydevice);
                this.props.getResultData(mydevice)
                this.setState({
                    hasGetUserInfo: true,
                    mydevice: mydevice,
                })
            }).catch(error => {
                console.log(error)
            })
        } else {
            this.props.getResultData(this.state.mydevice)
        }
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