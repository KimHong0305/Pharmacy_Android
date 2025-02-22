import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearMessages } from '../../lib/redux/reducers/auth.reducer';
import { RootState } from '../../lib/redux/rootReducer';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  // State cho form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  // Lấy trạng thái từ Redux
  const { loading, message, error } = useSelector((state: RootState) => state.auth);

  // Xử lý đăng ký
  const handleRegister = () => {
    if (!username || !password || !confirmPassword || !email || !dob) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận không khớp!');
      return;
    }

    dispatch(register({ username, password, confirmPassword, email, dob }) as any)
      .unwrap()
      .then(() => {
        Alert.alert('Đăng ký thành công');
        navigation.navigate('VerifyEmailSignup', { email });
        dispatch(clearMessages());
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setDob('');
      })
      .catch(() => {
        Alert.alert('Đăng ký thất bại', 'Vui lòng kiểm tra lại thông tin.');
        // if (message) {
        //   Alert.alert('Thông báo', message);
        //   dispatch(clearMessages());
        // }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('AccountScreen')}>
        <Text>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Create an account</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Date of Birth (dd/mm/yyyy)" value={dob} onChangeText={setDob} />

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>{loading ? 'Đang xử lý...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- OR Continue with -</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/images/google.png')} style={styles.socialButton} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/images/facebook.png')} style={styles.socialButton} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <Text style={styles.createAccountText}>
        I Already Have An Account{' '}
        <Text style={styles.signUpText} onPress={() => navigation.navigate('LoginScreen')}>Login</Text>
      </Text>

      {/* <Text style={styles.createAccountText}>
        Test{' '}
        <Text style={styles.signUpText} onPress={() => navigation.navigate('VerifyEmailSignup')}>OTP</Text>
      </Text> */}
    </View>
  )
}

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
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    fontWeight: 'bold',
    fontSize: 20,
  },
  orText: {
    marginVertical: 10,
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
  socialButtonText: {
    fontSize: 24,
  },
  createAccountText: {
    marginTop: 20,
  },
  signUpText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default SignUpScreen