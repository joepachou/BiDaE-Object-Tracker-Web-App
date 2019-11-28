import React from 'react'
import { useState, useEffect} from 'react'
import MainContainer from './components/container/MainContainer'
import MainContainerForTablet from './components/container/MainContainerForTablet'

const useRWD=()=>{
    const [device,setDevice] = useState("PC");

    const handleRWD=()=>{
        if( window.innerWidth > 1500){
            setDevice("PC");
        }else if( window.innerWidth > 800){
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
            console.log(window.innerWidth)
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