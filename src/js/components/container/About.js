import React from 'react'
import {
    Container
} from 'react-bootstrap'
import config from '../../config'

class About extends React.Component {


    render = () => {
        return (
            <Container fluid className="mt-5">
                Buildv1.0 {config.version}
            </Container>
        )
    }
}

export default About