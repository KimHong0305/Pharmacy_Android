import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {
  getCartGuest,
  getCartUser,
  transfer,
} from './src/lib/redux/reducers/cart.reducer';
import store, {AppDispatch} from './src/lib/redux/store';
import Navigation from './src/navigators/Navigation';
import {IntroduceScreen} from './src/screens';
import { loadToken } from './src/lib/redux/reducers/auth.reducer';
import { RootState } from './src/lib/redux/rootReducer';
import { getListAddress } from './src/lib/redux/reducers/address.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContent = () => {
  const [isShowIntroduce, setIsShowIntroduce] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  
  const token  = useSelector((state: RootState) => state.auth.token);
  const role  = useSelector((state: RootState) => state.auth.role);

  // console.log('role', role);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowIntroduce(false);
    }, 2100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        dispatch(getListAddress());
        await dispatch(transfer());
        dispatch(getCartUser());
      } else {
        await AsyncStorage.setItem('AddressGuest', '');
        dispatch(getCartGuest());
      }
    };

    fetchData();
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
          <Navigation role={role}/>
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
