import React from 'react';
import LocaleContext from '../../context/LocaleContext';
import searchIcon from '../../../img/icon/search.png';
import { Form, Row, Col, Button } from 'react-bootstrap';


class Searchbar extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prepProps) {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                value: '',
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.getSearchKey(this.state.value);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    render() {

        const style = {
            form: {
                border: "2px solid rgba(227, 222, 222, 0.447)",
                borderRadius : '25px',
                fontSize: '16px',
                width:300,
            },
            input: {
                background: 'rgba(0,0,0,0',
            }
        }

        const { value } = this.state;

        const locale = this.context;

        return (            
            <Form className="d-flex justify-content-around" style={style.form}>
                <Form.Group className='flex-grow-1 mb-0'>
                    <Form.Control 
                        id='searchbarText' 
                        type='text' 
                        style={style.input} 
                        className='border-0 pl-3 w-100 pb-0' 
                        value={value} 
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button type="submit" variant='link' className="btn btn-link btn-sm text-uppercase bd-highlight" onClick={this.handleSubmit}><img src={searchIcon} width="30px" /></Button>
            </Form>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;