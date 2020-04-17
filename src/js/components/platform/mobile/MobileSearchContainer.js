import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import ObjectTypeListForTablet from '../../container/ObjectTypeListForTablet';

export default class MobileSearchContainer extends React.Component {

    render() {

        const {
            searchKey,
            objectTypeList,
            getSearchKey,
            handleShowResultListForMobile
        } = this.props

        const style = {    
            textForMobile: {
                fontSize: '2rem'
            }
        }
        return (
            <div id='searchContainer' className="py-1" onTouchMove={this.handleTouchMove}>
                <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                    <Searchbar 
                        placeholder={this.props.searchKey}
                        getSearchKey={this.props.getSearchKey}
                        clearSearchResult={this.props.clearSearchResult}
                        handleShowResultListForMobile={this.props.handleShowResultListForMobile}    
                    />
                </Row>
                <div id='searchOption' className="pt-2" style={style.textForMobile}>
                    <Row>
                        <Col className='px-0'>
                            <ObjectTypeListForTablet
                                getSearchKey={this.props.getSearchKey}  
                                clearSearchResult={this.props.clearSearchResult}   
                                hasGridButton={this.props.hasGridButton} 
                                objectTypeList={this.props.objectTypeList}
                                handleShowResultListForMobile={this.props.handleShowResultListForMobile}   
                            />                            
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}