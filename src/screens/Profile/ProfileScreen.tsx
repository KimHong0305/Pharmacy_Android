import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-elements'

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style = {styles.header}>
        {/* <TouchableOpacity style = {{marginTop: 10}}>
          <Text style = {styles.closeButton}>Quay lại</Text>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
      </View>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.avatar}
      />
      <Text style={styles.updateText}>Cập nhật ảnh</Text>
      <Text style={styles.label}>Họ và Tên</Text>
      <TextInput style={styles.input} placeholder="Nguyễn Văn A" />

      <Text style={styles.label}>Ngày sinh</Text>
      <TextInput style={styles.input} placeholder="04-08-2003" />

      <Text style={styles.label}>Giới tính</Text>
      <TextInput style={styles.input} placeholder="Nam" />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput style={styles.input} placeholder="0363437324" />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    left: -70
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  updateText: {
    color: '#007BFF',
    marginTop: 5,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen