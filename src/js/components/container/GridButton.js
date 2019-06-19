import React from 'react';
import config from '../../config';

class GridButton extends React.Component {

    constructor() {
        super()
        this.state = {
            objectTypeSet: new Set(),
            pinColorSet: config.surveillanceMap.iconColor.pinColorSet
        }
        this.processObjectType = this.processObjectType.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidUpdate(prepProps) {
        if (prepProps.searchableObjectData === null) {
            this.processObjectType();
        }
    }

    processObjectType() {
        const searchableObjectData = this.props.searchableObjectData;
        const objectTypeSet = new Set();
        Object.values(searchableObjectData).map(item => {
            objectTypeSet.add(item.type)
        })
        this.setState({
            objectTypeSet: objectTypeSet,
        })
    }

    handleClick(e) {
        const searchKey = e.target.innerText;
        const { searchableObjectData, transferSearchResult } = this.props
        const pinColorSet = this.state.pinColorSet
        let searchResult = [];
        var pinColor = '';
        
        if (e.target.style.background !== '') {
            pinColorSet.push(e.target.style.background);
            e.target.style.background = ''
            pinColor = 'black'
        } else {
            pinColor = e.target.style.background = pinColorSet.pop();
        }
        Object.values(searchableObjectData).map(item => {
            if (item.type === searchKey) {
                item.pinColor = pinColor;
                searchResult.push(item)
                console.log(item)
            }
        })
        transferSearchResult(searchResult)
        
    }


    render(){

        const { objectTypeSet } = this.state;
        return (
            <div className="gridbutton_wrapper">
                {objectTypeSet.size !== 0 
                    ? Array.from(objectTypeSet).map( (item,index) => {
                        return <div onClick={this.handleClick} key={index}>{item}</div>
                    })
                    : null
                }
            </div>
        )
    }
}

export default GridButton;