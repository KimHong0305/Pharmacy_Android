import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AccountScreen,
  ForgotPasswordScreen,
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  SignUpScreen,
  OnboardingScreen,
  ResetPasswordScreen,
  OtpScreen,
  VerifyEmailSignup,
  UpdateEmailScreen,
  VerifyEmailScreen,
  ProductDetailScreen,
  OrderScreen,
  SearchScreen,
  SearchListScreen,
} from '../screens';
import BottomTabNavigation from './BottomTabNavigation';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
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

  return (
    <Stack.Navigator
      initialRouteName={hasToken ? 'BottomTab' : 'OnboardingScreen'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen
        name="HomeScreen"
        children={() => <HomeScreen hasToken={hasToken} />}
      />
      <Stack.Screen
        name="AccountScreen"
        children={() => <AccountScreen hasToken={hasToken} />}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="BottomTab" component={BottomTabNavigation} />
      <Stack.Screen name="VerifyEmailSignup" component={VerifyEmailSignup} />
      <Stack.Screen name="UpdateEmailScreen" component={UpdateEmailScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchList" component={SearchListScreen} />
    </Stack.Navigator>
  );
}

export default Navigation