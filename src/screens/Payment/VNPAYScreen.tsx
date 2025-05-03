import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const VNPAYScreen = () => {
  const route = useRoute();
  
  const {paymentUrl} = route.params as {paymentUrl : string};
  
  console.log('VNPAYScreen: ', paymentUrl);
  return (
    <View style={styles.container}>
      <WebView source={{uri: paymentUrl}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VNPAYScreen