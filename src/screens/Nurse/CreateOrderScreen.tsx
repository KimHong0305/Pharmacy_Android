import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import TextComponent from '../../components/TextComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { clearUser, confirmOrderShop, createOrderShop, getUserByPhone, setLatestMessage } from '../../lib/redux/reducers/nurse.reducer';
import { createPaymentMomo, createPaymentZaloPay } from '../../lib/redux/reducers/payment.reducer';
import { createPaymentVNPay } from '../../lib/redux/reducers/vnpay.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { ChatRoomNurse } from '../../lib/schemas/nurse.schemea';
import { NavigationProp } from '../../navigators';

const paymentMethods = [
  {
    label: 'Tiền mặt',
    value: 'CASH',
    icon: require('../../assets/images/payment/COD.png'),
  },
  {
    label: 'Momo',
    value: 'MOMO',
    icon: require('../../assets/images/payment/Momo.png'),
  },
  {
    label: 'VNPay',
    value: 'VNPAY',
    icon: require('../../assets/images/payment/VNPay.png'),
  },
  {
    label: 'ZaloPay',
    value: 'ZALOPAY',
    icon: require('../../assets/images/payment/ZaloPay.png'),
  },
];

interface ProductItem {
  id: string;
  name: string;
  priceId: string;
  unitName: string;
  quantity: number;
  image: string;
  price: number;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function CreateOrderScreen() {
  const [phone, setPhone] = useState('');
  const { user } = useSelector((state: RootState) => state.nurse);
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();

  const PRODUCT_LIST_KEY = 'listProduct';

  const clearOrderData = async () => {
    try {
      await AsyncStorage.removeItem(PRODUCT_LIST_KEY);
      setProductList([]);
      setPhone('');
      dispatch(clearUser());
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
    }
  };

  const saveProductListToStorage = async (list: ProductItem[]) => {
    try {
      await AsyncStorage.setItem(PRODUCT_LIST_KEY, JSON.stringify(list));
    } catch (error) {
      console.error('Lỗi lưu danh sách sản phẩm:', error);
    }
  };

  const loadProductListFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(PRODUCT_LIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProductList(parsed);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách sản phẩm:', error);
    }
  };

  useEffect(() => {
    loadProductListFromStorage();
  }, []);

  const handleSearchUser = async () => {
    if (!phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại.');
      return;
    }
    try {
      await dispatch(getUserByPhone(phone)).unwrap();
    } catch (error: any) {
        Alert.alert('Lỗi: ', error.message);
    }
  }

  const handleIncreaseQuantity = (productId: string) => {
    const updatedList = productList.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setProductList(updatedList);
    saveProductListToStorage(updatedList);
  };

