import React from 'react';
import searchIcon from '../../../img/icon/search.png';
import { Form, Button } from 'react-bootstrap';

class Searchbar extends React.Component {
    
    state = {
        value: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                value: '',
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.getSearchKey(this.state.value);
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render() {

        const style = {
            form: {
                border: "2px solid rgba(227, 222, 222, 0.447)",
                borderRadius : '25px',
                fontSize: '20px',
                width:300,
            },
            input: {
                background: 'rgba(0,0,0,0)',
                fontSize: '1rem'
            }
        }

        const { value } = this.state;

        return (            
            <Form className={"d-flex " + this.props.className} style={style.form}>
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
                <Button 
                    type="submit" 
                    variant='link' 
                    className="btn btn-link btn-sm text-uppercase bd-highlight" 
                    onClick={this.handleSubmit}
                >
                    <img src={searchIcon} width="25px" />
                </Button>
            </Form>
        );
    }
}

export default Searchbar;