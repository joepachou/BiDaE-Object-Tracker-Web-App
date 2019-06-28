import React from 'react';
import LocaleContext from '../../context/LocaleContext';
import searchIcon from '../../../img/search.png';
import { Form, Row, Col } from 'react-bootstrap';


class Searchbar extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.getResultData(this.state.value);
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
                minWidth: 280
            }
        }

        const { value } = this.state;

        const locale = this.context;

        return (            
            <Form id='searchbar' className="form-inline d-flex justify-content-between w-75" style={style.form}>
                <div className="form-group mx-3">
                    <label htmlFor="inputPassword2" className="sr-only">{locale.search.toUpperCase()}</label>
                    <input id='test' type="text" className="form-control-sm border-0" value={value} onChange={this.handleChange}/>
                </div>
                <button type="submit" className="btn btn-link btn-sm text-uppercase" onClick={this.handleSubmit}><img src={searchIcon} width="30px" /></button>
            </Form>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;