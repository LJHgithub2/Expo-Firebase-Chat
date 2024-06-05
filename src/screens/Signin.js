import React,{useContext,useState,useRef, useEffect} from 'react';
import { ThemeContext } from 'styled-components/native';
import styled from 'styled-components/native';
import {Button,Image,Input,ErrorMessage} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../firebase';
import {Alert} from'react-native';//사진 권한 받기위해 필요한 시스템라이브러리
import {validateEmail,removeWhitespace} from '../utils';// 이메일 공백 ,이메일 포멧 확인하는것
import {UserContext, ProgressContext} from '../contexts';


const Container = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: ${({theme})=>theme.background};
padding:0 20px;
padding-top:${({insets:{top} })=>top}px;
padding-bottom:${({insets:{bottom} })=>bottom}px;
`;
const StyledText = styled.Text`
font-size: 30px;
color:#111111;
`;

const logo="https://firebasestorage.googleapis.com/v0/b/chatting-app-74a36.appspot.com/o/logo.png?alt=media&token=882af2d8-cd14-4174-a5da-a5b0dd1e00ea"

const Signin = ({navigation}) =>{
    const theme =useContext(ThemeContext);
    const insets=useSafeAreaInsets();
    const {setUser}=useContext(UserContext);
    const {spinner} = useContext(ProgressContext);

    const [disabled,setDisabled] = useState(true);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
   // const [disabled,setDisabled] = useState(true);
    const refPassword = useRef(null);
    
    useEffect(()=>{
        setDisabled(!(email && password && !errorMessage))
    },[email,password,errorMessage]);

    const _handleSigninBtnPress= async ()=>{
        try{
            spinner.start();
            const user = await signin({email,password});
            setUser(user);
        } catch(e){
            Alert.alert('Signin Error',e.message);
        } finally{
            spinner.stop();
        }
    };//signin페이지에서 signup버트는눌렀을때 실행하는 함수

    const _handleEmailChange = email =>{
        setEmail(removeWhitespace(email));
        setErrorMessage(validateEmail(email) ? '':'Please verify your email');
    };
    const _handlePasswordChange = password =>{
        setPassword(removeWhitespace(password));
    };
    return(
    <KeyboardAwareScrollView 
        extraScrollHeight={20}// 키보드와 인풋창의 거리
        contentContainerStyle={{flex:1}}// keyboardawarescrollview는 화면전체를 차지하는게아니라 딱 요소만큼의 크기만 차지하여 가운데 정렬해봤자 별수없다
        >
        <Container insets={insets}>
            <Image url={logo}/>
            <Input 
                label="Email"
                placeholder="Email"
                returnKeyType="next"
                value={email}
                onChangeText={_handleEmailChange}
                onSubmitEditing={()=>{
                    refPassword.current.focus();
                }}
            />
            <Input 
                ref={refPassword}
                label="Password"
                placeholder="Password"
                returnKeyType="done"
                value={password}
                onChangeText={_handlePasswordChange}
                isPassword={true}
                onSubmitEditing={_handleSigninBtnPress}
            />
            <ErrorMessage message={errorMessage} />
            <Button title="sign in" onPress={_handleSigninBtnPress} disabled={disabled}
                />
            <Button 
                title="sign up" 
                onPress={()=>navigation.navigate('Signup')}
                containerStyle={{marginTop:0,backgroundColor:'transparent'//transparent는 투명이다
                }}
                textStyle={{color:theme.btnTextLink}}
            />
        </Container>
    </KeyboardAwareScrollView>
    );
};
export default Signin;