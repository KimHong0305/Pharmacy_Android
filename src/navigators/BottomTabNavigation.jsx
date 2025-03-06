import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AccountScreen, CategoryScreen, ConsultantScreen, HomeScreen, CartScreen } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTabNavigation = () => {
  const BottomTab = createBottomTabNavigator();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setHasToken(!!token);
      } catch (error) {
        console.error('Lỗi khi lấy token:', error);
      }
    };

    checkToken();
  }, []);

  const openZalo = () => {
    Linking.openURL('https://zalo.me/0363437324');
  };

  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          color = focused ? '#007AFF' : '#8E8E93';
          size = 24;

          switch (route.name) {
            case 'Trang chủ':
              iconName = 'home';
              break;
            case 'Danh mục':
              iconName = 'list';
              break;
            case 'Tư vấn':
              iconName = 'comments';
              break;
            case 'Giỏ hàng':
              iconName = 'shopping-cart';
              break;
            case 'Tài khoản':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <BottomTab.Screen name="Trang chủ" component={HomeScreen} />
      <BottomTab.Screen name="Danh mục" component={CategoryScreen} />
      <BottomTab.Screen name="Tư vấn" component={ConsultantScreen} 
                  listeners={{
                    tabPress: (e) => {
                      e.preventDefault();
                      openZalo();
                    }
        }}/>
      <BottomTab.Screen name="Giỏ hàng" component={CartScreen} />
      <BottomTab.Screen
        name="Tài khoản"
        children={() => <AccountScreen hasToken={hasToken} />}
      />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigation