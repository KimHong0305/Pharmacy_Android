import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AccountScreen,
  ForgotPasswordScreen,
  HomeScreen,
  IntroduceScreen,
  VerifyEmailSignup,
  LoginScreen,
  ProfileScreen,
  SignUpScreen,
  ResetPasswordScreen,
} from '../screens';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="VerifyEmailSignup" component={VerifyEmailSignup} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default Navigation