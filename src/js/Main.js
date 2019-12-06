import React from 'react'
import { useState, useEffect} from 'react'
import MainContainer from './components/container/MainContainer'
import MainContainerForTablet from './components/container/MainContainerForTablet'
import { isBrowser, isTablet} from 'react-device-detect'

const Main =()=>{

        if( isBrowser){
            return (
                <MainContainer />
            )
        }else if( isTablet){
            return(
                <MainContainerForTablet />
            )
        }else{
            return(
                <p>手機版本，努力中</p>
            )
        }
}

export default Main;