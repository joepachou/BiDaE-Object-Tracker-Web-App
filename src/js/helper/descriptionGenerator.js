export const getDescription = (item, locale, config) => {
    var foundDeviceDescription = ``;
    switch(item.object_type) {
        case '0':
            foundDeviceDescription += 
                item.found === 1
                    ?   `
                        ${item.type},
                        
                        ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.last_four_acn},
                        
                        ${item.currentPosition 
                            ? locale.abbr == 'en' 
                                ? `${locale.texts.NEAR} ${item.location_description},` 
                                : `${locale.texts.NEAR}${item.location_description},` 
                            : `${locale.texts.NOT_AVAILABLE} `
                        }   
                        ${item.status.toUpperCase() === 'NORMAL' 
                            ? ''  
                            : `${locale.texts[item.status.toUpperCase()]}`
                        }
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

                    `
                    :   `
                        ${item.type},

                        ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.last_four_acn},
                        
                        ${getSubDescription(item, locale)}

                        ${item.status.toUpperCase() === 'NORMAL' 
                            ? ''  
                            : `${locale.texts[item.status.toUpperCase()]}`
                        } 
                    `
            break;
        case '1':
        case '2':

            foundDeviceDescription += `
                ${item.name},
                ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
                ${item.currentPosition 
                    ? locale.abbr == 'en' 
                        ? `, ${locale.texts.NEAR} ${item.location_description}` 
                        : `, ${locale.texts.NEAR}${item.location_description}` 
                    : `, ${locale.texts.NOT_AVAILABLE} `
                },
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