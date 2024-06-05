import React, {useContext,useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ChannelList,Profile} from'../screens';
import {MaterialIcons} from '@expo/vector-icons';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';//포커스된 네비게이션 이름을 알아내는 라이브러리

const TabIcon = ({name,focused})=>{
    const theme=useContext(ThemeContext);
    return(
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabBtnActive : theme.tabBtnInactive}
            />
    );
};

const Tab = createBottomTabNavigator();

const Home= ({navigation,route})=>{
    useEffect(()=>{
        const screenName=getFocusedRouteNameFromRoute(route)||'List'//처음 시작일땐 undefined이기떄문에 처음시작페이지 List로 스크린네임을 지정한다
        navigation.setOptions({
            headerTitle:screenName,
            headerRight: ()=> screenName==='List' &&(
            <MaterialIcons name="add" size={26} style={{margin:10}} 
             onPress={()=>navigation.navigate('ChannelCreation')}/>
             )
        });
    })
    return(
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            >
            <Tab.Screen 
                name="List" 
                component={ChannelList} 
                options={{
                    tabBarIcon:({focused})=>
                    TabIcon({
                        name:focused ? 'chat-bubble' : 'chat-bubble-outline',
                        focused,
                    }),
                }}    
            />
            <Tab.Screen 
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon:({focused})=>
                    TabIcon({
                        name:focused ? 'person' : 'person-outline',
                        focused,
                    }),
                }}   
            />
        </Tab.Navigator>
    );
};
export default Home;