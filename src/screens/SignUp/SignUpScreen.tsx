import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
          <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => navigation.navigate('AccountScreen')}>
                  <Text>Quay lại</Text>
          </TouchableOpacity>
    
          <Text style={styles.welcomeText}>Create an account</Text>
    
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
          />
    
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
          />
    
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
          />
    
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
          />
    
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            placeholderTextColor="#999"
          />
    
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Create Account</Text>
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
            I Already Have An Account{' '}
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate('LoginScreen')}>
              Login
            </Text>
          </Text>
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