import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IntroduceScreen } from './src/screens';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigators/Navigation';
import { Provider } from 'react-redux';
import store from './src/lib/redux/store';

const App = () => {
  const [isShowIntroduce, setIsShowIntroduce] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  //const {getItem, setItem} = useAsyncStorage('accessToken');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowIntroduce(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Provider store={store}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      {isShowIntroduce ? (
        <IntroduceScreen />
      ) : (
        <NavigationContainer>
          <Navigation/>
        </NavigationContainer>
      )}
    </Provider>
  );
}

export default App