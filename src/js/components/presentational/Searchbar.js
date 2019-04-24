import React from 'react';
import LocaleContext from '../../../LocaleContext';

class Searchbar extends React.Component {

    render() {
        const locale = this.context;
        return (            
            <div id='searchBar'>
                <form className="form-inline">
                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="inputPassword2" className="sr-only">{locale.search.toUpperCase()}</label>
                        <input type="text" className="form-control-sm"  placeholder={this.props.placeholder|| locale.search.toUpperCase()}/>
                    </div>
                    <button type="submit" className="btn btn-secondary mb-2 btn-sm text-uppercase">{locale.search.toUpperCase()}</button>
                </form>
            </div>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;