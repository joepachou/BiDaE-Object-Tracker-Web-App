import React from 'react';
import config from '../../config';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import Cookies from 'js-cookie'

class GridButton extends React.Component {

    constructor() {
        super()
        this.state = {

            /** Retrieve the object type from config */
            objectTypeSet: config.surveillanceMap.objectTypeSet,

            /** Store the remianed pin colors that are usable for next pin color object representation */
            pinColorArray: config.surveillanceMap.iconColor.pinColorArray,

            /** Record the searched object type and the corresponding representation pin color */
            searchObjectTypeColorMap: new Map(),

            selectAll: false,
        }
        this.processObjectTypeSet = this.processObjectTypeSet.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidUpdate(prepProps) {
        // if(this.props.isClear) {
        //     console.log('hi')
        //     this.setState({
                
        //     })
        // }
        // if (!(_.isEqual(prepProps.searchableObjectData, this.props.searchableObjectData))) {
        //     this.processObjectTypeSet();
        // }
    }

    componentDidMount() {
        this.processObjectTypeSet();
    }

    processObjectTypeSet() {
        /** Get the item name of the GridButton from searchableObjectData */
        // const searchableObjectData = this.props.searchableObjectData;
        // const objectTypeSet = new Set();
        // Object.values(searchableObjectData).map(item => {
        //     objectTypeSet.add(item.type)
        // })

        /** Get the item name of the GridButton from the state */
        const objectTypeSet = this.state.objectTypeSet
        objectTypeSet.add('All')
        
        this.setState({
            objectTypeSet
        })
    }

    handleClick(e) {

        const searchKey = e.target.innerText;

        const { searchableObjectData, clearColorPanel } = this.props
        let searchResult = [];
        let pinColor = '';
        let pinColorArray = clearColorPanel ? config.surveillanceMap.iconColor.pinColorArray.slice() : this.state.pinColorArray.slice();
        let searchObjectTypeColorMap = clearColorPanel ? new Map() : this.state.searchObjectTypeColorMap;
        let objectTypeSet = this.state.objectTypeSet;
        let selectAll;
        if (this.props.clearColorPanel) {
            selectAll = true
        } else {
            selectAll = this.state.selectAll ? false : true;
        }
        console.log(selectAll)

        if(searchKey.toLowerCase() === 'all') {

            if (selectAll) {
                let childrenNodesArray = Array.from(e.target.parentElement.children)
                    .filter(item => {
                        return item.textContent !== 'All'
                    })
                
                Array.from(objectTypeSet).map(item => {
                    if (searchObjectTypeColorMap.has(item)) {
                        return;
                    }
                    let color = pinColorArray.pop();
                    searchObjectTypeColorMap.set(item, color);
                    childrenNodesArray.map( node => {
                        if (item === node.textContent) {
                            node.style.background = color
                        }
                    })
                })
                e.target.style.background = 'rgba(143, 143, 143, 0.5)'
                
            } else {
                Array.from(e.target.parentElement.children).map(node=> {
                    node.style.background = ''
                })
                searchObjectTypeColorMap.clear();
                pinColorArray = config.surveillanceMap.iconColor.pinColorArray;

            }
            this.setState({
                selectAll
            })
        } else {
            if (e.target.style.background !== '') {
                pinColorArray.push(e.target.style.background);
                e.target.style.background = ''
                searchObjectTypeColorMap.delete(searchKey);
            } else {
                pinColor = e.target.style.background = pinColorArray.pop();
                searchObjectTypeColorMap.set(searchKey, pinColor)
            }
        }

        this.setState({
            searchObjectTypeColorMap,
            pinColorArray,
        })

        Object.values(searchableObjectData).map(item => {
            if (searchObjectTypeColorMap.has(item.type)) {
                item.pinColor = searchObjectTypeColorMap.get(item.type);
                searchResult.push(item)
            } 
        })

        // if (Cookies.get('user')){
        //     this.putSearchHistory(searchKey)
        // }
        this.props.transferSearchResult(searchResult, searchObjectTypeColorMap)
        
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
                        return <div className='gridbutton' onClick={this.handleClick} key={index}>{item}</div>
                    })
                    : null
                }
            </div>
        )
    }
}

export default GridButton;