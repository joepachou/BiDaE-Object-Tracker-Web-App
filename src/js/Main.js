import React from 'react'
import { useState, useEffect} from 'react'
import MainContainer from './components/container/MainContainer'
import MainContainerForTablet from './components/container/MainContainerForTablet'
import { isBrowswer, isTablet} from 'react-device-detect'

const useRWD=()=>{
    const [device,setDevice] = useState("PC");

    const handleRWD=()=>{
        if( isBrowswer){
            setDevice("PC");
        }else if( isTablet){
            setDevice("TABLET");
        }else{
            setDevice("MOBILE");
        }
    }

    useEffect(()=>{
        window.addEventListener('resize',handleRWD);
        handleRWD();
        return(()=>{
            window.removeEventListener('resize',handleRWD);
        }) 
    },[]);

    return device;
} 

const Main =()=>{

        const device = useRWD();

        if( device === "PC" ){
            return (
                <MainContainer />
            )
        }else if( device === "TABLET"){
            return(
                <MainContainerForTablet />
            )
        }else{
            return(
                <MainContainer />
            )
        }
}

export default Main;