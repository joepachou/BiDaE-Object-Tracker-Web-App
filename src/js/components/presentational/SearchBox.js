import React from 'react';
import searchIcon from '../../../img/icon/search.png';
import { 
    Button 
} from 'react-bootstrap';
import { Formik, Field, Form } from 'formik';
import { AppContext } from '../../context/AppContext';

class SearchBox extends React.Component {
    
    static contextType = AppContext
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

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.getSearchKey(this.state.value);
    // }

    handleChange = (e) => { 

        this.setState({
            value: e.target.value
        })  
        this.props.getSearchKey(e.target.value);
    }

    render() {

        const { value } = this.state;
        const {
            locale
        } = this.context
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
            <Formik                    

                initialValues={{
                    value: ""
                }}

           
                onSubmit={(values, { setStatus, setSubmitting }) => {

                }}

                render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                    <Form >
                        <div 
                            className="d-flex align-items-center" 
                            style={{
                                border: '1px solid #ced4da',
                                padding: '.375rem .75rem'
                            }}
                        >
                            <i class="fas fa-search"></i>
                            <Field  
                                style={{
                                    border: 'none',
                                    background: 'unset',
                                    letterSpacing: '1.5px'
                                }}
                                name="value"
                                type="text"
                                className={'form-control' + (error && touched ? ' is-invalid' : '')} 
                                onChange={(e) => {
                                    let value = e.target.value
                                    setFieldValue('value', value),
                                    this.props.getSearchKey(e.target.value)
                                }}
                                placeholder={locale.texts.SEARCH}
                            />
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
                )}
            />
        );
    }
}

export default SearchBox;