import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { fontFamilies } from '../../constants/fontFamilies';
import { TextComponent } from '../../components';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../lib/redux/reducers/auth.reducer'; // Import action Redux
import type {NavigationProp} from '../../navigators/index';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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
        onPress={() => navigation.navigate('LoginScreen')}>
        <TextComponent text='Quay lại'/>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleForgotPassword}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- We will send an OTP to your email -</Text>
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
    top: 30,
    right: 20,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamilies.SemiBold,
    bottom: 80
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    bottom: 65,
    fontFamily: fontFamilies.Medium
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: fontFamilies.Medium,
    fontSize: 20,
  },
  orText: {
    marginBottom: 20,
    bottom: 45,
    fontFamily: fontFamilies.Medium
  },
});

export default ForgotPasswordScreen;
