import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: {email: string};
  ProfileScreen: undefined;
  BottomTab? : { screen: string };
  VerifyEmailSignup?: {email: string};
  UpdateEmailScreen: undefined;
  VerifyEmailScreen: undefined;
  ProductDetailScreen: { productId: string };
  OnboardingScreen: undefined;
  AccountScreen: undefined;
  ProductScreen: undefined;
  OrderScreen: undefined,
  SearchList: {query : string},
  SearchScreen: undefined,
  HistoryOrderScreen: {active: string},
  AccScreen: undefined,
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 