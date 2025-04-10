import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../lib/redux/rootReducer';
import {
  AccountScreen,
  AccScreen,
  AddressScreen,
  ForgotPasswordScreen,
  HistoryOrderScreen,
  HomeScreen,
  ListAddressScreen,
  LoginScreen,
  OnboardingScreen,
  OrderHomeScreen,
  OtpScreen,
  ProductDetailScreen,
  ProfileScreen,
  ResetPasswordScreen,
  SearchListScreen,
  SearchScreen,
  SignUpScreen,
  UpdateEmailScreen,
  VerifyEmailScreen,
  VerifyEmailSignup,
  ListCouponScreen,
  ChooseCouponScreen,
  NotificationScreen,
} from '../screens';
import OrderCartScreen from '../screens/Order/OrderCartScreen';
import BottomTabNavigation from './BottomTabNavigation';

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  const {token} = useSelector((state: RootState) => state.auth);

  return (
    <Stack.Navigator
      initialRouteName={token ? 'BottomTab' : 'OnboardingScreen'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="HomeScreen" children={() => <HomeScreen />} />
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
      <Stack.Screen name="VerifyEmailSignup" component={VerifyEmailSignup} />
      <Stack.Screen name="UpdateEmailScreen" component={UpdateEmailScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen name="OrderCartScreen" component={OrderCartScreen} />
      <Stack.Screen name="OrderHomeScreen" component={OrderHomeScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="ListAddressScreen" component={ListAddressScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchList" component={SearchListScreen} />
      <Stack.Screen name="AccScreen" component={AccScreen} />
      <Stack.Screen name="HistoryOrderScreen" component={HistoryOrderScreen} />
      <Stack.Screen name="ListCouponScreen" component={ListCouponScreen} />
      <Stack.Screen name="ChooseCouponScreen" component={ChooseCouponScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}

export default Navigation