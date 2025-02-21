import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { fontFamilies } from '../../constants/fontFamilies';
import { TextComponent } from '../../components';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  return (
    <View style = {styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <TextComponent text="Quay lại" />
      </TouchableOpacity>

      <Text style={styles.title}>Type new password?</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
      />

      <Text style={styles.orText}>
      - New password must have more than 8 characters -
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
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
    fontSize: 13,
    bottom: 55,
    fontFamily: fontFamilies.Medium
  },
});

export default ResetPasswordScreen