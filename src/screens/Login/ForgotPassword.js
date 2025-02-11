import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('Login')}>
        <Text>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Forgot Password!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- We will send a OTP to your email -</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    bottom: 100
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    bottom: 70
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
    width: '100%',
    alignItems: 'center', // Căn chữ theo chiều ngang
    justifyContent: 'center', // Căn chữ theo chiều dọc
    bottom: 50
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  orText: {
    marginVertical: 10,
    bottom: 30
  }
});

export default App;
