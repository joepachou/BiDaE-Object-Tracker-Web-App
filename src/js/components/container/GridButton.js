import React from 'react';
import config from '../../config';

class GridButton extends React.Component {

    constructor() {
        super()
        this.state = {
            objectTypeSet: config.surveillanceMap.objectTypeSet,
            pinColorArray: config.surveillanceMap.iconColor.pinColorArray.slice(),
            searchObjectType: new Map(),
        }
        this.processObjectType = this.processObjectType.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidUpdate(prepProps) {
        if (prepProps.searchableObjectData === null && this.props.searchableObjectData !== null) {
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
        const { searchableObjectData, transferSearchResult, clearColorPanel } = this.props
        let searchResult = [];
        var pinColor = '';
        let pinColorArray = clearColorPanel ? config.surveillanceMap.iconColor.pinColorArray.slice():this.state.pinColorArray;
        let searchObjectType = clearColorPanel ? new Map() : this.state.searchObjectType;

        if (e.target.style.background !== '') {
            pinColorArray.push(e.target.style.background);
            e.target.style.background = ''
            searchObjectType.delete(searchKey)
        } else {
            pinColor = e.target.style.background = pinColorArray.pop();
            searchObjectType.set(searchKey, pinColor)
        }

        this.setState({
            searchObjectType: searchObjectType,
            pinColorArray: pinColorArray
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