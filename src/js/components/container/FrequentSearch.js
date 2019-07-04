import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
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
            searchkey: '',
        }

        this.handleClick = this.handleClick.bind(this);
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
            default:
                this.props.getResultData(itemName)
                break;
        }
        this.setState({
            searchkey: itemName
        })
    }

    render() {
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
        }

        const locale = this.context;

        return (
            <>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h5>Frequent Search</h5>
                </Row>
                <ListGroup>
                    {Cookies.get('searchHistory') && JSON.parse(Cookies.get('searchHistory')).map( (item, index) => {
                        
                        return (
                            <ListGroup.Item 
                                onClick={this.handleClick} 
                                action 
                                active={this.state.searchkey === item.name.toLowerCase()} 
                                key={index}
                            >
                                {item.name}
                            </ListGroup.Item>
                        )
                    })}
                    {Cookies.get('user') && 
                        <ListGroup.Item 
                            onClick={this.handleClick} 
                            action
                            active={this.state.searchkey === 'my device'}
                        >
                            My Device
                        </ListGroup.Item>}
                    <ListGroup.Item 
                        onClick={this.handleClick} 
                        action
                        active={this.state.searchkey === 'all device'}
                    >
                        All Device
                    </ListGroup.Item>
                </ListGroup>
            </>
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