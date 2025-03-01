import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, Button } from 'react-native'
import React from 'react'
import { TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import Icon  from 'react-native-vector-icons/FontAwesome'
import { fontFamilies } from '../../constants/fontFamilies'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '../../navigators'

const carts = [
  {
    id: 1,
    name: 'Thuốc nhỏ mắt',
    image: require('../../assets/images/product/product1.jpg'),
    price: 100000,
    unit: 'Hộp'
  },
  {
    id: 2,
    name: 'Khẩu trang',
    image: require('../../assets/images/product/product2.jpg'),
    price: 100000,
    unit: 'Hộp'
  },
  {
    id: 3,
    name: 'Thuốc ho',
    image: require('../../assets/images/product/product3.jpg'),
    price: 100000,
    unit: 'Hộp'
  },
  {
    id: 4,
    name: 'Thuốc tiêu hoá',
    image: require('../../assets/images/product/product4.jpg'),
    price: 100000,
    unit: 'Hộp'
  },
]
const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextComponent text="Cart" size={30} styles={styles.title} />
      </View>
      <View style={styles.body}>
        <View style={styles.address}>
          <TextComponent
            text="Địa chỉ nhận hàng"
            size={16}
            styles={{marginTop: 10, marginLeft: 10}}
          />
          <View style={{flexDirection: 'row'}}>
            <TextComponent
              text="45/7 đường số 4, Tam Hà, Thủ Đức"
              size={13}
              styles={{padding: 10}}
            />
            <TouchableOpacity>
              <Icon
                name="edit"
                size={23}
                color={appColors.black}
                style={{marginTop: 5, marginLeft: 80}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={carts}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity>
                <View style={styles.item}>
                  <Image source={item.image} style={styles.image} />
                  <View>
                    <TextComponent text={item.name} size={16} />
                    <Text style={styles.priceText}>
                      {item.price.toLocaleString('vi-VN')}đ/{item.unit}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 5,
                      flexDirection: 'row',
                      gap: 10
                    }}>
                    <TouchableOpacity style={styles.add_sub}>
                      <TextComponent
                        text="+"
                        size={20}
                        color={appColors.black}
                      />
                    </TouchableOpacity>
                    <TextComponent text='1' size={20} color={appColors.black}/>
                    <TouchableOpacity style={styles.add_sub}>
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
              styles={{marginTop: 16}}
            />
            <TextComponent text="400.000đ" size={16} styles={{marginTop: 16}} />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderScreen')}>
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
    marginTop: 10,
  },
  address: {
    height: '15%',
    backgroundColor: appColors.gray2,
    borderRadius: 20,
  },
  content: {
    marginTop: 20,
    height: '60%',
    borderRadius: 20,
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
    marginLeft: -15
  }
});
export default CartScreen