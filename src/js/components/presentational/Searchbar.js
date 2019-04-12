import React from 'react';

export default class Searchbar extends React.Component {


    render() {
        return (
            <div id='searchBar'>
                <form className="form-inline">
                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="inputPassword2" className="sr-only">Search</label>
                        <input type="text" className="form-control-sm"  placeholder={this.props.placeholder|| "SEARCH"}/>
                    </div>
                    <button type="submit" className="btn btn-secondary mb-2 btn-sm text-uppercase">Search</button>
                </form>
            </div>
        );
    }
}