  const handleDecreaseQuantity = (productId: string) => {
    const updatedList = productList.map(item => {
      if (item.id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setProductList(updatedList);
    saveProductListToStorage(updatedList);
  };

  const totalPrice = productList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (!phone || productList.length === 0 || !paymentMethod) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin đơn hàng.');
      return;
    }

    const payload = {
      phone: phone,
      listPrices: productList.map(item => ({
        id: item.priceId,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod,
    };

    console.log(payload);
    const result = await dispatch(createOrderShop(payload)).unwrap();
    AsyncStorage.setItem("lastOrderId", result.result.id);
    if (result.result.paymentMethod === 'VNPAY') {
      try {
        const orderId = result.result.id;
        console.log(orderId);
        const data = await dispatch(
          createPaymentVNPay({orderId}),
        ).unwrap();
        if (data.result) {
          await clearOrderData();
          navigation.navigate('PaymentScreen', {paymentUrl: data.result});
        } else {
          Alert.alert('Không tạo được thanh toán VNPay.');
        }
      } catch (error) {
        console.error('Error creating VNPay payment:', error);
        Alert.alert('Đã xảy ra lỗi khi tạo thanh toán VNPay.');
      }
    } else if (result.result.paymentMethod === 'ZALOPAY') {
      try {
        const orderId = result.result.id;
        console.log(orderId);
        const data = await dispatch(
          createPaymentZaloPay({orderId}),
        ).unwrap();
        if (data.orderurl) {
          await clearOrderData();
          navigation.navigate('PaymentScreen', {paymentUrl: data.orderurl});
        } else {
          Alert.alert('Không tạo được thanh toán ZaloPay.');
        }
      } catch (error) {
        console.error('Error creating VNPay payment:', error);
        Alert.alert('Đã xảy ra lỗi khi tạo thanh toán ZaloPay.');
      }
    } else if (result.result.paymentMethod === 'MOMO') {
      try {
        const orderId = result.result.id;
        console.log(orderId);
        const data = await dispatch(
          createPaymentMomo({orderId}),
        ).unwrap();
        if (data.payUrl) {
          await clearOrderData();
          navigation.navigate('PaymentScreen', {paymentUrl: data.payUrl});
        } else {
          Alert.alert('Không tạo được thanh toán Momo.');
        }
      } catch (error) {
        console.error('Error creating VNPay payment:', error);
        Alert.alert('Đã xảy ra lỗi khi tạo thanh toán Momo.');
      }
    }
    else if (result.result.paymentMethod === 'CASH') {
      try {
        const orderId = result.result.id;
        console.log(orderId);
        const data = await dispatch(
          confirmOrderShop({ orderId, confirm: true }),
        ).unwrap();
        await clearOrderData();
        Alert.alert('Đặt hàng thành công.');
      } catch (error) {
        console.error('Error creating cash:', error);
        Alert.alert('Đã xảy ra lỗi khi tạo thanh toán.');
      }
    } 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TẠO ĐƠN HÀNG</Text>
      </View>

      {/* Nhập số điện thoại */}
      <View style={styles.card}>
        <Text style={styles.title}>1. Nhập số điện thoại người dùng</Text>
        <TextInput
          placeholder="VD: 0912345678"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSearchUser()}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin người dùng */}
      {user && (
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin người dùng</Text>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Họ tên:</Text>
            <Text style={styles.value}>
              {user.lastname} {user.firstname}
            </Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{user.phoneNumber}</Text>
          </View>
        </View>
      )}

      {/* Danh sách sản phẩm */}
      <View style={styles.card}>
        <Text style={styles.title}>2. Danh sách sản phẩm</Text>
        {productList.length === 0 ? (
          <Text style={styles.info}>Chưa có sản phẩm nào được chọn.</Text>
        ) : (
          <View>
            <FlatList
              data={productList}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              renderItem={({item}) => (
                <TouchableOpacity>
                  <View style={styles.item}>
                    <Image source={{uri: item.image}} style={styles.image} />
                    <View style={{width: '70%'}}>
                      <TextComponent
                        text={truncateText(item.name, 25)}
                        size={14}
                      />
                      <View
                        style={{
                          height: 30,
                          width: 40,
                          borderRadius: 10,
                          backgroundColor: appColors.gray2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text>{item.unitName}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.priceText}>
                          {item.price.toLocaleString('vi-VN')}đ
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                          }}>
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
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceText}>Tổng tiền:</Text>
              <Text style={styles.totalPriceValue}>
                {totalPrice.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ChooseProductScreen')}>
          <Text style={styles.addButtonText}>+ Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.card}>
        <Text style={styles.title}>3. Chọn phương thức thanh toán</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.value}
            style={styles.checkboxContainer}
            onPress={() => setPaymentMethod(method.value)}>
            <CheckBox
              checked={paymentMethod === method.value}
              onPress={() => setPaymentMethod(method.value)}
            />
            <Image source={method.icon} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút tạo đơn */}
      <TouchableOpacity
        style={[styles.button, {marginBottom: 40}]}
        onPress={handleCreateOrder}>
        <Text style={styles.buttonText}>Tạo đơn hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.black,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  value: {
    color: '#111',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#007AFF',
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  info: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  addButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  paymentIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  paymentText: {
    fontSize: 15,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray2,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: appColors.primary,
    fontFamily: fontFamilies.Medium,
  },
  add_sub: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: appColors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff3131',
  },
  //Modal
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: appColors.white,
    padding: 15,
    borderRadius: 12,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.black,
  },
  modalDate: {
    fontSize: 12,
    color: appColors.black,
  },
  modalText: {
    fontSize: 14,
    color: appColors.black,
  },
});