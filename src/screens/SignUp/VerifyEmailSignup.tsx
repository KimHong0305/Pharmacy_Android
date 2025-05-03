import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { verifyOtpSignup, refreshOtp } from '../../lib/redux/reducers/auth.reducer';
import type {NavigationProp} from '../../navigators/index';

const VerifyEmailSignup = () => {
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch();
    const route = useRoute();
    const { email } = route.params as { email: string };
    // const email = "nguyenkimhong0305@gmail.com"

    console.log('Email received:', email);


    const handleOtpChange = (text: string, index: number) => {
        if (/^\d$/.test(text)) {
        const newOtp = [...otpCode];
        newOtp[index] = text;
        setOtpCode(newOtp);
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        } else if (text === '') {
        const newOtp = [...otpCode];
        newOtp[index] = '';
        setOtpCode(newOtp);
        }
    };

    const handleResendOtp = () => {
        dispatch(refreshOtp(email) as any)
          .unwrap()
          .then(() => {
            Alert.alert('Mã OTP mới đã được gửi.');
          })
          .catch(() => {
            Alert.alert('Lỗi', 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
            // Alert.alert(email);
          });
      };
      

    const handleVerify = () => {
        const otp = otpCode.join('');
        
        // const otpCode = otp.join('');
        if (otp.length < 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP.');
            return;
        }

        dispatch(verifyOtpSignup({ email, otp }) as any)
            .unwrap()
            .then(() => {
                Alert.alert('Thành công', 'Xác thực tài khoản thành công!');
                // Alert.alert(email, otp);
                setOtpCode(['', '', '', '', '', '']);
                navigation.navigate('LoginScreen');
            })
            .catch(() => {
                // Alert.alert('Lỗi', 'Mã OTP không hợp lệ hoặc đã hết hạn.');
                Alert.alert(email, otp);
                setOtpCode(['', '', '', '', '', '']);
            });
    };

    return (
      <ImageBackground source={require('../../assets/images/OTPBackground.png')} style = {styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('BottomTab', {screen: 'Tài khoản', params: {}})}>
          <Text>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Xác thực Email</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP được gửi đến email của bạn.
        </Text>

        <View style={styles.otpContainer}>
          {otpCode.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              ref={ref => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Xác Thực</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleResendOtp();
          }}>
          <Text style={styles.resendText}>Gửi lại mã OTP</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    verifyButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendText: {
        marginTop: 20,
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default VerifyEmailSignup;
