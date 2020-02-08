import React from 'react'
import { ListGroup } from 'react-bootstrap'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import { getDescription } from '../../helper/descriptionGenerator'


const SearchResultListGroup = ({
        data,
        handleSelectResultItem,
        selection,
        disabled,
        action
}) => {

    const { locale } = React.useContext(AppContext);
   
    const style = {
        icon: {
            color: '#007bff'
        },
        item: {
            width: 30,
        },
        listGroup: {
            color: 'rgb(33, 37, 41)'
        }
    }

    return (
        <ListGroup 
            onSelect={handleSelectResultItem} 
        >
            {data.map((item,index) => {
                let element = 
                    <ListGroup.Item 
                        href={'#' + index} 
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action={action}
                        active
                        style={style.listGroup}
                        className='d-flex justify-content-start text-left py-1' 

                    >   
                        <div style={style.item}>
                            {selection.indexOf(item.mac_address) >= 0 
                                ? <i className="fas fa-check" style={style.icon}></i> 
                                : config.mapConfig.iconOptions.showNumber
                                    ?   <p className='d-inline-block'>{index + 1}.</p>
                                    :   <p className='d-inline-block'>&#9642;</p>
                            }
                        </div>
                        {getDescription(item, locale, config)}
                    </ListGroup.Item>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup