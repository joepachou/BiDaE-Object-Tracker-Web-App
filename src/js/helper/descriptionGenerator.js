import config from '../config'
import AccessControl from '../components/presentational/AccessControl'
import React from 'react'

export const getDescription = (item, locale) => {
    var foundDeviceDescription = ``; 
    switch(item.object_type) {
        case '0':
            foundDeviceDescription += 
                item.found === 1
                    ?   `
                        
                        ${getType(item, locale)}

                        ${getACN(item, locale)}
                        
                        ${getPosition(item, locale)}

                        ${getStatus(item, locale)}

                        ${item.currentPosition  
                            ? item.status.toUpperCase() === 'NORMAL'
                                ? `${item.residence_time} `
                                : ''
                            : ''
                        }  

                        ${item.status == "reserve" 
                            ? `~ ${item.reserved_timestamp_final}`
                            : ''
                        } 

                        ${item.status == "reserve" 
                            ? ` ${locale.texts.IS_RESERVED_FOR}`
                            : ''
                        } 

                        ${item.status == "reserve" 
                            ? `${item.reserved_user_name}`
                            : ''
                        } 
                    `
                    :   `
                        ${getType(item, locale)}

                        ${getACN(item, locale)}
                        
                        ${getSubDescription(item, locale)}
                        
                        ${getStatus(item, locale)}

                    `
            break;
        case '1':
        case '2':

            foundDeviceDescription += `
                ${getName(item, locale)}
                ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
                ${getPosition(item, locale)}
                ${item.residence_time} 

            `    
        break;
    } 
    return foundDeviceDescription
}

export const getSubDescription = (item, locale) => {
    let toReturn = 
        locale.abbr == 'en'
            ?   `
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
                        : ''
                    : `${locale.texts.NOT_AVAILABLE}`
                } 
            `
            :   `                 
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
                        : ''
                    : `${locale.texts.NOT_AVAILABLE}`
                } 
            `
    return toReturn
}

export const getBatteryVolumn = (item, locale, config) => {
    let toReturn = 
        locale.abbr == 'en'
            ?   `
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `, ${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
                        : ''
                    : `, ${locale.texts.NOT_AVAILABLE}`
                } 
            `
            :   `                 
                ${item.currentPosition  
                    ? item.status.toUpperCase() === 'NORMAL'
                        ? `, ${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
                        : ''
                    : `, ${locale.texts.NOT_AVAILABLE}`
                } 
            `
    return toReturn
}

export const getName = (item, locale) => {
    return `
        ${item.name},
    `
}

export const getType = (item, locale) => {
    return `
        ${item.type},
    `
}

export const getACN = (item, locale) => {
    return `
        ${locale.texts.ASSET_CONTROL_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPatientID = (item, locale) => {
    return `
        ${locale.texts.PATIENT_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPhysicianName = (item, locale) => {
    return `
        ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
    `
}

export const getStatus = (item, locale) => {
    return `
        ${item.status.toUpperCase() === 'NORMAL' 
            ? ''  
            : `${locale.texts[item.status.toUpperCase()]}`
        }
    `
}

export const getPosition = (item, locale) => {
    return `
        ${item.currentPosition 
            ? locale.abbr == 'en' 
                ? `${locale.texts.NEAR} ${item.location_description},` 
                : `${locale.texts.NEAR}${item.location_description},` 
            : `${locale.texts.NOT_AVAILABLE} `
        }   
    `
}

export const getMacaddress = (item, locale) => {
    return `
        ${locale.texts.MAC_ADDRESS}:
        ${item.mac_address}
    `
}

export const getRSSI = (item, locale) => {
    return `
        ${locale.texts.RSSI}:
        ${item.rssi}
    `
}