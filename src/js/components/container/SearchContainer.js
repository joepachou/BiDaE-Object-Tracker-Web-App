import React from 'react';
import Searchbar from '../presentational/Searchbar';
import { Col, Row } from 'react-bootstrap'
import FrequentSearch from './FrequentSearch';
import config from '../../config';
import ObjectTypeList from './ObjectTypeList'
import ObjectTypeListForTablet from './ObjectTypeListForTablet'
import axios from 'axios';
import { getObjectTable } from '../../dataSrc'
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect'

class SearchContainer extends React.Component {

    static contextType = AppContext

    state = {
        sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        isShowSectionTitle: false,
        hasSearchKey: false,
        isShowSearchOption: false,
        searchKey:'',
        sectionTitleList: [],
        sectionIndex:'',
        searchResult: [],
        hasSearchableObjectData: false,
        objectTypeList: [],        
    }

    componentDidMount = () => {
        this.getObjectType()
    }

    componentDidUpdate = (prepProps) => {
        
        /** Refresh the search result automatically 
         *  This feature can be adjust by the user by changing the boolean value in config */
        if (this.state.refreshSearchResult 
            && this.state.hasSearchKey 
            && !this.props.hasGridButton) {
            this.props.getSearchKey(this.state.searchKey)            
        }
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && this.props.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasSearchKey !== this.props.hasSearchKey && prepProps.hasSearchKey) {
            this.setState({
                hasSearchKey: this.props.hasSearchKey,
            })
        }

    }
    /* Get the searchable object type. 
     * The data is retrieving from Surveillance -> MainContain -> SearchContainer */
    getObjectType = () => {
        axios.post(getObjectTable, {
            objectType: [0]
        })
        .then(res => {
            let objectTypeList = res.data.rows.reduce((objectTypeList, item) => {
                if (!objectTypeList.includes(item.type)) {
                    objectTypeList.push(item.type)
                }
                return objectTypeList
            }, [])
            this.setState({
                objectTypeList
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    /* Handle the cursor hover events in device that can use mouse.*/
    handleMouseOver = (e) => {
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /* Handle the touch start events in mobile device */
    handleTouchStart = (e) => { 
        if (e.target.classList.contains("sectionIndexItem")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /* Handle the touch move events in mobile device */
    handleTouchMove = (e) => { 
        
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);

        if (element.classList.contains("sectionIndexItem")) {
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: element.innerText,
            })
        }
    }

    render() {      
        const style = {    
            textForMobile: {
                fontSize: '2rem'
            }
        }
        
        return (
            <div>
                <BrowserView>                   
                    <div id='searchContainer' className="py-1" onTouchMove={this.handleTouchMove}>
                        <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                            <Searchbar 
                                placeholder={this.state.searchKey}
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
                                        objectTypeList={this.state.objectTypeList}
                                        maxHeigh={config.searchResultProportion}
                                    />                            
                                </Col>
                            </Row>
                        </div>
                    </div>
                </BrowserView>
                <TabletView>
                    <div id='searchContainer' className="py-1" onTouchMove={this.handleTouchMove}>
                        <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                            <Searchbar 
                                placeholder={this.state.searchKey}
                                getSearchKey={this.props.getSearchKey}
                                clearSearchResult={this.props.clearSearchResult}    
                            />
                        </Row>
                        <div id='searchOption' className="pt-2">
                            <Row>
                                <Col className='px-0'>
                                    <ObjectTypeListForTablet
                                        getSearchKey={this.props.getSearchKey}  
                                        clearSearchResult={this.props.clearSearchResult}   
                                        hasGridButton={this.props.hasGridButton} 
                                        objectTypeList={this.state.objectTypeList}
                                    />                            
                                </Col>
                            </Row>
                        </div>
                    </div>
                </TabletView>
                <MobileOnlyView>
                    <div id='searchContainer' className="py-1" onTouchMove={this.handleTouchMove}>
                        <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                            <Searchbar 
                                placeholder={this.state.searchKey}
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
                                        objectTypeList={this.state.objectTypeList}
                                        handleShowResultListForMobile={this.props.handleShowResultListForMobile}   
                                    />                            
                                </Col>
                            </Row>
                        </div>
                    </div>
                </MobileOnlyView>
            </div>
        );
    }
}

export default SearchContainer;