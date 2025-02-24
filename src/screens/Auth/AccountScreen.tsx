import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontFamilies } from '../../constants/fontFamilies';

const AccountScreen = ( { hasToken }: { hasToken: boolean } ) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (hasToken) {
      navigation.navigate('ProfileScreen'); 
    }
  }, [hasToken, navigation]);
  
  return (
    <View style={styles.container}>
      {/* Nội dung chính */}
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

      {/* TabBar */}
      {/* <TabBar /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginTop: 40,
    fontFamily: fontFamilies.Medium,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
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
});

export default AccountScreen;
