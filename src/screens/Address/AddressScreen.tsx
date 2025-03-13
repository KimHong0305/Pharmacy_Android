import {View, Text, StyleSheet, Touchable, TouchableOpacity, TextInput, Switch, StatusBar} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {appColors} from '../../constants/appColors';
import {TextComponent} from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/rootReducer';

const AddressScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const {cart} = useSelector((state: RootState) => state.cart);
  
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [addressCategory, setAddressCategory] = useState('');
  

  useFocusEffect(
    useCallback(() => {
      // Đặt StatusBar cho màn hình này khi được focus
      StatusBar.setBackgroundColor(appColors.blue);
      StatusBar.setBarStyle('light-content');

      return () => {
        // Khôi phục StatusBar khi rời màn hình
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setBarStyle('dark-content');
      };
    }, []),
  );

  const handleSave = async () => {
    const AddressData = {
      fullname,
      phone,
      province,
      district,
      village,
      address,
      addressCategory
    };
    await AsyncStorage.setItem('AddressData', JSON.stringify(AddressData));
    navigation.navigate('OrderScreen', {cart: cart})
    console.log(AddressData);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate('OrderScreen', {cart: cart})}>
          <Icon name="chevron-left" size={20} color={appColors.white} />
        </TouchableOpacity>
        <TextComponent
          text="ĐỊA CHỈ NHẬN HÀNG"
          size={20}
          color={appColors.white}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.info}>
          <TextComponent
            text="Thông tin liên hệ:"
            size={15}
            styles={styles.title}
          />
          <TextInput
            placeholder="Họ và tên"
            style={styles.input}
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            placeholder="Số điện thoại"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <View style={styles.address}>
          <TextComponent
            text="Địa chỉ nhận hàng:"
            size={15}
            styles={styles.title}
          />
          <TextInput
            placeholder="Tỉnh/ Thành Phố"
            style={styles.input}
            value={province}
            onChangeText={setProvince}
          />
          <TextInput
            placeholder="Huyện/ Quận"
            style={styles.input}
            value={district}
            onChangeText={setDistrict}
          />
          <TextInput
            placeholder="Xã/ Phường/ Thị Trấn"
            style={styles.input}
            value={village}
            onChangeText={setVillage}
          />
          <TextInput
            placeholder="Địa chỉ/ Số nhà"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.address_category}>
            <TextComponent
              text="Loại địa chỉ: "
              size={15}
              styles={styles.title}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                gap: 10,
                marginTop: -25,
              }}>
              <TouchableOpacity
                style={{
                  height: 25,
                  width: 50,
                  borderWidth: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  borderColor: addressCategory === 'HOUSE' ? 'blue' : 'gray',
                  backgroundColor:
                    addressCategory === 'HOUSE' ? '#E3F2FD' : 'white',
                }}
                onPress={() => setAddressCategory('HOUSE')}>
                <TextComponent text="Nhà" size={15} />
                {addressCategory === 'HOUSE' && (
                  <Icon
                    name="check"
                    size={18}
                    color="blue"
                    style={{position: 'absolute', top: -10, right: -10}}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 25,
                  width: 100,
                  borderWidth: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  borderColor: addressCategory === 'COMPANY' ? 'blue' : 'gray',
                  backgroundColor:
                    addressCategory === 'COMPANY' ? '#E3F2FD' : 'white',
                }}
                onPress={() => setAddressCategory('COMPANY')}>
                {addressCategory === 'COMPANY' && (
                  <Icon
                    name="check"
                    size={18}
                    color="blue"
                    style={{position: 'absolute', top: -10, right: -10}}
                  />
                )}
                <TextComponent text="Văn phòng" size={15} />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 25}}>
              <TextComponent
                text="Đặt làm địa chỉ mặc định"
                size={15}
                styles={styles.title}
              />
              <Switch style={{marginTop: -25}}></Switch>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSave()}>
              <TextComponent
                text="CẬP NHẬT"
                size={20}
                color={appColors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomColor: appColors.blue,
    borderBottomWidth: 1,
    backgroundColor: appColors.blue
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  body: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  info: {
    borderBottomWidth: 1,
    height: 150,
  },
  address: {
    marginTop: 10,
    borderBottomWidth: 1,
    height: 350,
  },
  address_category: {
    marginTop: 15,
  },
  title: {
    alignItems: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 40,
    height: 50,
    width: '100%',
    backgroundColor: appColors.blue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddressScreen;
