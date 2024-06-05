import React,{useState,forwardRef} from 'react';//forwardRef는 함수의 매개변수로 ref객체를 넘겨줄때 사용한다 사용법은 함수전체를 forwarref()의 매개변수로 넣는것
import styled from 'styled-components/native';
import propTypes from 'prop-types';

const Container = styled.View`
flex-direction:column;
width:100%;
margin:10px 0%;
`
const Label = styled.Text`
font-size:14px;
font-weight: 600;
margin-bottom: 6px;
color:${({theme,isFocused})=>isFocused?theme.text:theme.inputLabel};
`;

const StyledInput = styled.TextInput.attrs(({theme})=>({
    placeholderTextColor:theme.inputPlaceholder,
}))`
background-color:${({theme,editable})=>
    editable?theme.inputBackground:theme.inputDisabled};
color:${({theme})=>theme.text};
padding:20px 10px;
font-size:16px;
border:1px solid ${({theme,isFocused})=>isFocused?theme.text:theme.inputBorder};
border-radius:4px;
`;
const Input=forwardRef(
    (
        {
            label,
            value,
            onChangeText,
            onSubmitEditing,
            onBlur,
            placeholder,
            returnKeyType,
            maxLength,
            isPassword,
            disabled,
        }
        ,ref
    )=>{
    const [isFocused,setIsFocused]=useState(false);
    return (
        <Container>
            <Label isFocused={isFocused}>{label}</Label>
        <StyledInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onBlur={()=>{
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          autoCapitalize="none"//대문자
          autoCorrect={false}//자동고침
          textContentType="none"//email이 나타나는 현상을 막아준다
          isFocused={isFocused}//styled-components에 전달할매개변수
          onFocus={()=>setIsFocused(true)}
          secureTextEntry={isPassword}//비번 ****이런식으로 표현하기
          editable={!disabled}//수정가능한 여부를 정하는 속성 
        />
        </Container>
    )
}
);
Input.defaultProps = {
    onBlur:()=>{},
};

Input.propTypes = {
    label:propTypes.string,
    value:propTypes.string.isRequired,
    onChangeText:propTypes.func,
    onSubmitEditing:propTypes.func,
    onBlur:propTypes.func,
    placeholder:propTypes.string,
    returnKeyType:propTypes.oneOf(['done','next']),
    maxLength:propTypes.number,
    isPassword:propTypes.bool,
    disabled:propTypes.bool,

}

export default Input;