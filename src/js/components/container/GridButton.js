import React from 'react';
import config from '../../config';

class GridButton extends React.Component {

    constructor() {
        super()
        this.state = {
            objectTypeSet: new Set(),
            pinColorSet: config.surveillanceMap.iconColor.pinColorSet,
            searchObjectType: new Map(),
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
        let searchObjectType = this.state.searchObjectType;
        
        if (e.target.style.background !== '') {
            pinColorSet.push(e.target.style.background);
            e.target.style.background = ''
            searchObjectType.set(searchKey, 'black')
        } else {
            pinColor = e.target.style.background = pinColorSet.pop();
            searchObjectType.set(searchKey, pinColor)
        }

        this.setState({
            searchObjectType: searchObjectType
        })
        
        Object.values(searchableObjectData).map(item => {
            if (searchObjectType.has(item.type) && searchObjectType.values(item.type) !== 'black') {
                item.pinColor = searchObjectType.get(item.type);
                searchResult.push(item)
            } 
        })
        transferSearchResult(searchResult, searchObjectType)
        
    }


    render(){

        const { objectTypeSet } = this.state;
        return (
            <div className="gridbutton_wrapper">
                {objectTypeSet.size !== 0 
                    ? Array.from(objectTypeSet).map( (item,index) => {
                        return <div className='gridbutton'onClick={this.handleClick} key={index}>{item}</div>
                    })
                    : null
                }
            </div>
        )
    }
}

export default GridButton;