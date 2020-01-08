import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';

class ObjectTypeListForTablet extends React.Component {

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
                maxHeight: "50vh",
                overflow: "hidden scroll",
            },
            button: {
                //border: 'solid',
                padding: "0.1rem"
            }
        }

        return (
            <div id='objectTypeList' className='d-inline-flex flex-column'>
                <div className='text-capitalize title'>{locale.texts.OBJECT_TYPE}</div>
                <div style={style.list} className="d-inline-flex flex-column searchOption">
                    {this.props.objectTypeList.map((item, index) => {
                        return ( 
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                // active={this.state.searchKey === item.toLowerCase()} 
                                key={index}
                                name={item}
                                className="text-capitalize"
                                style={style.button}
                            >
                                {item}
                            </Button>
                        )
                    })}
                    &nbsp;
                </div>
                
                <div className='d-inline-flex flex-column'>
                &nbsp;
                    <AccessControl
                        permission={'user:mydevice'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick}
                            name = 'my patients'
                            className="text-capitalize"
                        >
                            {locale.texts.MY_PATIENTS}
                        </Button>

                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            // active={this.state.searchKey === 'my devices'}
                            name='my devices'
                            className="text-capitalize"
                        >
                            {locale.texts.MY_DEVICES}
                        </Button>
                    </AccessControl>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name='all patients'
                        className="text-capitalize"
                    >
                        {locale.texts.ALL_PATIENTS}
                    </Button>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name='all devices'
                        className="text-capitalize"
                    >
                        {locale.texts.ALL_DEVICES}
                    </Button>
                </div>
            </div>
        )
    }
}

export default ObjectTypeListForTablet;