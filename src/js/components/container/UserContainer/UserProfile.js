import React from 'react';
import { Button, Image} from 'react-bootstrap';
import userProfileImg from '../../../../img/userProfile.png';
import { AppContext } from '../../../context/AppContext';
import ImageUploader from 'react-images-upload';
import config from '../../../config';

class UserProfile extends React.Component{

    static contextType = AppContext

    constructor(props){
        super(props);

        this.upDate = this.upDate.bind(this);
    }

    upDate(picture){
        
    }

    

    render(){
        const {auth} = this.context;
        //console.log(config.mapConfig.areaModules)
        const style = {
            userProfileContainer: {
                height: '250px',
                //border: 'solid'
            },
            userImageAndUpload: {
                height: '250px',
                //border: 'solid',
                width:'220px'
            },
            userImage:{
                height: '220px',
                width: '220px',
                //border: 'solid',
                borderRadius: '99rem',
            },
            uploadButton: {
                color: "black"
            }
        }

        const key = Object.keys(config.mapConfig.areaOptions)
        const value = Object.values(config.mapConfig.areaOptions)
        return(
            <div className='d-flex flex-row'style={style.userProfileContainer}>
                <div className='d-flex flex-column' style={style.userImageAndUpload}>
                    <Image src={userProfileImg} style={style.userImage} />
                    
                </div>
                <div className='d-flex flex-column'>
                    <p>名字 : {auth.user.name}</p>
                    <p>職位 : {auth.user.role}</p>
                    <p>ID編號 ：{auth.user.id}</p>
                    {
                        key.map(function(item, index, array){
                            if(item == auth.user.areas_id){
                                return <p>地區 : {value[index]}</p>
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

export default UserProfile;