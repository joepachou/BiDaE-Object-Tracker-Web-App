import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import FrequentSearch from '../../container/FrequentSearch';
import ObjectTypeList from '../../container/ObjectTypeList';
import config from '../../../config';

export default class BrowserSearchContainer extends React.Component {

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
                        placeholder={this.props.searchKey}
                        getSearchKey={this.props.getSearchKey}
                        clearSearchResult={this.props.clearSearchResult}    
                    />
                </Row>
                <div id='searchOption' className="pt-2">
                    <Row>
                        <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                            <FrequentSearch 
                                getSearchKey={this.props.getSearchKey}  
                                clearSearchResult={this.props.clearSearchResult}   
                                hasGridButton={this.props.hasGridButton} 
                                maxHeigh={config.searchResultProportion}
                            />
                        </Col>
                        <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                            <ObjectTypeList
                                getSearchKey={this.props.getSearchKey}  
                                clearSearchResult={this.props.clearSearchResult}   
                                hasGridButton={this.props.hasGridButton} 
                                objectTypeList={this.props.objectTypeList}
                                maxHeigh={config.searchResultProportion}
                            />                            
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}