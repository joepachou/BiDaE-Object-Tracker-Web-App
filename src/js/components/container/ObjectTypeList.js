import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';

class ObjectTypeList extends React.Component {

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
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
            list: {
                maxHeight: "40vh",
                overflow: "hidden scroll"
            }
        }

        const { locale, auth } = this.context

        return (
            <div id='objectTypeList' >
                <h4 className='text-capitalize'>{locale.texts.OBJECT_TYPE}</h4>
                <div style={style.list} className="d-inline-flex flex-column justify-content-center">
                    {this.props.objectTypeList.map((item, index) => {
                        return (
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                // active={this.state.searchKey === item.toLowerCase()} 
                                key={index}
                                name={item}
                                className="text-capitalize"
                            >
                                {item}
                            </Button>
                        )
                    })}
                </div>
            </div>
                
        )
    }
}

export default ObjectTypeList;