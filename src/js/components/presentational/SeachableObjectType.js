import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';


const SearchableObjectType = (props) => {




    /** Customized CSS of sectionIndexItem */
    const sectionIndexItemStyle = {
        paddingTop: 0,
        paddingBottom: 0,
    }

    /** Customized CSS of sectionTitle */

    const sectionTitleStyle = {
        display: props.isShowSectionTitle ? null : 'none',
        overflow: 'auto',
        maxHeight: '70vh',
        position: 'relative',
        /* font-size: 2em; */
        border: 'solid 2px rgba(227, 222, 222, 0.619)',
        padding: 0,
    
    }



    return (        
        <div className='d-flex'>
            <div id='sectionTitle' className='flex-grow-1 bd-highlight border-0' data-spy="scroll" data-target="#sectionIndex" data-offset="0">
                <ListGroup className='list-group' variant="flush" style={sectionTitleStyle}>
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
                        return <Nav.Link active={false} href={'#' + letter} className={ toggleClassName + ' sectionIndexItem' + ' px-4'}  
                                    style={sectionIndexItemStyle} onMouseOver={props.handleMouseOver} onTouchStart={props.handleTouchStart} 
                                        onTouchMove={props.handleTouchMove}>{letter}</Nav.Link>
                    })} 
                </Nav>
            </div>
        </div>
    );

}

export default SearchableObjectType