import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontFamilies } from '../../constants/fontFamilies';

const AccountScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với Pharmacy</Text>
      <Text style={styles.subtitle}>
        Hãy đăng nhập để được hưởng các đặc quyền của hội viên
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    marginTop: 30,
    fontFamily: fontFamilies.SemiBold
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: fontFamilies.Medium
  },
  loginButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  buttonText: {
    color: 'white',
    fontFamily: fontFamilies.Medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6200EE',
  },
});

export default AccountScreen