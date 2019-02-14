import React from 'react';
import Container from 'react-bootstrap/Container';

export default class SearchBar extends React.Component {
    render() {
        return (
            <Container>
                <form className="my-lg-4">
                    <div class="form-row">
                        <div class="col-7">
                            <input type="text" class="form-control" placeholder="search" />
                        </div>
                        <div class="col">
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                
                    </div>
                </form>
                
            </Container>
        );
    }
}