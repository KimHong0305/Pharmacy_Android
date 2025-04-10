import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductDetailItem } from '../lib/schemas/product.schema';

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: {email: string};
  ProfileScreen: undefined;
  BottomTab?: {screen: string};
  VerifyEmailSignup?: {email: string};
  UpdateEmailScreen: undefined;
  VerifyEmailScreen: undefined;
  ProductDetailScreen: {productId: string};
  OnboardingScreen: undefined;
  AccountScreen: undefined;
  ProductScreen: undefined;
  OrderCartScreen: { selectedCoupon?: string | null }; 
  OrderHomeScreen: {product: ProductDetailItem};
  AddressScreen: {home?: boolean; product?: ProductDetailItem};
  ListAddressScreen: {home?: boolean; product?: ProductDetailItem};
  SearchList: {query: string};
  SearchScreen: undefined;
  HistoryOrderScreen: {active: string};
  AccScreen: undefined;
  ListCouponScreen: undefined;
  ChooseCouponScreen: { totalPrice: number };
  NotificationScreen: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 