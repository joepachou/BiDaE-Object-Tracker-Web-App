import React from 'react';
import LocaleContext from '../../context/LocaleContext';
import styled from 'styled-components';
import searchIcon from '../../../img/search.png'


class Searchbar extends React.Component {

    render() {

        const divStyle = {
            border: "2px solid rgba(227, 222, 222, 0.447)",
            borderRadius : '25px',
            fontSize: '16px',
            width: '500px',
        }

        const locale = this.context;

        return (            
            <div style={divStyle} id='searchbar'>
                <form className="form-inline d-flex justify-content-between">
                    <div className="form-group mx-3">
                        <label htmlFor="inputPassword2" className="sr-only">{locale.search.toUpperCase()}</label>
                        <input type="text" className="form-control-sm border-0 " />
                    </div>
                    <button type="submit" className="btn btn-link btn-sm text-uppercase"><img src={searchIcon} width="30px" /></button>

                </form>
            </div>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;