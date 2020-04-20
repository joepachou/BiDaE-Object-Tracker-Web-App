import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import FrequentSearch from '../../container/FrequentSearch';
import ObjectTypeList from '../../container/ObjectTypeList';
import config from '../../../config';

const BrowserSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
}) => {
    return (
        <div 
            id='searchContainer' 
            className="py-1" 
            onTouchMove={handleTouchMove}
        >
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <Searchbar 
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                />
            </Row>
            <div id='searchOption' className="pt-2">
                <Row>
                    <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                        <FrequentSearch 
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            maxHeigh={config.searchResultProportion}
                        />
                    </Col>
                    <Col md={6} sm={6} xs={6} lg={6} xl={6} className='px-0'>
                        <ObjectTypeList
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            objectTypeList={objectTypeList}
                            maxHeigh={config.searchResultProportion}
                        />                            
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default BrowserSearchContainer