import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IntroduceScreen } from './src/screens';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigators/Navigation';

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
    <>
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
    </>
  );
}

export default App