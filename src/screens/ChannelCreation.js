import React,{useState,useRef,useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {Button,Input,ErrorMessage} from'../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ProgressContext} from'../contexts';
import {createChannel} from '../firebase';
import {Alert} from'react-native';

const Container = styled.View`
    flex:1;
    background-color: ${({theme})=>theme.background};
    justify-content:center;
    align-items:center;
    padding:0 20px;
`;
const ChannelCreation = ({navigation})=>{
    const {spinner}=useContext(ProgressContext);
    const [title,setTitle] =useState('');
    const [desc,setDesc] =useState('');
    const [errorMessage,setErrorMessage] =useState('');
    const [disabled,setDisabled] =useState(true);
    useEffect(()=>{
        setDisabled(!(title&&desc&&!errorMessage));
    },[title,desc,errorMessage]);
    
    const _handleTitleChange= title =>{
        setTitle(title);
        setErrorMessage(title.trim() ?'':'please enter the title');
    }
    const _handleDescChange= desc =>{
        setDesc(desc);
        setErrorMessage(title.trim() ?'':'please enter the title');
    }
    const _handleCreateBtnPress= async() =>{
        try{
            spinner.start();
            const id = await createChannel({title:title.trim(),desc:desc.trim()})
            navigation.replace('Channel',{id,title});
        }catch(e){
            Alert.alert('creation Error',e.message);
            
        }finally{
            spinner.stop();
        }
    }
    const refDesc=useRef(null);
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{flex:1}}
            extraScrollHeight={20}
        >
            <Container>
                <Input 
                    label="Title" 
                    value={title} 
                    onChangeText={_handleTitleChange} 
                    onSubmitEditing={()=>refDesc.current.focus()}
                    onBlur={()=>refDesc.current.focus()}
                    placeholder="Title"
                    returnKeyType="next"
                    maxLength={20}
                />
                <Input 
                    ref={refDesc} 
                    label="Description" 
                    value={desc}
                    onChangeText={_handleDescChange} 
                    onSubmitEditing={_handleCreateBtnPress} 
                    onBlur={()=>setDesc(desc.trim())}
                    placeholder="Description"
                    returnKeyType="done"
                    maxLength={40}
                />
                <ErrorMessage message ={errorMessage}/>
                <Button 
                    title="Create" 
                    disabled={disabled}
                    onPress={_handleCreateBtnPress}//replace는 reset과 달리 히스토리는 냅두고 바로이전 페이지자리에 변경할페이지를 히스토리로 교체시키는것이다
                />
            </Container>
        </KeyboardAwareScrollView>
    )
}

export default ChannelCreation;