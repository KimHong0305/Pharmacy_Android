import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appColors } from '../../constants/appColors';
import { TextComponent } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '../../navigators';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { getListAddress } from '../../lib/redux/reducers/address.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductDetailItem } from '../../lib/schemas/product.schema';

const ListAddressScreen = () => {

  const navigation = useNavigation<NavigationProp>();
  const [selectedAddress, setSelectedAddress] = useState('');
  const {listAddress, loading} = useSelector((state: RootState) => state.address);
  const {token} = useSelector((state: RootState) => state.auth);
  const dispatch : AppDispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const {home} = route.params as {home : boolean}
  const {product} = route.params as {product : ProductDetailItem};

  //Get List Address
  useEffect(() => {
    dispatch(getListAddress());
  }, [dispatch, token])

  //Check Address Default
  useEffect(() => {
    if (listAddress?.result && listAddress.result.length > 0) {
      const defaultAddress = listAddress.result.find(
        item => item.addressDefault === true,
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    }
  }, [listAddress]);

  //Save Address
  const handleSaveAddress = async () => {
    listAddress?.result.filter(async item => {
    if(item.id === selectedAddress)
    {
        const AddressData = {
          id: item.id,
          fullname: item.fullname,
          phone: item.phone,
          province: item.province,
          district: item.district,
          village: item.village,
          address: item.address,
          addressCategory: item.addressCategory,
        };
        await AsyncStorage.setItem('AddressUser', JSON.stringify(AddressData));
        handleNavigate();
        console.log('ListAddress', AddressData)
    }
    })
  }

  //Redirect Address
  const addNewAddress = () => {
    if(home == true){
      navigation.navigate('AddressScreen', {home: true, product: product})
    } else {
      navigation.navigate('AddressScreen', {home: false})
    }
  }

  const handleNavigate = () => {
    if(home == true) {
      navigation.navigate('OrderHomeScreen', {product: product})
    } else {
      navigation.navigate('OrderCartScreen');
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.close}
          onPress={handleNavigate}>
          <Icon name="chevron-left" size={20} color={appColors.black} />
        </TouchableOpacity>
        <TextComponent text="Chọn địa chỉ nhận hàng" size={20} />
      </View>
      {loading ? (
        <TextComponent text="Đang tải địa chỉ" />
      ) : (listAddress?.result ?? []).length > 0 ? (
        <>
          <ScrollView style={styles.address}>
            {listAddress?.result.map(item => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.addressItem}
                onPress={() => setSelectedAddress(item.id)}>
                <Icon
                  name={
                    selectedAddress === item.id ? 'check-circle-o' : 'circle-o'
                  }
                  size={20}
                  color={
                    selectedAddress === item.id
                      ? appColors.blue
                      : appColors.black
                  }
                />
                <View style={styles.addressDetails}>
                  <TextComponent
                    text={item.fullname}
                    size={14}
                    color={appColors.black}
                  />
                  <TextComponent
                    text={
                      item.address +
                      ', ' +
                      item.village +
                      ', ' +
                      item.district +
                      ', ' +
                      item.province
                    }
                    size={14}
                  />
                </View>
                <TouchableOpacity>
                  <TextComponent text="Sửa" size={14} color={appColors.blue} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.address_null}>
            <TextComponent text="Không có địa chỉ nào" size={25} />
          </View>
        </>
      )}

      <TouchableOpacity style={styles.addButton} onPress={addNewAddress}>
        <TextComponent text="Thêm địa chỉ mới" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.submit} onPress={handleSaveAddress}>
        <TextComponent text="Cập nhật" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
  },
  close: {
    position: 'absolute',
    left: 15,
  },
  address: {
    marginTop: 10,
  },
  addressItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: appColors.gray2,
    marginBottom: 10,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  addressDetails: {
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    alignItems: 'center',
    padding: 12,
    marginVertical: 10,
  },
  submit: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  address_null : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default ListAddressScreen