import React from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';

class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.state = {
            hasGetUserInfo: false,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const itemName = e.target.innerText.toLowerCase();
        if (itemName === 'my device') {
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
        } else if (itemName === 'all device') {
            this.props.shouldUpdateTrackingData(true)
        }
     
    }

    render() {


        const locale = this.context;

        return (
            <Col id='frequentSearch' className=''>
                <h6 className="font-weight-bold">{locale.frequent_searches.toUpperCase()}</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item onClick={this.handleClick} action>My Device</ListGroup.Item>
                    <ListGroup.Item onClick={this.handleClick} action>All Device</ListGroup.Item>
                </ListGroup>
        
            </Col>
        )
    }
}

FrequentSearch.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(FrequentSearch);