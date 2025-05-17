import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import { appColors } from '../../constants/appColors';

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
  image: string;
  quantity: number;
}

export default function CreateOrderScreen() {
  const [phone, setPhone] = useState('');
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin người dùng */}
      {userInfo && (
        <View style={styles.card}>
          <Text style={styles.title}>2. Thông tin người dùng</Text>
          <Text style={styles.info}>👤 Họ tên: {userInfo.name}</Text>
          <Text style={styles.info}>📞 SĐT: {userInfo.phone}</Text>
        </View>
      )}

      {/* Danh sách sản phẩm */}
      <View style={styles.card}>
        <Text style={styles.title}>2. Danh sách sản phẩm</Text>
        {productList.length === 0 ? (
          <Text style={styles.info}>Chưa có sản phẩm nào được chọn.</Text>
        ) : (
          productList.map((item, index) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{uri: item.image}} style={styles.productImage} />
              <View style={{flex: 1}}>
                <Text style={styles.productName}>{item.name}</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={item.quantity.toString()}
                  placeholder="Số lượng"
                />
              </View>
            </View>
          ))
        )}
        <TouchableOpacity style={styles.addButton}>
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
      <TouchableOpacity style={[styles.button, {marginBottom: 40}]}>
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 100,
    backgroundColor: '#F0F0F0',
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
});
