import React from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import Cookies from 'js-cookie'
import config from '../../config';

class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.state = {
            hasGetUserInfo: false,
            searchkey: '',
        }

        this.handleClick = this.handleClick.bind(this);
        this.getSearchKey = this.getSearchKey.bind(this);
    }
    componentDidUpdate(prepProps) {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchkey: '',
            })
        }
    }


    handleClick(e) {
        const itemName = e.target.innerText.toLowerCase();
        this.getSearchKey(itemName)
    }

    getSearchKey(itemName) {
        switch(itemName) {
            case config.frequentSearchOption.MY_DEVICES:
                const mydevice = new Set(JSON.parse(Cookies.get(config.userPreference.cookies.USER_DEVICES)))
                this.setState({
                    hasGetUserInfo: true,
                })
                this.props.getResultData(mydevice)

                break;
            case config.frequentSearchOption.ALL_DEVICES:
                // this.props.shouldUpdateTrackingData(true)
                this.props.getResultData(itemName)
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
                    <h4>Frequent Search</h4>
                </Row>
                <div className='d-inline-flex flex-column mb-3' id='frequentSearch' >
                    {Cookies.get('searchHistory') && JSON.parse(Cookies.get('searchHistory')).filter( (item,index) => {
                        return item.name !== 'All' && index < config.userPreference.searchHistoryNumber
                    }).map( (item, index) => {
                        
                        return (
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchkey === item.name.toLowerCase()} 
                                key={index}
                            >
                                {item.name}
                            </Button>
                        )
                    })}
                    &nbsp;
                    {Cookies.get('user') && 
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            active={this.state.searchkey === 'my devices'}
                        >
                            My Devices
                        </Button>
                    }
                        <Button 
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            active={this.state.searchkey === 'all devices'}
                        >
                            All Devices
                        </Button>
                </div>
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