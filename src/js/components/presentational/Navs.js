import React from 'react';
import Nav from 'react-bootstrap/Nav';


const Navs = (props) => {
    return (
        <div>
            <Nav variant="pills" defaultActiveKey="/home" as="ul">
                {Object.keys(props.navsItem).map( (item, index) => {
                    return(
                        <Nav.Item as="li">
                            <Nav.Link key={index} eventKey={index}>{item}</Nav.Link>
                        </Nav.Item>
                    )
                })}
            </Nav>
        </div>
    )
}

export default Navs;