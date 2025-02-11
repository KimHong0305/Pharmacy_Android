import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Home from './src/screens/Home/Home';
import Introduce from './src/screens/Introduce/Introduce';
import Login from './src/screens/Login/Login';
import ForgotPassword from './src/screens/Login/ForgotPassword';
import SignUp from './src/screens/SignUp/SignUp';
import UserInfo from './src/screens/UserInfo/UserInfo';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Introduce"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Introduce" component={Introduce} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({});
export default App;
