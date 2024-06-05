import React,{useEffect} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';//expo에서 제공하는 사진관리프로그램
import {Alert, Platform} from'react-native';//사진 권한 받기위해 필요한 시스템라이브러리


const ButtonContainer = styled.TouchableOpacity`
background-color:${({theme})=>theme.text};
position:absolute;
bottom:0;
right:0;
width:30px;
height:30px;
border-radius:15px;
justify-content:center;
align-items:center;
`
const ButtonIcon = styled(MaterialIcons).attrs(({theme})=>({//styled(컴포넌트)는 컴포넌트의 스타일을 정의하는것이다
    name:'photo-camera',
    size:22,
    color:theme.imgBtnIcon,
}))``;
const PhotoButton=({onPress})=>{
    return(
    <ButtonContainer onPress={onPress}>
        <ButtonIcon />
    </ButtonContainer>
    )
}
const Container = styled.View`
margin-bottom:30px;
`;
const ProfileImage=styled.Image`
background-color:${({theme})=>theme.imgBackground};
width:100px;
height:100px;
border-radius:50px;
`;

const Image = ({url, showButton, onChangePhoto})=>{
    useEffect(()=>{//권한받는 함수
        (async ()=>{
            if(Platform.OS !== 'web'){
                const {
                    status,
                }= await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted'){
                    Alert.alert(
                    'Photo Permission',//제목
                    'Plese turn on the camera permission.'//내용
                    );
                }
            }
        })();
    },[]);
    const _handlePhotoBtnPress=async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,//가져올파일의 유형{all,Image등등}
          allowsEditing: true,//수정가능한지 설정
          aspect: [1, 1],//수정시 사진을 자르는 비율 정사각형이니 [1,1]이다 (ios는 무조건 정사각형)
          quality: 1,//압축 품질결정1이 최대값 0이최소값
        });
        if(!result.cancelled){
            onChangePhoto(result.uri);
        }
    };
    return(
        <Container>
            <ProfileImage source={{uri:url}}/>
            {showButton && <PhotoButton onPress={_handlePhotoBtnPress} />}
        </Container>
    )
};


Image.propTypes={
    url:PropTypes.string,
    showButton:PropTypes.bool,
    
};
export default Image;