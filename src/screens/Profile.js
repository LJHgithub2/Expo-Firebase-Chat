import React, {useContext, useState} from 'react';
import {UserContext} from '../contexts';
import styled from 'styled-components/native';
import {Button,Image,Input} from '../components';
import {getCurrentUser,updateUserInfo,signout} from '../firebase';
import {Alert} from'react-native';
import {ProgressContext} from '../contexts';
import {ThemeContext} from 'styled-components/native';

const Container = styled.View`
flex:1;
background-color: ${({theme})=>theme.background};
justify-content:center;
align-items:center;
padding:0 20px;
`;
const Profile = ({navigation,route})=>{
    const theme=useContext(ThemeContext);
    const {spinner} =useContext(ProgressContext);
    const {setUser} =useContext(UserContext);
    const user =getCurrentUser();
    
    const [photo, setPhoto] =useState(user.photo);
    
    const _handlePhotoChange = async url =>{
        try{
            spinner.start();
            const photoURL = await updateUserInfo(url);
            setPhoto(photoURL);
            console.log(photoURL)
        }catch(e){
            Alert.alert('Photo Error',e.message);
        }finally{
            spinner.stop();
        }
    }
    
    return(
    <Container> 
        <Image showButton={true} url={photo} onChangePhoto={_handlePhotoChange}/>
        <Input label ="Name" value={user.name} disabled={true}/>
        <Input label ="Email" value={user.email} disabled={true}/>
        <Input label ="photo url" value={photo}/>
        <Button 
            title="sign out" 
            onPress={async()=>{
                    try{
                        spinner.start();
                        await signout();
                    }catch(e){
                    }finally{
                        setUser({});
                        spinner.stop();
                    }
                }} 
            containerStyle={{
                    backgroundColor: theme.btnSignout,
            }} 
        />    
    </Container>
    );
};

export default Profile;