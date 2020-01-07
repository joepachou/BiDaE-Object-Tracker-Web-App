import React from 'react';
import Searchbar from '../presentational/Searchbar';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'
import FrequentSearch from './FrequentSearch';
import config from '../../config';
// import SearchableObjectType from '../presentational/SearchableObjectType_1'
import SearchableObjectType from '../presentational/SearchableObjectType'
import LocaleContext from '../../context/LocaleContext';
import ObjectTypeListForTablet from './ObjectTypeListForTablet'
import axios from 'axios';
import { getObjectTable } from '../../dataSrc'
import { AppContext } from '../../context/AppContext';


class SearchContainerForTablet extends React.Component {

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
    /**
     * Get the searchable object type. 
     * The data is retrieving from Surveillance -> MainContain -> SearchContainer
     */
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

    /**
     * Handle the cursor hover events in device that can use mouse.
     */
    handleMouseOver = (e) => {
        // document.getElementById('sectionTitle').display = null;
        // document.getElementById(e.target.innerText).scrollIntoView({behavior: "instant", block: "start", inline: "nearest"})
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /**
     * Handle the touch start events in mobile device
     */
    handleTouchStart = (e) => { 
        if (e.target.classList.contains("sectionIndexItem")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /**
     * Handle the touch move events in mobile device
     */
    handleTouchMove = (e) => { 
        
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);

        if (element.classList.contains("sectionIndexItem")) {
            // document.getElementById('sectionTitle').display = null;
            // document.getElementById(element.innerText).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: element.innerText,
            })
        }
    }

    render() {      
        return (                   
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
        );
    }
}

export default SearchContainerForTablet;