import {View, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useRoute, useNavigation} from '@react-navigation/native';
import { NavigationProp } from '../../navigators';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const {paymentUrl} = route.params as {paymentUrl: string};

  const [isHandled, setIsHandled] = useState(false);

  const handleWebViewError = (syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent;
    const url = nativeEvent.url;

    if (!isHandled) {
      setIsHandled(true);
      console.log('Payment Error URL:', url);

      // Chuyển sang màn hình tùy chỉnh và truyền URL
      navigation.navigate('CustomPaymentResultScreen', {
        callbackUrl: url,
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView source={{uri: paymentUrl}} onError={handleWebViewError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
