import React from 'react';

export default class Searchbar extends React.Component {


    render() {
        return (
            <div id='searchBar'>
                <form class="form-inline">
                    <div class="form-group mx-sm-3 mb-2">
                        <label for="inputPassword2" class="sr-only">Search</label>
                        <input type="text" class="form-control-lg"  placeholder={this.props.placeholder|| "Search"}/>
                    </div>
                    <button type="submit" class="btn btn-primary mb-2 btn-lg">Search</button>
                </form>
            </div>
        );
    }
}