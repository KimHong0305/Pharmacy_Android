import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/redux/rootReducer';
import { AccountScreen, AccScreen, CartScreen, CategoryScreen, ConsultantScreen, HomeScreen } from '../screens';

const BottomTabNavigation = () => {
  const BottomTab = createBottomTabNavigator();

  const cartItemsCount = useSelector(
    (state: RootState) =>
      (state.cart.cart?.result?.cartItemResponses ?? []).length,
  ); 
  
  const {token} = useSelector((state: RootState) => state.auth);

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
              return (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#007AFF',
                    borderRadius: 32,
                    padding: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 5, // Nâng lên so với các icon khác
                  }}>
                  <Icon name="phone" size={24} color="#fff" />
                </View>
              );
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
      <BottomTab.Screen
        name="Trang chủ"
        children={() => <HomeScreen/>}
      />
      <BottomTab.Screen name="Danh mục" component={CategoryScreen} />
      <BottomTab.Screen
        name="Tư vấn"
        component={ConsultantScreen} 
        listeners={{
          tabPress: e => {
            e.preventDefault();
            openZalo();
          },
        }}
      />
      <BottomTab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined, // Hiển thị số lượng sản phẩm
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: 12,
          },
        }}
      /> 
      <BottomTab.Screen
        name="Tài khoản"
        children={() => token ? <AccScreen/> : <AccountScreen/>}
      />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigation