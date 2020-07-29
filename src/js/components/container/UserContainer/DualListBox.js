import React from 'react';
import ListBox from './ListBox';
import { Col, Row } from 'react-bootstrap';
const Fragment = React.Fragment;
class DualListBox extends React.Component{
    /*
        props: {
            selectedTitle: '',
            unselectedTitle: '',
            allItems: array of Items,
            selectedItemList: array of acn number,
            onSelect: function(item),
            onRemove: function(item)
        }
    */
    state = {
    }
    componentDidMount = () => {
    }
    componentDidUpdate = () => {
    }

    generateSelectedRowsForListBox = () => {
        let {allItems, selectedItemList} = this.props
        allItems = allItems || []
        selectedItemList = selectedItemList || []
        const selectedItem = allItems
                        .filter(item => selectedItemList.includes(item.asset_control_number))

        const HTMLForSelecteItem = selectedItem.map(item => {
            return {
                acn: item.asset_control_number,
                onClick: () => {this.onUnselect(item)},
                label: (
                    <div>
                        {item.name}, {item.asset_control_number}
                    </div>
                )
            }
        })
        return HTMLForSelecteItem
    }
    generateUnselectedRowsForListBox = () => {
        var {allItems, selectedItemList} = this.props
        allItems = allItems || []
        selectedItemList = selectedItemList || []

        const unselectedItem = allItems
                        .filter(item => !selectedItemList.includes(item.asset_control_number))

        const HTMLForUnselecteItem = unselectedItem.map(item => {
            return {
                acn: item.asset_control_number,
                onClick: () => {this.onSelect(item)},
                label: (
                    <div>
                        {item.name}, {item.asset_control_number}
                    </div>
                )
            }
        })
        return HTMLForUnselecteItem
    }
    onSelect = (item) => {
        if(this.props.onSelect){
            this.props.onSelect(item)
        }
    }
    onUnselect = (item) => {
        if(this.props.onUnselect){
            this.props.onUnselect(item)
        }
    }
    

    render() {
        const style = {
            listBox: {
                height: '33vh',
                overflowY: 'scroll'
            }
        }
        
        return (
            <Col>
                <Row className = 'd-flex justify-content-center m-3'>
                    <h5>
                        {this.props.selectedTitle}
                    </h5>
                </Row>
                <Row className = 'd-flex justify-content-center' style={style.listBox}>
                    <ListBox
                        rows = {
                            this.generateSelectedRowsForListBox()
                        }
                    />
                </Row>
                <Row className = 'd-flex justify-content-center m-3'>
                    <h5>
                        {this.props.unselectedTitle}
                    </h5>

                </Row>
                <Row className = 'd-flex justify-content-center' style={style.listBox}>
                    <ListBox
                        rows = {
                            this.generateUnselectedRowsForListBox()
                        }
                    />
                </Row>
                
            </Col> 
        )
    }
}

export default DualListBox
