import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductDetailItem } from '../lib/schemas/product.schema';
import { Coupon } from '../lib/schemas/coupon.schema';
import { Address } from '../lib/schemas/address.schema';

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: {email: string};
  ProfileScreen: undefined;
  BottomTab?: {screen: string; params: {}};
  VerifyEmailSignup?: {email: string};
  UpdateEmailScreen: undefined;
  VerifyEmailScreen: undefined;
  ProductDetailScreen: {productId: string};
  OnboardingScreen: undefined;
  AccountScreen: undefined;
  ProductScreen: undefined;
  OrderCartScreen:
    | {selectedCoupon?: Coupon | null; selectedAddress?: Address | null}
    | undefined;
  OrderHomeScreen: {
    product: ProductDetailItem;
    selectedCoupon?: Coupon | null;
    selectedAddress?: Address | null;
  };
  AddressScreen: {home?: boolean; product?: ProductDetailItem};
  ChooseAddressScreen: {
    home?: boolean;
    product?: ProductDetailItem;
    selectedCoupon?: Coupon | null;
  };
  SearchList: {query: string};
  SearchScreen: undefined;
  HistoryOrderScreen: {active: string};
  AccScreen: undefined;
  ListCouponScreen: undefined;
  ChooseCouponScreen: {
    home?: boolean;
    product?: ProductDetailItem;
    totalPrice: number;
    selectedAddress?: Address | null;
  };
  CartScreen: {selectedCoupon: Coupon | null} | undefined;
  CouponCartScreen: {totalPrice: number};
  UpdatePasswordScreen: undefined;
  NotificationScreen: undefined;
  WhistlistScreen: undefined;
  StatisticScreen: undefined;
  AddressUserScreen: undefined;
  AddAddressScreen: undefined;
  EditAddressScreen: {address: Address};
  PaymentScreen: {paymentUrl: string};
  CustomPaymentResultScreen: {callbackUrl: string};
  OrderLookupScreen: undefined;
  ProductCategoryScreen: {categoryId: string};
  BottomTabNurse?: {screen: string; params: {}};
  ChooseProductScreen: undefined;
  ChatHistoryScreen: undefined;
  ConsultantScreen: {roomId: string, senderId: string};
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 