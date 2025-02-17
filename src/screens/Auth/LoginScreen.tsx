import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('AccountScreen')}>
          <Text>Quay lại</Text>
        </TouchableOpacity>
  
        <Text style={styles.welcomeText}>Welcome Back!</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#999"
        />
  
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
        />
  
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPasswordScreen')}>Forgot Password?</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
  
        <Text style={styles.orText}>- OR Continue with -</Text>
  
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.socialButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../assets/images/facebook.png')}
              style={styles.socialButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
  
        <Text style={styles.createAccountText}>
          Create An Account{' '}
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('SignUpScreen')}>
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
    welcomeText: {
      fontSize: 32,
      fontWeight: 'bold',
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
    },
    forgotPasswordText: {
      color: 'red',
      marginBottom: 20,
      marginLeft: 250,
    },
    loginButton: {
      backgroundColor: 'blue',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center', // Căn chữ theo chiều ngang
      justifyContent: 'center', // Căn chữ theo chiều dọc
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

export default LoginScreen