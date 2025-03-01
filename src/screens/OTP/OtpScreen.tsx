import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { fontFamilies } from '../../constants/fontFamilies';
import type {NavigationProp} from '../../navigators/index';

const OtpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  return (
    <ImageBackground
      source={require('../../assets/images/OTPBackground.png')}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.otpCircle}>OTP</Text>
        <Text style={styles.instruction}>Type OTP sent to your email</Text>
        <OtpInputs
          handleChange={code => console.log(code)}
          numberOfInputs={6}
          autofillFromClipboard={false}
          style={styles.otpInput}
          inputStyles={styles.otpBox}
        />
        <TouchableOpacity>
          <Text style={styles.resendOtp}>Send back OTP?</Text>
        </TouchableOpacity>

        <TouchableOpacity
                style={styles.submitButton}
                onPress={() => navigation.navigate('ResetPasswordScreen', { email })}>
                <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  otpCircle: {
    backgroundColor: '#fff',
    borderRadius: 70,
    padding: 30,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    elevation: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    top: 20,
    fontFamily: fontFamilies.Medium,
  },
  otpInput: {
    top: 50,
    flexDirection: 'row',
  },
  otpBox: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
  },
  resendOtp: {
    color: 'red',
    top: 65,
    right: -130
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: 80
  },
  submitButtonText: {
    color: 'white',
    fontFamily: fontFamilies.Medium,
    fontSize: 20,
  },
});

export default OtpScreen