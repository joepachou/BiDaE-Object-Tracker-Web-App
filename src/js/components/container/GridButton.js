import React from 'react';
import config from '../../config';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import Cookies from 'js-cookie'

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

        const { searchableObjectData, clearColorPanel } = this.props
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

        if (Cookies.get('user')){
            this.putSearchHistory(searchKey)
        }
        this.props.transferSearchResult(searchResult, searchObjectType)
        
    }

    putSearchHistory(searchKey) {
        const searchHistory = JSON.parse(Cookies.get('searchHistory'))
        let flag = false; 
        const toPutSearchHistory = searchHistory.map( item => {
            if (item.name === searchKey) {
                item.value = item.value + 1;
                flag = true;
            }
            return item
        })
        flag === false ? toPutSearchHistory.push({name: searchKey, value: 1}) : null;
        this.sortSearchHistory(toPutSearchHistory)
        Cookies.set('searchHistory', JSON.stringify(toPutSearchHistory))
        this.checkInSearchHistory()
        
    }

    checkInSearchHistory() {
        const searchHistory = JSON.stringify(Cookies.get('searchHistory'))
        axios.post(dataSrc.addUserSearchHistory, {
            username: Cookies.get('user'),
            history: searchHistory
        }).then( res => {
            console.log('done')
        }).catch( error => {
            console.log(error)
        })
    }

    sortSearchHistory(history) {
        history.sort( (a,b) => {
            return b.value - a.value
        })
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