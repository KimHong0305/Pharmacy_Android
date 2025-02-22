import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../lib/redux/reducers/auth.reducer';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { email } = route.params as { email: string };

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleResetPassword = () => {
        if (!otp || !newPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
        return;
        }   

        dispatch(resetPassword({ email, otp, newPassword }) as any)
          .unwrap()
          .then(() => {
            Alert.alert('Thành công', 'Mật khẩu của bạn đã được đặt lại.');
            navigation.navigate('LoginScreen');
          })
          .catch(() => {
            Alert.alert('Lỗi', 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
          });
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LoginScreen')}>
            <Text>Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>

        <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
        />

        <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Xác Nhận</Text>
        </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
