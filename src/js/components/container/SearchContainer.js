import React from 'react';
import Searchbar from '../presentational/Searchbar';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

/** API url */
import dataAPI from '../../../js/dataAPI';


export default class SearchContainer extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            isShowSectionTitle: true,
            hasSearchResult: false,
            searchKey:'',
            data: [
                {
                    name: 'Alarm',
                },
                {
                    name: 'Andy'
                },
                {
                    name: 'Bladder Scanner',
                },
                {
                    name: 'Bench',
                },
                {
                    name: 'Crazy nerd'
                },
                {
                    name: 'Duck combiner'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },
                {
                    name: 'Medaical device'
                },

            ],
            sectionTitleList:[],
            sectionIndex:'',
        }
    
        this.handleIndex = this.handleIndex.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.getSearchableObjectData = this.getSearchableObjectData.bind(this);
    }

    componentDidMount() {
        this.getSearchableObjectData();
        const targetElement = document.body;
        // disableBodyScroll(targetElement);
    }

    shouldComponentUpdate(){
        return true
    }
    componentWillUnmount() {
        clearAllBodyScrollLocks();
    }

    getSearchableObjectData() {
        // axios.get(dataAPI.objectTable).then(res => {
        //     console.log(res.data.rows)

        //     let sectionTitleList = [];
        //     res.data.rows.map( item => {
        //         console.log(item.name)
        //         return <ListGroup.Item>{item.name}</ListGroup.Item>
        //     })
        //     this.setState({
        //         sectionTitleList:res.data.rows
        //     })
        // }).catch(function (error) {
        //     console.log(error);
        // })

        let sectionTitleList = [];
        let groupLetter = '';

        const titleElementStyle = {
            background: 'rgba(227, 222, 222, 0.619)',
            fontWeight: 'bold',
            fontSize: 30,
        }

        const itemElementStyle = {
            fontSize: 25,
        }
        
        this.state.data.map( item => {
            let currentLetter = item.name.toUpperCase().slice(0,1);
            if(!(groupLetter === currentLetter)) {
                groupLetter = currentLetter;
                let titleElement = <a id={groupLetter}><ListGroup.Item style={titleElementStyle}>{groupLetter}</ListGroup.Item></a>;
                sectionTitleList.push(titleElement)
            }
            let itemElement = <ListGroup.Item action style={itemElementStyle}>{item.name}</ListGroup.Item>;
            sectionTitleList.push(itemElement);
        })
        this.setState({
            sectionTitleList: sectionTitleList,
        })
    }

    handleIndex(e){
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    handleMouseOver(e) {
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    handleTitle(e){
        this.setState({
            hasSearchResult: true,
            searchKey:e.target.innerText,
        })
    }
    handleTouchStart(e) { 
        if (e.target.classList.contains("sectionIndexList")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: 'sectionIndex',
        })
    }

    handleTouchMove(e) { 
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);
        if (element.classList.contains("sectionIndexList")) {
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: 'element.innerText',
            })
        }

    }

    render() {

        /** Customized CSS of sectionIndex */
        const sectionIndexStyle = {
            padding: 0,
            fontSize: 40,
        }

        /** Customized CSS of sectionTitle */
        const sectionTitleStyle = {
            display: this.state.isShowSectionTitle ? null : 'none',
        }

        /** Customized CSS of searchResult */
        const searchResultStyle = {
            display: this.state.hasSearchResult ? null : 'none',
        }

        const searchResultContentStyle = {
            border: '1px solid rgb(227, 222, 222)',
            paddingLeft: 25,
            paddingRight: 0,
            marginBottom: 40,
        }
        
        
        return (
            <div >
                <div id='searchBar' className='d-flex w-100 justify-content-center'>
                    <Searchbar placeholder={this.state.searchKey}/>
                </div>
                <div id='searchResult' style={searchResultStyle}>
                    <h4>Search Result</h4>
                    <div className='row' >
                        <div className='col-6' style={searchResultContentStyle}>
                            <ListGroup variant="flush" className='list-group'>
                                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            </ListGroup>
                        </div>
                        <div className='col-6' style={searchResultContentStyle}>
                        t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                        </div>
                    </div>
                </div>
                <div>
                    <div className='row'>
                        <div className='col-6'>
                            <h4>FREQUENT SEARCHES</h4>
                            
                        </div>

    
                        <div className='col-6'>
                            <h4>SEARCHABLE OBJECT TYPES</h4>
                            <div className='d-flex'>
                                <div id='sectionTitle' className='p-2 flex-grow-1 bd-highlight' data-spy="scroll" data-target="#sectionIndex" data-offset="0">
                                    <ListGroup style={sectionTitleStyle} className='list-group'>
                                        {/* {this.state.data.map(item => {
                                            let currentLetter = item.name.toUpperCase().slice(0,1);
                                            let toReturn = '';
                                            if (!currentLetter === groupLetter) {
                                                return <ListGroup.Item>{groupLetter}</ListGroup.Item>
                                                            
                                            } else {
                                                return <ListGroup.Item>{item.name}</ListGroup.Item>
                                            }

                                        })} */}
                                        {this.state.sectionTitleList.map(item => {
                                            return item
                                        })}
                                    </ListGroup>
                                </div>
                                
                                <div className='p-2 bd-highlight sectionIndex'>
                                    <Nav defaultActiveKey="/" className="flex-column">
                                        {this.state.sectionIndexList.map( (letter, index) => {
                                            return <Nav.Link href={'#' + letter} className="sectionIndexList" style={sectionIndexStyle} onMouseOver={this.handleMouseOver} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove}>{letter}</Nav.Link>
                                        })} 
                                    </Nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        );
    }
}