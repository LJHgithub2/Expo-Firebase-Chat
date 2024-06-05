import React,{useState,useRef,useEffect,useContext} from 'react';
import styled from 'styled-components/native';
import {Button,Image,Input,ErrorMessage} from '../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';//만약 입력중 키보드때문에 인풋창이 안보일때 자동으로 스크롤 되고 포커싱되는 라이브러리
import {signup} from '../firebase';
import {Alert} from'react-native';
import {validateEmail,removeWhitespace} from '../utils';// 이메일 공백 ,이메일 포멧 확인하는것
import {UserContext,ProgressContext} from '../contexts';

const Container = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: ${({theme})=>theme.background};
padding:50px 20px;
`;
const StyledText = styled.Text`
font-size: 30px;
color:#111111;
`;
const DEFAULT_PHOTO ='https://firebasestorage.googleapis.com/v0/b/chatting-app-74a36.appspot.com/o/face.png?alt=media'; 

const Signup = ({navigation}) =>{
    const {setUser} =useContext(UserContext);
    const {spinner} =useContext(ProgressContext);
    const [photo, setPhoto] = useState(DEFAULT_PHOTO);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [passwordConfirm,setPasswordConfirm] = useState('');
    const [errorMessage,setErrorMessage]=useState('')
    const [disabled,setDisabled] = useState(true);
    
    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const refPasswordConfirm = useRef(null);
    const refDidMount = useRef(null);//처음랜더링후 에러메세지가 뜨지않도록하기위한 제어 변수 (일반변수로 안하는이유는 useEffect안에 일반변수를 변환하여도 바뀌지 않기에 유즈 스테이트나 ref를 사용해야한다)
    
    
    useEffect(()=>{
        setDisabled(!(name&&email&&password&&passwordConfirm&&!errorMessage));
    },[name,email,password,passwordConfirm,errorMessage])
    
    useEffect(()=>{
        if(refDidMount.current){
            let error = '';
            if (!name){
                error='Please enter your name';
            } else if(!email){
                error='Please enter your email';
            }else if(!validateEmail(email)){
                error='Please verify your email';
            }else if(password.length<6){
                error='the password must contain 6characters at least';
            }else if(password !== passwordConfirm){
                error='Please need to match';
            }else{
                error='';
            }
            setErrorMessage(error);
        }else{
            refDidMount.current=true;
        }
    },[name,email,password,passwordConfirm,errorMessage])

    const _handleSignupBtnPress= async()=>{//signup페이지에서 signup버튼는눌렀을때 실행하는 함수
        try{
            spinner.start();
            const user =await signup({name,email,password,photo});
            setUser(user);
        }catch(e){
            Alert.alert('Signup Error',e.message);
        } finally{
            spinner.stop();
        }
    };


    return(
    <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
            <Image showButton={true} url={photo} onChangePhoto={setPhoto}/>
            <Input 
                label="Name"
                placeholder="Name"
                returnKeyType="next"
                value={name}
                onChangeText={setName}
                onSubmitEditing={()=>{
                    refEmail.current.focus();
                }}
                onBlur={()=>setName(name.trim())}
                maxLength={12}
            />
            <Input 
                ref={refEmail}
                label="Email"
                placeholder="Email"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={()=>{
                    refPassword.current.focus();
                }}
                onBlur={()=>setEmail(removeWhitespace(email))}
            />
            <Input 
                ref={refPassword}
                label="password"
                placeholder="password"
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
                onSubmitEditing={()=>{
                    refPasswordConfirm.current.focus();
                }}
                onBlur={()=>setPassword(removeWhitespace(password))}
            />
             <Input 
                ref={refPasswordConfirm}
                label="Password Confirm"
                placeholder="Password"
                returnKeyType="done"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                isPassword={true}
                onSubmitEditing={_handleSignupBtnPress}
                onBlur={()=>setPasswordConfirm(removeWhitespace(passwordConfirm))}
            />
            <ErrorMessage message={errorMessage}/>
            <Button title="sign up" onPress={_handleSignupBtnPress} disabled={disabled}/>

        </Container>
    </KeyboardAwareScrollView>
    );
};
export default Signup;