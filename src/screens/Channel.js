import React, {useState, useEffect,useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {Input} from '../components';
import {createMessage, getCurrentUser} from'../firebase';
import {GiftedChat,Send,InputToolbar} from 'react-native-gifted-chat';
import {Alert} from 'react-native';
import {DB} from'../firebase';
import {MaterialIcons} from '@expo/vector-icons';

const Container = styled.View`
    flex:1;
    background-color: ${({theme})=>theme.background};
`;
const StyledText = styled.Text`
    font-size:30px;
`;
const SendIcon = styled(MaterialIcons).attrs(({theme,text})=>({
    name:'send',
    size:24,
    color:text?theme.sendBtnActive:theme.sendBtnInactive,
}))``;

const SendButton=props =>{
    return(
        <Send
            {...props}
            containerStyle={{
                width:44,
                height:44,
                alignItems:'center',
                justifyContent:'center',
                marginHorizontal:4,
            }}
            disabled={!props.text}
        >
            <SendIcon text={props.text} />
        </Send>
    )
}

const Channel= ({route,navigation})=>{
    const [messages, setMessages]= useState([]);
    const {uid,name,photo} = getCurrentUser();
    
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle:route.params.title ||'Channel',
        });
    },[])//레이아웃이 마운트될때 실행
    
    useEffect(()=>{
        const unsubscribe=DB.collection('channels')
        .doc(route.params.id)
        .collection('messages')
        .orderBy('createdAt','desc')
        .onSnapshot(snapshot =>{
            const list = [];
            snapshot.forEach(doc=>{
                list.push(doc.data());
            });
            setMessages(list);
        });
        return ()=>unsubscribe();
    },[]);
    const _handleMessageSend = async messageList =>{
        console.log(messageList[0]);
        const message = messageList[0];
        try{
            await createMessage({channelId:route.params.id, message})
        }catch(e){
            Alert.alert('MessageError'.e.message);
        }
    }
    return (
        <Container>
            <GiftedChat
                placeholder="Enter a message ..."
                messages={messages}
                user={{_id:uid,name,avatar:photo}}
                onSend={_handleMessageSend}
                scrollToBottom={true}//일정높이로 올라가면 맨아래로 갈수있는 기능
                renderSend={props => <SendButton {...props} />}
                renderUsernameOnMessage={true}//항상 보낸사람 이름 나타내기
                alwaysShowSend={true}// 항상 send버튼 표시하기(원래는 택스트있을때만 활성화됌)
                multiline={false}//택스트인풋 에서 여러줄 보내는거 설정하는것
                showUserAvatar={true}//보내는사람 아바타 표시할지 선택하는것
                showAvatarForEveryMessage={true}//연속된 메세지중에도 각각의 아바타 다 표시
                renderInputToolbar = {(props) => {
                  return (
                    <InputToolbar {...props}
                      textInputProps={{
                        onSubmitEditing: () => {
                          if (props.text && props.onSend) {
                            let text = props.text;
                            props.onSend({ text: text.trim() })
                          }
                        }
                      }}
                    />
                  )
                }}
                />
        </Container>
    )
}

export default Channel;