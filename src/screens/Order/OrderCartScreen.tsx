import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/FontAwesome6';
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
import { Coupon } from '../../lib/schemas/coupon.schema';
import { CheckBox } from 'react-native-elements';

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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(
    route.params?.selectedCoupon ?? null
  );

  const handleCheckboxChange = (method: 'CASH' | 'MOMO' | 'VNPAY' | 'ZALOPAY') => {
    if (paymentMethod === method) {
      setPaymentMethod('');
    } else {
      setPaymentMethod(method);
    }
  };
  
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
            orderUser.couponId = selectedCoupon.id;
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

  const totalPrice = cart?.result?.totalPrice ?? 0;
  let finalPrice = totalPrice;

  if (selectedCoupon) {
    const discount = (totalPrice * selectedCoupon.percent) / 100;
    const finalDiscount = discount < selectedCoupon.max ? discount : selectedCoupon.max;
    finalPrice = totalPrice - finalDiscount;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTab', {screen: 'Giỏ hàng'})}>
          <Icon4 name="arrow-left" size={25} />
        </TouchableOpacity>
        <TextComponent text="Thanh Toán" size={25} styles={{marginLeft: 20}} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}
      style={styles.body}>
        <View style={styles.address}>
          <Icon5 name='location-dot' size={20} color={'#ed7532'}/>
          <View style={{flexDirection:'column', marginLeft: 10, gap: 5}}>
            <View style={{flexDirection:'row'}}>
              <TextComponent
                text={addressData.fullname}
                size={15}
                styles={{fontWeight:'700'}}
              />
              <TextComponent
                text={`(+84) ${addressData.phone}`}
                color="gray"
                styles={{ marginLeft: 10 }}
              />

            </View>
            <View style={{flexDirection: 'row'}}>
              <View>
              <TextComponent
                  text={
                    addressData.address
                  }
                  size={13}
              />
              <TextComponent
                  text={
                    addressData.villageName
                  }
                  size={13}
              />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleClickAddress} style={{marginTop: 10, marginRight: 10}}>
              <Icon name="arrow-forward-ios" size={20} color={appColors.black} />
            </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <FlatList
            data={cart?.result?.cartItemResponses}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity>
                <View style={styles.item}>
                  <Image source={{uri: item.image}} style={styles.image} />
                  <View>
                    <TextComponent
                      text={truncateText(item.productName, 30)}
                      size={13}
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
                      text={`x ${item.quantity.toString()}`}
                      size={15}
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
            text="Phương thức thanh toán"
            size={15}
            color={appColors.black}
            styles={{
              marginTop: 10,
              marginLeft: 20,
              fontFamily: fontFamilies.SemiBold,
            }}
          />
          {/* Tiền mặt */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={paymentMethod === 'CASH'}
              onPress={() => handleCheckboxChange('CASH')}
            />
            <Image source={require('../../assets/images/payment/COD.png')} style={styles.payment} />
            <TextComponent text="Tiền mặt" size={15} />
          </View>

          {/* Momo */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={paymentMethod === 'MOMO'}
              onPress={() => handleCheckboxChange('MOMO')}
            />
            <Image source={require('../../assets/images/payment/Momo.png')} style={styles.payment} />
            <TextComponent text="Momo" size={15} />
          </View>

          {/* VNPay */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={paymentMethod === 'VNPAY'}
              onPress={() => handleCheckboxChange('VNPAY')}
            />
            <Image source={require('../../assets/images/payment/VNPay.png')} style={styles.payment} />
            <TextComponent text="VNPay" size={15} />
          </View>

          {/* ZaloPay */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={paymentMethod === 'ZALOPAY'}
              onPress={() => handleCheckboxChange('ZALOPAY')}
            />
            <Image source={require('../../assets/images/payment/ZaloPay.png')} style={styles.payment} />
            <TextComponent text="ZaloPay" size={15} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
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
          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <TextComponent
                text="Tổng tiền: "
                size={16}
                styles={{marginTop: 16}}
              />
              {selectedCoupon? (
                    <>
                    <TextComponent
                      text={`${finalPrice.toLocaleString('vi-VN')}đ`}
                      size={20}
                      color='red'
                      styles={{marginTop: 12, fontWeight:'700'}}
                    />
                    <TextComponent
                      text={`${totalPrice.toLocaleString('vi-VN')}đ`}
                      size={14}
                      color='gray'
                      styles={{marginLeft: 8, marginTop: 19, fontWeight:'500', textDecorationLine:'line-through'}}
                    />
                    </>
                  ):(
                  <TextComponent
                      text={`${totalPrice.toLocaleString('vi-VN')}đ`}
                      size={20}
                      color='red'
                      styles={{marginTop: 12, fontWeight:'700'}}
                    />
                  )
                }
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleOrder()}>
              <TextComponent text="Thanh Toán" size={16} color='white' styles={{fontWeight:'700'}}/>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    paddingTop: 30,
    paddingLeft: 20,
    backgroundColor: appColors.white,
  },
  body: {
    marginTop: 10,
  },
  address: {
    backgroundColor: appColors.white,
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  content: {
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: appColors.white,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.gray2
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray2,
    marginRight: 10
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
  payment_method: {
    marginTop: 20,
    marginBottom: 100,
    borderRadius: 20,
    backgroundColor: appColors.white,
    marginHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    backgroundColor: appColors.white,
    marginHorizontal: 10,
    paddingVertical: 20,
  },
  button: {
    height: 35,
    width: 120,
    borderRadius: 10,
    backgroundColor: appColors.blue,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems:'center',
  },
  payment: {
    width: 30,
    height: 30,
    marginRight: 10
  }
});

export default OrderCartScreen