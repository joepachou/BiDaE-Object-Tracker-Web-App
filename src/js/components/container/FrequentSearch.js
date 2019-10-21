import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';

class FrequentSearch extends React.Component {

    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasGridButton !== this.props.hasGridButton && this.props.hasGridButton) {
            this.setState({
                searchKey: ''
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name.toLowerCase();
        this.getSearchKey(itemName)
    }

    getSearchKey = (itemName) => {
        this.props.getSearchKey(itemName)
        this.setState({
            searchKey: itemName
        })
    }

    render() {
        const { locale, auth } = this.context

        const style = {
            list: {
                maxHeight: "40vh",
                overflow: "hidden scroll"
            }
        }

        return (
            <div className='d-inline-flex flex-column mb-3' id='frequentSearch' >
                <h4 className='text-capitalize'>{locale.texts.FREQUENT_SEARCH}</h4>
                <div style={style.list}>
                    {auth.authenticated && auth.user.searchHistory
                        && auth.user.searchHistory.filter( (item,index) => {
                        return index < config.userPreference.searchHistoryNumber
                    }).map( (item, index) => {
                        return (
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === item.name.toLowerCase()} 
                                key={index}
                                name={item.name}
                                className="text-capitalize"
                            >
                                {item.name}
                            </Button>
                        )
                    })}
                    <br/>
                    <br/>
                    <AccessControl
                        permission={'user:mydevice'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            active={this.state.searchKey === 'my devices'}
                            name='my devices'
                        >
                            {locale.texts.MY_DEVICE}
                        </Button>
                    </AccessControl>
                
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        active={this.state.searchKey === 'all devices'}
                        name='all devices'
                    >
                        {locale.texts.ALL_DEVICE}
                    </Button>
                </div>
            </div>
        )
    }
}

export default FrequentSearch;