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
        this.props.getSearchKey(e.target.value);
    }

    render() {

        const { value } = this.state;

        return (            
            <Form className="d-flex" >
                <Form.Group className='flex-grow-1'>
                    <Form.Control 
                        type='text' 
                        value={value} 
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button 
                    type="submit" 
                    variant='link' 
                    size="sm" 
                    onClick={this.handleSubmit}
                >
                </Button> 
            </Form>
        );
    }
}

export default Searchbar;