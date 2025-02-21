import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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
} from '../screens';
import BottomTabNavigation from './BottomTabNavigation';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
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
    </Stack.Navigator>
  );
}

export default Navigation