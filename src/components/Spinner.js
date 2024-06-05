import React from 'react';
import styled from 'styled-components/native';
//spinner컴포넌트는 전체화면위에 불투명한 꽉찬 컨테이너를 만들어 클릭을 불가하게하고 스타일을 ActivityIndicator컴포넌트로 설정하면 빙글빙글돌아가는 로딩창을 설정해준다
const Container = styled.View`
    position:absolute;
    z-index:2;
    opacity:0.3;
    width:100%;
    height:100%;
    justify-content:center;
    background-color:${({theme})=> theme.spinnerBackground};
`
const Indicator = styled.ActivityIndicator.attrs(({theme})=>({//ActivityIndicator로딩바를 표현하는 컴포넌트
    size:'large',
    color:theme.spinnerIndicator,
}))``;

const Spinner=()=>{
    return(
        <Container>
            <Indicator/>
        </Container>
    );
};

export default Spinner;