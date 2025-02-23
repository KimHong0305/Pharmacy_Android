import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateEmail } from '../../lib/redux/reducers/user.reducer';
import { useNavigation } from '@react-navigation/native';

const UpdateEmailScreen = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleUpdateEmail = () => {
    if (!email) {
      Alert.alert('Vui lòng nhập email');
      return;
    }

    dispatch(updateEmail({ email }))
      .unwrap()
      .then(() => {
        Alert.alert('Cập nhật email thành công', 'Vui lòng kiểm tra mã otp được gửi qua email');
        navigation.navigate('VerifyEmailScreen');
      })
      .catch(() => {
        Alert.alert('Cập nhật email thất bại');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ProfileScreen')}>
          <Text>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Cập nhật Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email mới"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateEmailScreen;
