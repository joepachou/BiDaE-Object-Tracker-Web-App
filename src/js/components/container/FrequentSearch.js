import React from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import Cookies from 'js-cookie'

class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.state = {
            hasGetUserInfo: false,
            searchHistory: null,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getFrequentSearch()
    }

    getFrequentSearch() {
        axios.post(dataSrc.userSearchHistory, {
            username: Cookies.get('user')
        }).then( res => {
            this.props.getSearchHistory(res.data.rows[0])
        }).catch(error => {
            console.log(error)
        })
    }
    handleClick(e) {
        const itemName = e.target.innerText.toLowerCase();
        switch(itemName) {
            case 'my device':
                if (!this.state.hasGetUserInfo && Cookies.get('user')) {
                    axios.post(dataSrc.userInfo, {
                        username: Cookies.get('user')
                    }).then( res => {
                        var mydevice = new Set(res.data.rows[0].mydevice);
                        this.props.getResultData(mydevice)
                        this.setState({
                            hasGetUserInfo: true,
                            mydevice: mydevice,
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                } else if (!Cookies.get('user')) {
                    return
                } else {
                    this.props.getResultData(this.state.mydevice)
                };

                break;
            case 'all device':
                this.props.shouldUpdateTrackingData(true)
                break;
        }     
    }

    render() {


        const locale = this.context;

        return (
            <Col id='frequentSearch' className=''>
                <h6 className="font-weight-bold">{locale.frequent_searches.toUpperCase()}</h6>
                <ListGroup variant="flush">
                    {Cookies.get('user') && <ListGroup.Item onClick={this.handleClick} action>My Device</ListGroup.Item>}
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