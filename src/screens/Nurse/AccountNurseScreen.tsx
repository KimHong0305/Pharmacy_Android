import {useNavigation} from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../lib/redux/reducers/auth.reducer';
import {AppDispatch} from '../../lib/redux/store';
import type {NavigationProp} from '../../navigators/index';
import { RootState } from '../../lib/redux/rootReducer';
import { getBioNurse } from '../../lib/redux/reducers/nurse.reducer';

const AccountNurseScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const {bioNurse} = useSelector((state: RootState) => state.nurse);
  
  const handleLogout = async () => {
    dispatch(logout());
    console.log('Đã đăng xuất');
    navigation.navigate('BottomTab', {screen: 'Tài khoản', params: {}});
  };

  useEffect(() => {
      dispatch(getBioNurse());
    }, []);
    
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{uri: bioNurse?.result.image}} style={styles.avatar} />

        <Text style={styles.name}>
          {bioNurse?.result.lastname} {bioNurse?.result.firstname}
        </Text>

        <Text style={styles.role}>{bioNurse?.result.specilization}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mô tả:</Text>
          <Text style={styles.value}>{bioNurse?.result.description}</Text>

          <Text style={styles.label}>Kinh nghiệm:</Text>
          <Text style={styles.value}>{bioNurse?.result.workExperience}</Text>

          <Text style={styles.label}>Học vấn:</Text>
          <Text style={styles.value}>{bioNurse?.result.education}</Text>

          <Text style={styles.label}>Ngày sinh:</Text>
          <Text style={styles.value}>{bioNurse?.result.dob}</Text>

          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{bioNurse?.result.sex}</Text>

          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{bioNurse?.result.phoneNumber}</Text>

          <Text style={styles.label}>Thời gian làm việc:</Text>
          <Text style={styles.value}>{bioNurse?.result.workTime} năm</Text>

          <Text style={styles.label}>Mức lương:</Text>
          <Text style={styles.value}>
            {bioNurse?.result.salary.toLocaleString()} VNĐ
          </Text>

        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingTop: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#333',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AccountNurseScreen;
