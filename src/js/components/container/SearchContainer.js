import React from 'react';
import Searchbar from '../presentational/Searchbar';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'
import FrequentSearch from './FrequentSearch';
import config from '../../config';
import SearchableObjectType from '../presentational/SearchableObjectType'

class SearchContainer extends React.Component {

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
        refreshSearchResult: config.systemAdmin.refreshSearchResult
    }

    componentDidUpdate = (prepProps) => {
        /** Refresh the search result automatically 
         *  This feature can be adjust by the user by changing the boolean value in config
        */
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
        const titleElementStyle = {
            background: 'rgba(227, 222, 222, 0.619)',
            fontWeight: 'bold',
            fontSize: 10,
            padding: 5,
        }

        const itemElementStyle = {
            padding: 5
        }
        

        /** Creat a set that stands for the unique object in this searching area */
        const { searchableObjectData } = this.props;
        
        let objectTypeSet = new Set();
        let objectTypeMap = new Map();
        
        for (let object in searchableObjectData) {
            objectTypeSet.add(searchableObjectData[object].type)
        }

        /** Creat the titleList by inserting the item in the objectTypeSet
         *  Also, create the character title element
         */
        let sectionTitleList = [];
        let groupLetter = '';
        let elementIndex = 0;

        Array.from(objectTypeSet).map( item => {
            // let currentLetter = item.toUpperCase().slice(0,1);
            let currentLetter = item ? item.toUpperCase().charAt(0) : item;
            if(!(groupLetter === currentLetter)) {
                groupLetter = currentLetter;
                let titleElement = <a id={groupLetter} key={elementIndex} className='titleElementStyle'><ListGroup.Item style={titleElementStyle}>{groupLetter}</ListGroup.Item></a>;
                sectionTitleList.push(titleElement)
                elementIndex++;
            }
            let itemElement = <a onClick={this.props.getSearchKey} key={elementIndex}><ListGroup.Item action style={itemElementStyle} >{item}</ListGroup.Item></a>;
            sectionTitleList.push(itemElement);
            elementIndex++;
        })
        this.setState({
            sectionTitleList: sectionTitleList,
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
                <div id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                    <Searchbar 
                        placeholder={this.state.searchKey}
                        getSearchKey={this.props.getSearchKey}
                        clearSearchResult={this.props.clearSearchResult}    
                    />
                </div>
                <div id='searchOption' className='pt-2'>
                    <FrequentSearch 
                        getSearchKey={this.props.getSearchKey}  
                        clearSearchResult={this.props.clearSearchResult}   
                        hasGridButton={this.props.hasGridButton} 
                    />
                    {/* <Col id='searchableObjectType' md={6} sm={6} xs={6} className='px-0'>
                        <h6 className="font-weight-bold">{}</h6>
                        <SearchableObjectType 
                            sectionTitleList={this.state.sectionTitleList} 
                            sectionIndexList={this.state.sectionIndexList} 
                            sectionIndex={this.state.sectionIndex} 
                            handleMouseOver={this.handleMouseOver} 
                            handleTouchStart={this.handleTouchStart} 
                            handleTouchMove={this.handleTouchMove} 
                            isShowSectionTitle={this.state.isShowSectionTitle}
                            clientHeight={this.state.clientHeight}
                        />
                    </Col> */}
                    {/* <SearchableObjectType
                        floatUp = {this.props.floatUp}
                        objectTypeList = {this.props.objectTypeList}
                        onSubmit={this.getSearchResult}
                    /> */}
                </div>
            </div>
        );
    }
}


export default SearchContainer;