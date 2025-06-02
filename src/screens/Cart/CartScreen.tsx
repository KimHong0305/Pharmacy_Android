import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { fontFamilies } from '../../constants/fontFamilies'
import { getCartGuest, getCartUser, updateCartGuest, updateCartUser } from '../../lib/redux/reducers/cart.reducer'
import { RootState } from '../../lib/redux/rootReducer'
import { AppDispatch } from '../../lib/redux/store'
import { NavigationProp, RootStackParamList } from '../../navigators'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import { Coupon } from '../../lib/schemas/coupon.schema'
//... Text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'CartScreen'>>();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(
    route.params?.selectedCoupon ?? null
  );
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const {cart, loading} = useSelector((state: RootState) => state.cart);
  const {token} = useSelector((state: RootState) => state.auth);

  const totalPrice = cart?.result?.totalPrice ?? 0;
  let finalPrice = totalPrice;

  if (selectedCoupon) {
    const discount = (totalPrice * selectedCoupon.percent) / 100;
    const finalDiscount = discount < selectedCoupon.max ? discount : selectedCoupon.max;
    finalPrice = totalPrice - finalDiscount;
  }

  //Get Cart
  useEffect(() => {
    if (token) {
      dispatch(getCartUser());
    } else {
      dispatch(getCartGuest());
    }
  }, [dispatch, token]);

  // console.log(selectedCoupon);
  
  //Increase Quantity
  const handleIncreaseQuantity = (id: string) => {
    const existingItem = cart?.result?.cartItemResponses.find(item => item.id === id);
    if (existingItem) {
      const updatedItem = {priceId: existingItem.priceId, quantity: 1};
      if (token) {
        dispatch(updateCartUser(updatedItem)).then(() =>
          dispatch(getCartUser()),
        );
      } else {
        dispatch(updateCartGuest(updatedItem)).then(() =>
          dispatch(getCartGuest()),
        );
      }
    }
  }; 

  //Decrease Quantity
  const handleDecreaseQuantity = (id: string) => {
    const existingItem = cart?.result?.cartItemResponses.find(
      item => item.id === id,
    );
    if (existingItem) {
      const updatedItem = {priceId: existingItem.priceId, quantity: -1};
      if (token) {
        dispatch(updateCartUser(updatedItem)).then(() =>
          dispatch(getCartUser()),
        );
      } else {
        dispatch(updateCartGuest(updatedItem)).then(() =>
          dispatch(getCartGuest()),
        );
      }
    }
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextComponent text="Giỏ hàng" size={30} styles={styles.title} />
      </View>
      {loading ? (
        <TextComponent text="Đang tải giỏ hàng" />
      ) : (cart?.result?.cartItemResponses ?? []).length > 0 ? (
        <>
          <View style={styles.body}>
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
                          text={truncateText(item.productName, 25)}
                          size={14}
                        />
                        <View style={{
                          height: 30,
                          width: 40,
                          borderRadius: 10,
                          backgroundColor: appColors.gray2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text>
                            {item.unitName}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                          <Text style={styles.priceText}>
                            {item.price.toLocaleString('vi-VN')}đ
                          </Text>
                          <View style={{flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginRight: 30}}>
                          <TouchableOpacity
                            style={styles.add_sub}
                            onPress={() => handleIncreaseQuantity(item.id)}>
                            <TextComponent
                              text="+"
                              size={15}
                              color={appColors.black}
                            />
                          </TouchableOpacity>
                          <TextComponent
                            text={item.quantity.toString()}
                            size={15}
                            color={appColors.black}
                          />
                          <TouchableOpacity
                            style={styles.add_sub}
                            onPress={() => handleDecreaseQuantity(item.id)}>
                            <TextComponent
                              text="-"
                              size={15}
                              color={appColors.black}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                      
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}
              onPress={() =>
                navigation.navigate('CouponCartScreen', { totalPrice: cart?.result?.totalPrice ?? 0 })
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
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                  <TextComponent
                    text="Tổng tiền: "
                    size={14}
                    styles={{marginTop: 19}}
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('OrderCartScreen', { selectedCoupon: selectedCoupon ?? null })}>
                  <TextComponent text="Thanh Toán" size={16} color='white' styles={{fontWeight:'700'}} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.cart_null}>
            <TextComponent text="Giỏ hàng trống" size={20} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 40,
    marginBottom: 10,
  },
  body: {
    padding: 10,
    flex: 1,
  },
  content: {
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray2,
  },
  text: {
    fontSize: 13
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: appColors.primary,
    fontFamily: fontFamilies.Medium,
  },
  add_sub:{
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: appColors.gray2,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
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
  cart_null: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default CartScreen