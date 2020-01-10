import React from 'react'
import { useState, useEffect} from 'react'
import MainContainer from './components/container/MainContainer'
import MainContainerForTablet from './components/container/MainContainerForTablet'
import { isBrowser, isTablet} from 'react-device-detect'

const Main =()=>{
    return (
        <MainContainer />
    )
}

export default Main;