import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../lib/redux/reducers/auth.reducer'; // Import action Redux

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(''); // State lưu email

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return;
    }

    dispatch(forgotPassword(email) as any)
      .unwrap()
      .then(() => {
        Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn.');
        navigation.navigate('ResetPasswordScreen', { email });
      })
      .catch(() => {
        Alert.alert('Lỗi', 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Forgot Password!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
        <Text style={styles.loginButtonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- We will send an OTP to your email -</Text>

      <Text >
        Test{' '}
        <Text onPress={() => navigation.navigate('ResetPasswordScreen')}>OTP</Text>
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
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    bottom: 100,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    bottom: 70,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  orText: {
    marginVertical: 10,
    bottom: 30,
  },
});

export default ForgotPasswordScreen;
