import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const AccountScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
          {/* <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <Icon name="times" size={24} color="#000" />
          </TouchableOpacity> */}
    
          <Text style={styles.title}>Chào mừng đến với Pharmacy</Text>
          <Text style={styles.subtitle}>
            Hãy đăng nhập để được hưởng các đặc quyền của hội viên
          </Text>
    
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </TouchableOpacity>
    
          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('HomeScreen')}>
              <Text style={styles.footerButtonText}>Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Danh mục</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Tư vấn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Đơn hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
  )
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center', // Căn chữ theo chiều ngang
    justifyContent: 'center', // Căn chữ theo chiều dọc
  },
  signupButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center', // Căn chữ theo chiều ngang
    justifyContent: 'center', // Căn chữ theo chiều dọc
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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