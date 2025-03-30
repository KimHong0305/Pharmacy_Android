import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import TextComponent from '../../components/TextComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { getCartGuest, getCartUser } from '../../lib/redux/reducers/cart.reducer';
import { createOrderCartGuest, createOrderCartUser } from '../../lib/redux/reducers/order.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { NavigationProp, RootStackParamList } from '../../navigators';
import { fetchAddressWithLocationNames } from '../../lib/redux/reducers/address.reducer';
import { AddOrderUser } from '../../lib/schemas/order.schema';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const OrderCartScreen = () => {
  
  const navigation = useNavigation<NavigationProp>();
  const [addressData, setAddressData] = useState({
    id: '',
    fullname: '',
    phone: '',
    province: '',
    district: '',
    village: '',
    address: '',
    addressCategory: '',
    provinceName: '',
    districtName: '',
    villageName: '',
  });
  
  const {cart} = useSelector((state: RootState) => state.cart);
  const {token} = useSelector((state: RootState) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('');
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  
  const route = useRoute<RouteProp<RootStackParamList, 'OrderCartScreen'>>();

  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(
    route.params?.selectedCoupon ?? null
  );

  // console.log(selectedCoupon)

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
        const parsedData = JSON.parse(data);
        try {
          const updatedAddress = await dispatch(fetchAddressWithLocationNames(parsedData)).unwrap();
          setAddressData(updatedAddress);
          // console.log(updatedAddress)
        } catch (error) {
          console.error("Error fetching address names:", error);
          setAddressData(parsedData); // Giữ nguyên dữ liệu cũ nếu lỗi xảy ra
        }
      }
    };
  
    getData();
  }, [dispatch, token]);
  
  
  const handleOrder = async () => {
    try {
      if (token) {
        const orderUser: AddOrderUser & { couponId?: string } = {
            addressId: addressData.id,
            paymentMethod: paymentMethod,
        };
    
        if (selectedCoupon) {
            orderUser.couponId = selectedCoupon;
        }
    
        await dispatch(createOrderCartUser(orderUser))
            .then(() => getCartUser());
        // console.log(orderUser)
      } else {
        const orderGuest = {
          fullname: addressData.fullname,
          phone: addressData.phone,
          province: addressData.province,
          district: addressData.district,
          village: addressData.village,
          address: addressData.address,
          addressCategory: addressData.addressCategory,
          paymentMethod: paymentMethod,
        };
        await dispatch(createOrderCartGuest(orderGuest))
        .then(() => getCartGuest());
      }
      Alert.alert('Thông báo', 'Đặt hàng thành công')
      navigation.navigate('BottomTab', {screen: 'Giỏ hàng'})
    } catch (error) {
      
    }
  }
  
  //Handle Click Update Address
  const handleClickAddress = () => {
    if(token) {
      navigation.navigate('ListAddressScreen', {home: false})
    } else {
      navigation.navigate('AddressScreen', {home: false});
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextComponent text="Thanh Toán" size={30} />
        <TouchableOpacity
          style={{marginBottom: 10}}
          onPress={() =>
            navigation.navigate('BottomTab', {screen: 'Giỏ hàng'})
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
                  addressData.address + ', ' +
                  addressData.villageName
                }
                size={13}
                styles={{padding: 10}}
              />
            </View>
            <TouchableOpacity onPress={handleClickAddress} style={{marginTop: 10, marginRight: 10}}>
              <Icon name="edit" size={23} color={appColors.black} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={cart?.result?.cartItemResponses}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity>
                <View style={styles.item}>
                  <Image source={{uri: item.image}} style={styles.image} />
                  <View>
                    <TextComponent
                      text={truncateText(item.productName, 20)}
                      size={16}
                    />
                    <Text style={styles.priceText}>
                      {item.price.toLocaleString('vi-VN')}đ/{item.unitName}
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
                      text={item.quantity.toString()}
                      size={20}
                      color={appColors.black}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
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
        
        {/* Ưu đãi */}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
        onPress={() =>
          navigation.navigate('ChooseCouponScreen', { totalPrice: cart?.result?.totalPrice ?? 0 })
        }
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon2 name="ticket-percent-outline" size={22} color={appColors.blue}/>
            <Text style={{marginLeft: 5, fontSize: 15, fontWeight: '500'}}>Mã ưu đãi</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {selectedCoupon ? (
              <Text style={{ marginLeft: 5, fontSize: 13, fontWeight: '500', color: 'red' }}>
                Đã chọn 1 mã
              </Text>
            ) : (
              <Text style={{ marginLeft: 5, fontSize: 13, color: 'gray' }}>Chọn mã</Text>
            )}
            <Icon3 name="right" size={18} color={appColors.gray}/>
          </View>
        </TouchableOpacity>


        <View style={styles.footer}>
          <View style={{flexDirection: 'row'}}>
            <TextComponent
              text="Tổng tiền: "
              size={16}
              styles={{marginTop: 16}}
            />
            <TextComponent
              text={cart?.result?.totalPrice.toLocaleString('vi-VN') + 'đ'}
              size={16}
              styles={{marginTop: 16}}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => handleOrder()}>
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

export default OrderCartScreen