import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { NavigationProp } from '../../navigators';
import { useDispatch } from 'react-redux';
import { updateCallBack } from '../../lib/redux/reducers/payment.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '../../lib/redux/store';

const parseQueryParams = (url: string): Record<string, string> => {
  const queryString = url.split('?')[1] || '';
  const params: Record<string, string> = {};

  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      params[key] = decodeURIComponent(value || '');
    }
  });

  return params;
};

const CustomPaymentResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { callbackUrl } = route.params as { callbackUrl: string };

  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    orderInfo: '',
    responseCode: '',
    transactionNo: '',
    orderId: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const params = parseQueryParams(callbackUrl);
  
      let paymentMethod = '';
      let isSuccess = false;
      let amount = 0;
      let orderInfo = '';
      let transactionNo = '';
      let code = '';
      const orderId = await AsyncStorage.getItem('lastOrderId');
  
      // === ZALOPAY ===
      if (params.hasOwnProperty('appid')) {
        paymentMethod = 'ZaloPay';
        amount = Number(params.amount || 0);
        transactionNo = params.apptransid || '';
        isSuccess = params.status === '1';
        code = params.status;
      }
  
      // === VNPAY ===
      else if (params.hasOwnProperty('vnp_Amount')) {
        paymentMethod = 'VNPay';
        amount = Number(params.vnp_Amount || 0) / 100;
        transactionNo = params.vnp_TransactionNo || '';
        isSuccess = params.vnp_ResponseCode === '00';
        code = params.vnp_ResponseCode;
      }
  
      // === MOMO ===
      else if (params.hasOwnProperty('partnerCode')) {
        paymentMethod = 'MoMo';
        amount = Number(params.amount || 0);
        transactionNo = params.transId || '';
        isSuccess = params.errorCode === '0';
        code = params.errorCode;
      }
  
      setPaymentInfo({
        amount,
        orderInfo,
        responseCode: isSuccess ? '0' : '1',
        transactionNo,
        orderId: orderId || '',
      });
  
      setIsSuccess(isSuccess);
  
      if (orderId && code !== '') {
        dispatch(updateCallBack({ code, orderId }));
      }
    };
  
    handleCallback();
  }, [callbackUrl, dispatch]);  

  const copyToClipboard = () => {
    if (paymentInfo.orderId) {
      Clipboard.setString(paymentInfo.orderId);
      Alert.alert('Đã sao chép', `Mã đơn hàng: ${paymentInfo.orderId}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {isSuccess ? (
          <View style={styles.successContainer}>
            <Icon name="checkmark-circle" size={80} color="green" />
            <Text style={styles.title}>Thanh toán thành công!</Text>
          </View>
        ) : (
          <View style={styles.failureContainer}>
            <Icon name="close-circle" size={80} color="red" />
            <Text style={styles.title}>Thanh toán thất bại</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.label}>Mã giao dịch:</Text>
          <Text style={styles.value}>{paymentInfo.transactionNo}</Text>

          <Text style={styles.label}>Số tiền:</Text>
          <Text style={styles.value}>
            {paymentInfo.amount.toLocaleString()} VNĐ
          </Text>

          <Text style={styles.label}>Nội dung:</Text>
          <Text style={styles.value}>{paymentInfo.orderInfo}</Text>

          {paymentInfo.orderId ? (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}>
              <Icon name="copy-outline" size={18} color="#007bff" />
              <Text style={styles.copyButtonText}>Sao chép mã đơn hàng</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Quay về trang chủ"
            onPress={async () => {
              const role = await AsyncStorage.getItem('role');
              if (role === 'NURSE') {
                navigation.navigate('BottomTabNurse');
              } else {
                navigation.navigate('BottomTab');
              }
            }}
            color={isSuccess ? 'green' : 'red'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  failureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  info: {
    marginTop: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 24,
  },
  copyButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonText: {
    marginLeft: 6,
    color: '#007bff',
    fontSize: 16,
  },
});

export default CustomPaymentResultScreen;
