import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {
  getCartGuest,
  getCartUser,
  transfer,
} from './src/lib/redux/reducers/cart.reducer';
import {RootState} from './src/lib/redux/rootReducer';
import store, {AppDispatch} from './src/lib/redux/store';
import Navigation from './src/navigators/Navigation';
import {IntroduceScreen} from './src/screens';

const AppContent = () => {
  const [isShowIntroduce, setIsShowIntroduce] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowIntroduce(false);
    }, 2100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(transfer())
        .then(() => dispatch(getCartUser())); 
    } else {
      dispatch(getCartGuest());
    }
  }, [dispatch, token]);

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
          <Navigation />
        </NavigationContainer>
      )}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
