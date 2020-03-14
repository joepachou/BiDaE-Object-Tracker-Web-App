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
        // if (prepProps.assignValue !== this.props.assignValue && prepProps.assignValue) {
             
        //     this.setState({
        //         value: assignValue
        //     })
        // }
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
        const {
            placeholder,
            error,
            example,
            name
        } = this.props

        let style = {
            
            error: {
                color: "#dc3545"
            },
            example: {
                color: "grey"

            }
        }
        return (            
            <Form>
                <div className="d-flex">
                    <Form.Group 
                        className='flex-grow-1 mb-0'
                    >
                        <Form.Control 
                            type='text' 
                            name={name}
                            value={value} 
                            onChange={this.handleChange}
                            placeholder={placeholder}
                        />
                    </Form.Group>
                    <Button 
                        type="submit" 
                        variant='link' 
                        size="sm" 
                        onClick={this.handleSubmit}
                    >
                    </Button> 
                </div>
                {example && 
                    <small 
                        className="form-text"
                        style={style.example}
                    >
                        {example}
                    </small>
                }
                {error &&  
                    <small 
                        className="form-text text-capitaliz"
                        style={style.error}
                    >
                        {error}
                    </small>
                }
            </Form>
        );
    }
}

export default Searchbar;