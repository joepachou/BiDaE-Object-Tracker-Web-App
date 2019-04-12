import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';

const SearchableObjectType = (props) => {



        /** Customized CSS of sectionTitle */
        const sectionTitleStyle = {
            display: props.isShowSectionTitle ? null : 'none',
        }

        /** Customized CSS of sectionIndexItem */
        const sectionIndexItemStyle = {
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: props.clientHeight * 0.06,
        }
    
        return (        
            <div id='searchableObjectType' className='col-6'>
                <h6 className="font-weight-bold">SEARCHABLE OBJECT TYPES</h6>
                <div className='d-flex'>
                    <div id='sectionTitle'  className='flex-grow-1 bd-highlight border-0' data-spy="scroll" data-target="#sectionIndex" data-offset="0">
                        <ListGroup className='list-group border' variant="flush" style={sectionTitleStyle}>
                            {/* {this.state.data.map(item => {
                                let currentLetter = item.name.toUpperCase().slice(0,1);
                                let toReturn = '';
                                if (!currentLetter === groupLetter) {
                                    return <ListGroup.Item>{groupLetter}</ListGroup.Item>
                                                
                                } else {
                                    return <ListGroup.Item>{item.name}</ListGroup.Item>
                                }

                            })} */}
                            {props.sectionTitleList.map(item => {
                                return item
                            })}
                        </ListGroup>
                    </div>
                    
                    <div id="sectionIndex" className='bd-highlight'>
                        <Nav className="flex-column">
                            {props.sectionIndexList.map( (letter, index) => {
                                const toggleClassName = props.sectionIndex === letter ? 'activeIndex' : '';
                                return <Nav.Link active={false} href={'#' + letter} className={ toggleClassName + ' sectionIndexItem' + ' pr-4' + ' pl-4'}  
                                            style={sectionIndexItemStyle} onMouseOver={props.handleMouseOver} onTouchStart={props.handleTouchStart} 
                                                onTouchMove={props.handleTouchMove}>{letter}</Nav.Link>
                            })} 
                        </Nav>
                    </div>
                </div>
            </div>
        );
    
}

export default SearchableObjectType