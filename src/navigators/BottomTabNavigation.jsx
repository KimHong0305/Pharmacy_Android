import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AccountScreen, CategoryScreen, ConsultantScreen, HomeScreen, OrderScreen } from '../screens';

const BottomTabNavigation = () => {
  const BottomTab = createBottomTabNavigator();
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
            case 'Đơn hàng':
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
      <BottomTab.Screen name="Tư vấn" component={ConsultantScreen} />
      <BottomTab.Screen name="Đơn hàng" component={OrderScreen} />
      <BottomTab.Screen name="Tài khoản" component={AccountScreen} />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigation