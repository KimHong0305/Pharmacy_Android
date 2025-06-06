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
  ChooseAddressScreen,
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
  CouponCartScreen,
  CartScreen,
  UpdatePasswordScreen,
  WhistlistScreen,
  StatisticScreen,
  AddressUserScreen,
  AddAddressScreen,
  EditAddressScreen,
  PaymentScreen,
  OrderLookupScreen,
  ProductCategoryScreen,
  ChooseProductScreen,
} from '../screens';
import OrderCartScreen from '../screens/Order/OrderCartScreen';
import BottomTabNavigation from './BottomTabNavigation';
import CustomPaymentResultScreen from '../screens/Payment/CustomPaymentResultScreen';
import BottomTabNurseNavigation from './Nurse/BottomTabNurseNavigation';
import ChatHistoryScreen from '../screens/Nurse/ChatHistoryScreen';
import ConsultantScreen from '../screens/Nurse/ConsultantScreen';

const Navigation = ({ role }: { role?: string }) => {
  const Stack = createNativeStackNavigator();
  const { token } = useSelector((state: RootState) => state.auth);

  const initialRoute = token
    ? role === 'ROLE_NURSE'
      ? 'BottomTabNurse'
      : 'BottomTab'
    : 'OnboardingScreen';

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="BottomTab" component={BottomTabNavigation} />
      <Stack.Screen name="VerifyEmailSignup" component={VerifyEmailSignup} />
      <Stack.Screen name="UpdateEmailScreen" component={UpdateEmailScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="OrderCartScreen" component={OrderCartScreen} />
      <Stack.Screen name="OrderHomeScreen" component={OrderHomeScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="ChooseAddressScreen" component={ChooseAddressScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchList" component={SearchListScreen} />
      <Stack.Screen name="AccScreen" component={AccScreen} />
      <Stack.Screen name="HistoryOrderScreen" component={HistoryOrderScreen} />
      <Stack.Screen name="ListCouponScreen" component={ListCouponScreen} />
      <Stack.Screen name="ChooseCouponScreen" component={ChooseCouponScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="CouponCartScreen" component={CouponCartScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />
      <Stack.Screen name="WhistlistScreen" component={WhistlistScreen} />
      <Stack.Screen name="StatisticScreen" component={StatisticScreen} />
      <Stack.Screen name="AddressUserScreen" component={AddressUserScreen} />
      <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
      <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="CustomPaymentResultScreen" component={CustomPaymentResultScreen} />
      <Stack.Screen name="OrderLookupScreen" component={OrderLookupScreen} />
      <Stack.Screen name="ProductCategoryScreen" component={ProductCategoryScreen} />
      <Stack.Screen name="ChooseProductScreen" component={ChooseProductScreen} />

      {/* Role Nurse */}
      <Stack.Screen name="BottomTabNurse" component={BottomTabNurseNavigation} />
      <Stack.Screen name="ConsultantScreen" component={ConsultantScreen} />
      <Stack.Screen name="ChatHistoryScreen" component={ChatHistoryScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;