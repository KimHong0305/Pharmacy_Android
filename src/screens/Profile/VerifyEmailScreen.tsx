import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../../lib/redux/reducers/user.reducer';

const VerifyEmailScreen = () => {
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();

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
    }

    const handleVerify = () => {
        const otp = otpCode.join('');
        
        // const otpCode = otp.join('');
        if (otp.length < 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP.');
            return;
        }

        dispatch(verifyEmail({ otp }) as any)
            .unwrap()
            .then(() => {
                Alert.alert('Thành công', 'Xác thực email thành công!');
                // Alert.alert(email, otp);
                setOtpCode(['', '', '', '', '', '']);
                navigation.navigate('ProfileScreen');
            })
            .catch(() => {
                Alert.alert('Lỗi', 'Mã OTP không hợp lệ hoặc đã hết hạn.');
                // Alert.alert(otp);
                setOtpCode(['', '', '', '', '', '']);
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('UpdateEmailScreen')}>
                <Text>Quay lại</Text>
            </TouchableOpacity>
        <Text style={styles.title}>Xác thực Email</Text>
        <Text style={styles.subtitle}>Vui lòng nhập mã OTP được gửi đến email của bạn.</Text>

        <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
            <TextInput
                key={index}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
            />
            ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Xác Thực</Text>
        </TouchableOpacity>

        </View>
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

export default VerifyEmailScreen;
