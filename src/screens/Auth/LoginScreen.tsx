import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearMessages, loginWithGoogle } from '../../lib/redux/reducers/auth.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { fontFamilies } from '../../constants/fontFamilies';
import type {NavigationProp} from '../../navigators/index';
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import { LoginWithGoogle } from '../../lib/schemas/auth.schema';

GoogleSignin.configure({
  webClientId:
    '1061151903576-tnsr7rdaldk70ngn458ovc8448qgoikl.apps.googleusercontent.com',
});
const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, message, token } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    dispatch(login({ username, password }) as any)
      .then(() => {
        if (message) {
          Alert.alert('Thông báo', message);
          navigation.navigate('BottomTab');
          setUsername('');
          setPassword('');
        }
      })
      .catch(() => {
        Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
        setUsername('');
        setPassword('');
      });
  };

  const handleLoginWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const loginWithGoogleRequest : LoginWithGoogle = {
        email: userInfo.data?.user.email,
        givenName: userInfo.data?.user.givenName,
        familyName: userInfo.data?.user.familyName,
        photo: userInfo.data?.user.photo
      }
      dispatch(loginWithGoogle(loginWithGoogleRequest) as any)
        .then(() => {
          Alert.alert('Thông báo', 'Đăng nhập thành công')
          navigation.navigate('BottomTab');
        });
      console.log(userInfo.data?.user)
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('BottomTab', {screen: 'Tài khoản', params: {}})}>
        <Text style={{fontFamily: fontFamilies.Medium}}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>- OR Continue with -</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton} onPress={handleLoginWithGoogle}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/facebook.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.createAccountText}>
        Create An Account ? {' '}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamilies.Medium,
    marginBottom: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: fontFamilies.Medium,
  },
  forgotPasswordText: {
    color: 'red',
    marginBottom: 20,
    right: -120,
    fontFamily: fontFamilies.Medium,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontFamily: fontFamilies.Medium,
    fontSize: 20,
  },
  orText: {
    marginVertical: 10,
    fontFamily: fontFamilies.Medium,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  createAccountText: {
    marginTop: 20,
    fontFamily: fontFamilies.Medium,
  },
  signUpText: {
    color: 'blue',
    fontFamily: fontFamilies.Medium,
  },
});

export default LoginScreen;
