import axios from 'axios';
import dataSrc from '../../dataSrc';
import 'babel-polyfill'

// e is the event parameter
// searchableObjectList is the found data list
// viaMethod is the components call this function, such as frequent search and searchableObjectType
export default async function GetResultData(SearchKey, searchableObjectList, user){
 
    var searchResult = []
	if(typeof SearchKey === 'string'){
		if(SearchKey === 'my devices'){
			let mydevice = user.myDevice || []
			searchableObjectList
				.filter(item => item.object_type == 0)
				.map(item => {
					if (mydevice.includes(item.asset_control_number)) {
						searchResult.push(item)
					}	
				})
		} else {
			if(SearchKey === 'all devices'){

				for(var i in searchableObjectList){
					searchResult.push(searchableObjectList[i])
				}
			}
			else{
				for(var i in searchableObjectList){

					if (searchableObjectList[i].type.toLowerCase() === SearchKey.toLowerCase()){
						searchResult.push(searchableObjectList[i])
					}
				}
			}
		}
	}else if(typeof SearchKey === 'object'){
		if(SearchKey.dataType === 'location_description'){
			for(var i in searchableObjectList){
				if(searchableObjectList[i][SearchKey.dataType] === SearchKey.searchKey){
					searchResult.push(searchableObjectList[i])
				}
			}
		}
    }
	return await searchResult
}