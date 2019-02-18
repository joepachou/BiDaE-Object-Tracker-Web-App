import React from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';


// API url
const API = 'https://jsonplaceholder.typicode.com/users';

export default class Content extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data : [],
        };
    }

    componentDidMount(){
        axios.get(API)
        .then(res => {
            console.log('Get data successfully')
            console.log(res.data)
            this.setState({
                data : res.data,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    render(){
        const data = this.state.data;
        return (
            <Container>            
                <div style={{marginTop: 50}}>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>username</th> 
                                    <th>email</th>
                                </tr>
                                {this.state.data.map(items => {
                                    return (
                                        <tr key={items.id}>
                                            <td>{items.id}</td>
                                            <td>{items.name}</td>
                                            <td>{items.username}</td>
                                            <td>{items.email}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>
        );
    }
}