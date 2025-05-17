import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CreateOrderScreen } from '../../screens';
import AccountNurseScreen from '../../screens/Nurse/AccountNurseScreen';
import ConsultantScreen from '../../screens/Nurse/ConsultantScreen';


const BottomTabNurseNavigation = () => {
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
            case 'Tạo đơn hàng':
              iconName = 'home';
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
            case 'Tài khoản':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <BottomTab.Screen name="Tạo đơn hàng" component={CreateOrderScreen}/>
      <BottomTab.Screen name="Tư vấn" component={ConsultantScreen}/>
      <BottomTab.Screen name="Tài khoản" component={AccountNurseScreen}/>
    </BottomTab.Navigator>
  );
};

export default BottomTabNurseNavigation;
