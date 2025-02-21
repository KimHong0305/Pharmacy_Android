import React from 'react';

const AuthStackNavigation = () => {
  const AuthStack = createNativeStackNavigator();

  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="AccountScreen" component={AccountScreen} />
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigation