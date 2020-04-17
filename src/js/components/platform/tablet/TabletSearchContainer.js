import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import ObjectTypeListForTablet from '../../container/ObjectTypeListForTablet';

export default class TabletSearchContainer extends React.Component {

    render() {

        const {
            searchKey,
            objectTypeList,
            getSearchKey
        } = this.props

        return (
            <div id='searchContainer' className="py-1" onTouchMove={this.handleTouchMove}>
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <Searchbar 
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={this.props.clearSearchResult}    
                />
            </Row>
            <div id='searchOption' className="pt-2">
                <Row>
                    <Col className='px-0'>
                        <ObjectTypeListForTablet
                            getSearchKey={getSearchKey}  
                            clearSearchResult={this.props.clearSearchResult}   
                            hasGridButton={this.props.hasGridButton} 
                            objectTypeList={objectTypeList}
                        />                            
                    </Col>
                </Row>
            </div>
        </div>
        )
    }
}