import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { fontFamilies } from '../../constants/fontFamilies'
import { getCartGuest, getCartUser, updateCartGuest, updateCartUser } from '../../lib/redux/reducers/cart.reducer'
import { RootState } from '../../lib/redux/rootReducer'
import { AppDispatch } from '../../lib/redux/store'
import { NavigationProp } from '../../navigators'

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const {cart, loading} = useSelector((state: RootState) => state.cart);
  const {token} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getCartUser());
    } else {
      dispatch(getCartGuest());
    }
  }, [dispatch, token]);
  
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
        <TextComponent text="Cart" size={30} styles={styles.title} />
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
                        <TouchableOpacity
                          style={styles.add_sub}
                          onPress={() => handleIncreaseQuantity(item.id)}>
                          <TextComponent
                            text="+"
                            size={20}
                            color={appColors.black}
                          />
                        </TouchableOpacity>
                        <TextComponent
                          text={item.quantity.toString()}
                          size={20}
                          color={appColors.black}
                        />
                        <TouchableOpacity
                          style={styles.add_sub}
                          onPress={() => handleDecreaseQuantity(item.id)}>
                          <TextComponent
                            text="-"
                            size={20}
                            color={appColors.black}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.footer}>
              <View style={{flexDirection: 'row'}}>
                <TextComponent
                  text="Tổng tiền: "
                  size={16}
                  styles={{marginTop: 16, marginLeft: 10}}
                />
                <TextComponent
                  text={cart?.result.totalPrice.toString() || '0'}
                  size={16}
                  styles={{marginTop: 16}}
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('OrderScreen')}>
                <TextComponent text="Thanh Toán" size={16} />
              </TouchableOpacity>
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
    backgroundColor: appColors.white
  },
  header: {
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 30,
    marginLeft: 20,
  },
  body: {
    alignSelf: 'center',
    height: '100%',
    width: '90%',
    marginTop: 10
  },
  content: {
    height: '75%',
    borderRadius: 20
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray
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
    fontSize: 13
  },
  priceText: {
    marginTop: 5,
    fontSize: 13,
    color: appColors.primary,
    fontFamily: fontFamilies.Medium,
  },
  add_sub:{
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: appColors.gray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer:{
    marginTop: 10,
    flexDirection: 'row',
    gap: 100
  },
  button: {
    height: 35,
    width: 120,
    borderRadius: 10,
    backgroundColor: appColors.blue,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10
  },
  cart_null: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default CartScreen