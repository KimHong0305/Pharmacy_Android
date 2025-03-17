import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import TextComponent from '../../components/TextComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { getCartGuest, getCartUser } from '../../lib/redux/reducers/cart.reducer';
import { createOrderCartGuest, createOrderCartUser, createOrderHomeGuest, createOrderHomeUser } from '../../lib/redux/reducers/order.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { NavigationProp } from '../../navigators';
import { ProductDetailItem } from '../../lib/schemas/product.schema';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const OrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [addressData, setAddressData] = useState({id: '', fullname: '', phone: '', province: '', district: '', village: '', address: '', addressCategory: ''});

  const route = useRoute();
  const {product} = route.params as {product: ProductDetailItem}

  const {token} = useSelector((state: RootState) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  
  //Get Address
  useEffect(() => {
    const getData = async () => {
      let data;
      if (token) {
        data = await AsyncStorage.getItem('AddressUser');
      } else {
        data = await AsyncStorage.getItem('AddressGuest');
      }
      if (data !== null) {
        setAddressData(JSON.parse(data)); // Chuyển từ JSON về object
      }
    };
    getData();
  }, []);
  
  //Order
  const handleOrder = async () => {
    try {
      if(token){
        const orderUser = {
          priceId: product.price.id,
          addressId: addressData.id,
          paymentMethod: paymentMethod
        }
        console.log('Order Home',orderUser.addressId);
        await dispatch(createOrderHomeUser(orderUser));
      } 
      else {
        const orderGuest = {
          priceId: product.price.id,
          fullname: addressData.fullname,
          phone: addressData.phone,
          province: addressData.province,
          district: addressData.district,
          village: addressData.village,
          address: addressData.address,
          addressCategory: addressData.addressCategory,
          paymentMethod: paymentMethod,
        };
        await dispatch(createOrderHomeGuest(orderGuest));
      }
      Alert.alert('Thông báo', 'Đặt hàng thành công')
      navigation.navigate('ProductDetailScreen', {productId: product.id})
    } catch (error) {
      
    }
  }
  
  //Update Address
  const handleClickAddress = () => {
    if(token) {
      navigation.navigate('ListAddressScreen', {home: true, product: product})
    } else {
      navigation.navigate('AddressScreen', {home: true, product: product})
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextComponent text="Thanh Toán" size={30} />
        <TouchableOpacity
          style={{marginBottom: 10}}
          onPress={() =>
            navigation.navigate('ProductDetailScreen', {productId: product.id})
          }>
          <TextComponent text="Quay lại" size={15} color={appColors.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.address}>
          <TextComponent
            text="Địa chỉ nhận hàng"
            size={16}
            styles={{marginTop: 10, marginLeft: 10}}
          />
          <View style={{flexDirection: 'row'}}>
            <View style = {{flex: 1}}>
              <TextComponent
                text={
                  addressData.address +
                  ', ' +
                  addressData.village +
                  ', ' +
                  addressData.district +
                  ', ' +
                  addressData.province
                }
                size={13}
                styles={{padding: 10}}
              />
            </View>
            <TouchableOpacity onPress={handleClickAddress} style={{marginTop: 10}}>
              <Icon name="edit" size={23} color={appColors.black} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{uri: product.images[0]}} style={styles.image} />
              <View>
                <TextComponent
                  text={truncateText(product.name, 20)}
                  size={16}
                />
                <Text style={styles.priceText}>
                  {product.price.price.toLocaleString('vi-VN')}đ/{product.price.unit.name}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 5,
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <TextComponent
                  text='1'
                  size={20}
                  color={appColors.black}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.payment_method}>
          <TextComponent
            text="Phương Thức Thanh Toán"
            size={16}
            color={appColors.black}
            styles={{
              marginTop: 5,
              marginLeft: 10,
              fontFamily: fontFamilies.SemiBold,
            }}
          />
          <View
            style={{flexDirection: 'row', justifyContent: 'center', gap: 10}}>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderColor: paymentMethod === 'CASH' ? 'blue' : 'gray',
                backgroundColor:
                  paymentMethod === 'CASH' ? '#E3F2FD' : appColors.gray2,
              }}
              onPress={() => setPaymentMethod('CASH')}>
              <TextComponent
                text="CASH"
                size={16}
                color={appColors.blue}
                styles={{
                  padding: 10,
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderColor: paymentMethod === 'VNPAY' ? 'blue' : 'gray',
                backgroundColor:
                  paymentMethod === 'VNPAY' ? '#E3F2FD' : appColors.gray2,
              }}
              onPress={() => setPaymentMethod('VNPAY')}>
              <TextComponent
                text="VNPAY"
                size={16}
                color={appColors.blue}
                styles={{
                  padding: 10,
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderColor: paymentMethod === 'MOMO' ? 'blue' : 'gray',
                backgroundColor:
                  paymentMethod === 'MOMO' ? '#E3F2FD' : appColors.gray2,
              }}
              onPress={() => setPaymentMethod('MOMO')}>
              <TextComponent
                text="MOMO"
                size={16}
                color={appColors.blue}
                styles={{
                  padding: 10,
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderColor: paymentMethod === 'ZALOPAY' ? 'blue' : 'gray',
                backgroundColor:
                  paymentMethod === 'ZALOPAY' ? '#E3F2FD' : appColors.gray2,
              }}
              onPress={() => setPaymentMethod('ZALOPAY')}>
              <TextComponent
                text="ZALO PAY"
                size={16}
                color={appColors.blue}
                styles={{
                  padding: 10,
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={{flexDirection: 'row'}}>
            <TextComponent
              text="Tổng tiền: "
              size={16}
              styles={{marginTop: 16}}
            />
            <TextComponent
              text={product.price.price.toLocaleString('vi-VN') + 'đ'}
              size={16}
              styles={{marginTop: 16}}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleOrder}>
            <TextComponent text="Thanh Toán" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 120,
    marginTop: 30,
    marginLeft: 20,
  },
  body: {
    alignSelf: 'center',
    height: '100%',
    width: '90%',
    marginTop: 10,
  },
  address: {
    height: '15%',
    backgroundColor: appColors.gray2,
    borderRadius: 20,
  },
  content: {
    marginTop: 20,
    height: '50%',
    borderRadius: 20,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: appColors.white,
    shadowColor: appColors.gray,
  },
  text: {
    fontSize: 13,
  },
  priceText: {
    marginTop: 5,
    fontSize: 13,
    color: appColors.primary,
    fontFamily: fontFamilies.Medium,
  },
  add_sub: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: appColors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payment_method: {
    height: '12%',
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 100,
    height: '20%',
  },
  button: {
    height: 35,
    width: 120,
    borderRadius: 10,
    backgroundColor: appColors.blue,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15,
  },
});

export default OrderScreen