import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import MembershipCard from '../../components/MembershipCard';
import { logout } from '../../lib/redux/reducers/auth.reducer';
import { getBio } from '../../lib/redux/reducers/user.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import type { NavigationProp } from '../../navigators/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const { bio, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getBio());
  }, []);

  const handleLogout = async () => {
    dispatch(logout())
      .then(async () => await AsyncStorage.removeItem('token'));
    console.log('Đã đăng xuất');
    navigation.navigate('BottomTab', {screen: 'Tài khoản'});
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
            source={bio?.image ? { uri: bio.image } : require('../../assets/images/avatar.jpg')}
            style={styles.avatar}
        />
        <Text style={styles.username}>{bio?.username || 'Người dùng'}</Text>
        <TouchableOpacity style={{position:'absolute', top:55, right:15, padding:10}} onPress={handleLogout}>
          <Icon name="sign-out" size={25} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <MembershipCard point={bio?.point ?? 0} />
      </View>

      <View style={styles.account}>
        <Text style={{fontWeight:'bold', fontSize: 16}}>Đơn hàng</Text>
        <View style={styles.listFunc}>
          <TouchableOpacity style={styles.func} onPress={() => navigation.navigate('HistoryOrderScreen', { active: 'processing' })}>
            <Icon name="clock-o" size={20} color="#000000" />
            <Text style={styles.nameFunc}>Đang xử lý</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.func} onPress={() => navigation.navigate('HistoryOrderScreen', { active: 'pendingPayment' })}>
            <Icon name="money" size={20} color="#000000" />
            <Text style={styles.nameFunc}>Chờ thanh toán</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.func} onPress={() => navigation.navigate('HistoryOrderScreen', { active: 'shipping' })}>
            <Icon name="truck" size={20} color="#000000" />
            <Text style={styles.nameFunc}>Đang giao</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.func} onPress={() => navigation.navigate('HistoryOrderScreen', { active: 'review' })}>
            <Icon name="star" size={20} color="#000000" />
            <Text style={styles.nameFunc}>Đánh giá</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.func} onPress={() => navigation.navigate('HistoryOrderScreen', { active: 'cancelled' })}>
            <Icon name="ban" size={20} color="#000000" />
            <Text style={styles.nameFunc}>Đã hủy</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.account}>
        <Text style={{fontWeight:'bold', fontSize: 16}}>Tài khoản</Text>
        <View style={styles.listFunc}>
            <TouchableOpacity style={styles.func}  onPress={() => navigation.navigate('ProfileScreen')}>
              <Icon name="user" size={20} color="#000000" />
              <Text style={styles.nameFunc}>Thông tin cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.func}>
              <Icon name="location-arrow" size={20} color="#000000" />
              <Text style={styles.nameFunc}>Địa chỉ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.func}>
              <Icon name="unlock-alt" size={20} color="#000000" />
              <Text style={styles.nameFunc}>Đổi mật khẩu</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f1f5f9',
  },
  profile: {
    paddingTop: 50,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#fff'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 90,
    borderWidth: 3,
    marginLeft: 20,
    borderColor: '#007AFF',
  },
  username: {
    fontSize: 20,
    textAlign: 'right',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  card: {
    alignItems:'center',
    marginBottom: 15,
    marginTop: 15,
  },
  account: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'column',
  },
  listFunc: {
    flexDirection:'row',
    paddingTop: 15
  },
  func: {
    alignItems:'center',
    width: 70,
    marginRight: 10,
  },
  nameFunc: {
    textAlign: 'center', 
    marginTop: 5, 
    fontWeight: '500', 
    fontSize: 13}
});

export default AccScreen;
