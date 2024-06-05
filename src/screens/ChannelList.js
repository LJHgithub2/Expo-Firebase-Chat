import React, { useState, useEffect } from 'react';
//react-native에서 제공하는 컴포넌트로서 가변적으로 컨탠츠가 늘어나는 상황에서 쓰기좋다.화면의 크기를 벗어날때 스크롤을 생성해주는것인데 모든 데이터를 한번에 랜더링하는게아니라 사용자가 밑으로 내릴때마다 하나씩 랜더링할 데이터를 늘리는것이다
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '../components';
import { MaterialIcons } from '@expo/vector-icons';
import { DB } from '../firebase';
import moment from 'moment';

const getDateOrTime = (ts) => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'day') > 0 ? 'MM/DD' : 'HH:mm'); //moment객체1.diff(moment객체2,'차이나는 기간을 표시할 단위')= 날짜 차이
};

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-color: ${({ theme }) => theme.itemBorder};
    padding: 15px 20px;
`;
const ItemTextContainer = styled.View`
    flex: 1;
    flex-direction: column;
`;
const ItemTitle = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
`;
const ItemDesc = styled.Text`
    font-size: 16px;
    margin-top: 5px;
    color: ${({ theme }) => theme.itemDesc};
`;
const ItemTime = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.itemTime};
`;
const ItemIcon = styled(MaterialIcons).attrs(({ theme }) => ({
    name: 'keyboard-arrow-right',
    size: 24,
    color: theme.itemIcon,
}))``;

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const Item = ({ item: { id, title, description, createdAt }, onPress }) => {
    //item은 속성일뿐 매개변수가아니다 따라서 item.id로 접근할게아니라 id그자체로 접근하면된다

    return (
        <ItemContainer onPress={() => onPress({ id, title })}>
            <ItemTextContainer>
                <ItemTitle>{title}</ItemTitle>
                <ItemDesc>{description}</ItemDesc>
            </ItemTextContainer>
            <ItemTime>{getDateOrTime(createdAt)}</ItemTime>
            <ItemIcon />
        </ItemContainer>
    );
};

const ChannelList = ({ navigation }) => {
    const [channels, setChannels] = useState([]);
    useEffect(() => {
        const unsubscribe = DB.collection('channels')
            .orderBy('createdAt', 'desc') //orderBy('정렬할기준','내림차순or오름차순')
            .onSnapshot((snapshot) => {
                //onSnapshot은 함수가 호출된후부터실시간으로 DB가 변경될때마다 호출된다(이때 매개변수는 데이터모음집이다) onsnapshot을 사용한경우 다른페이지로 이동후 다시 랜더링할때 이전있던 것과 2번랜더링된다
                const list = [];
                snapshot.forEach((doc) => {
                    list.push(doc.data());
                });
                setChannels(list);
            });
        return () => unsubscribe(); //onSnapshot함수는 호출될때부터 신청되어 계속 감지하는 함수이다 따라서 언마운트될때 해재해야 두번 신청하지않을수있다
    }, []);
    return (
        <Container>
            <FlatList
                data={channels}
                renderItem={({ item }) => (
                    <Item
                        item={item}
                        onPress={(params) =>
                            navigation.navigate('Channel', params)
                        }
                    />
                )} //item이라는속성에 데이터에 설정한 배열의 인덱스가 저장된다
                keyExtractor={(item) => item['id'].toString()} //FlatList가 자동으로 key를 설정해준다
                windowSize={5} //flatlist가 핸드폰 크기만큼 랜더링하는걸 1이라고하고 21이면 미리 21만큼 요소들을 대기시켜둔다(이전화면10+현재화면1+다음화면10=2 이런식으로 하기떄문에 첫페이지에는 현재화면과 다음화면만 미리 로드한다1
            />
        </Container>
    );
};

export default ChannelList;
