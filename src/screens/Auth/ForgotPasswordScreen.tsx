import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { fontFamilies } from '../../constants/fontFamilies';
import { TextComponent } from '../../components';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
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
          />
    
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
    
          <Text style={styles.orText}>- We will send a OTP to your email -</Text>
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
    top: 25,
    right: 20,
    padding: 10
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamilies.SemiBold,
    bottom: 100
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    bottom: 70,
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
    marginVertical: 10,
    bottom: 30,
    fontFamily: fontFamilies.Medium
  },
});

export default ForgotPasswordScreen