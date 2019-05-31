import React from 'react';
import Searchbar from '../presentational/Searchbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import axios from 'axios';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

/** API url */
import dataSrc from '../../../js/dataSrc';

import SearchableObjectType from '../presentational/SeachableObjectType';
import SearchResult from '../presentational/SearchResult'
import LocaleContext from '../../context/LocaleContext';

class SearchContainer extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            isShowSectionTitle: false,
            hasSearchResult: false,
            isShowSearchOption: false,
            searchKey:'',
            sectionTitleList: [],
            sectionIndex:'',
            searchResult: [],
        }
    
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        
        this.getObjectType = this.getObjectType.bind(this);
        this.getResultData = this.getResultData.bind(this);
    }

    

    componentDidMount() {
        this.getObjectType();
        const targetElement = document.body;
        document.body.style.position = "fixed";

        // disableBodyScroll(targetElement);
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.state !== nextState;
    }

    // componentWillUnmount() {
    //     clearAllBodyScrollLocks();
    // }


    /**
     * Get the searchable object type, maybe from the object_type_table, but now is from the object_table
     */
    getObjectType() {
        const titleElementStyle = {
            background: 'rgba(227, 222, 222, 0.619)',
            fontWeight: 'bold',
            fontSize: 10,
            padding: 5,
        }

        const itemElementStyle = {
            padding: 5
        }

        axios.get(dataSrc.objectTable).then(res => {

            /** Creat a set that stands for the unique object in this searching area */
            const objectData = res.data.rows;
            let objectTypeSet = new Set();
            objectData.map( item => {
                objectTypeSet.add(item.type);
            })

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
                let itemElement = <a onClick={this.getResultData} key={elementIndex}><ListGroup.Item action style={itemElementStyle} >{item}</ListGroup.Item></a>;
                sectionTitleList.push(itemElement);
                elementIndex++;
            })
            this.setState({
                sectionTitleList: sectionTitleList,
            })

        }).catch(function (error) {
            console.log(error);
        })
    }

    /**
     * Fired once the user click the item in object type list or in frequent seaerch
     * Also, popout the searchResult component.
     */
    getResultData(e) {
        const searchKey = e.target.innerText;

        axios.post(dataSrc.searchResult, {
            searchkey: searchKey,
        }).then(res => {
            let result = [];
            res.data.rows.map(item => {
                result.push(item)
            })

            this.setState({
                hasSearchResult: true,
                searchKey: searchKey,
                searchResult: result,
            })
        }).catch( error => {
            console.log(error)
        })

    }

    /**
     * Handle the cursor hover events in device that can use mouse.
     */
    handleMouseOver(e) {
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
    handleTouchStart(e) { 
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
    handleTouchMove(e) { 
        
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

        /** Customized CSS of searchResult */
        const searchResultStyle = {
            display: this.state.hasSearchResult ? null : 'none',
            paddingTop: 30,
        }

        const searchOptionStyle = {
            display: this.state.hasSearchResult ? 'none' : null,
        }

        const locale = this.context;
        const { searchResult, searchKey } = this.state;
        
        return (
            <div id='searchContainer' className="mx-2" onTouchMove={this.handleTouchMove}>
                <div id='searchBar' className='d-flex w-100 justify-content-center align-items-center'>
                    <Searchbar placeholder={this.state.searchKey}/>
                </div>

                <div id='searchResult' style={searchResultStyle} className='py-3'>
                    <SearchResult result={searchResult} searchKey={searchKey} />
                </div>

                <div id='searchOption' style={searchOptionStyle} className='pt-2'>
                    <Row>
                        <Col id='frequentSearch' md={6} sm={6} xs={6} className=''>
                            <h6 className="font-weight-bold">{locale.frequent_searches.toUpperCase()}</h6>
                            <ListGroup variant="flush">
                                <ListGroup.Item onClick={this.handleSectionTitleClick}>Bladder Scanner</ListGroup.Item>
                                <ListGroup.Item onClick={this.handleSectionTitleClick}>Alarm</ListGroup.Item>
                            </ListGroup>
                    
                        </Col>
                        <Col id='searchableObjectType' md={6} sm={6} xs={6} className='px-0'>
                            <h6 className="font-weight-bold">{locale.object_types.toUpperCase()}</h6>
                            <SearchableObjectType sectionTitleList={this.state.sectionTitleList} 
                                sectionIndexList={this.state.sectionIndexList} sectionIndex={this.state.sectionIndex} 
                                    handleMouseOver={this.handleMouseOver} handleTouchStart={this.handleTouchStart} 
                                        handleTouchMove={this.handleTouchMove} isShowSectionTitle={this.state.isShowSectionTitle}
                                            clientHeight={this.state.clientHeight}/>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

SearchContainer.contextType = LocaleContext;

export default SearchContainer;