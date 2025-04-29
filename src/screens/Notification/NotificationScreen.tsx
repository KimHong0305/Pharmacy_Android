import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { getCouponUser } from '../../lib/redux/reducers/coupon.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { NavigationProp } from '../../navigators';

const NotificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const dispatch: AppDispatch = useDispatch();
  const {coupons} = useSelector((state: RootState) => state.coupon);

  useEffect(() => {
    dispatch(getCouponUser());
  }, [dispatch]);

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('BottomTab')}>
            <Icon name="arrow-left" size={25} />
          </TouchableOpacity>
          <Text style={styles.title}>Thông báo</Text>
        </View>
  
        <ScrollView contentContainerStyle={styles.list}>
          {coupons.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.expire}>HSD: {item.expireDate}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 50,
      },
      header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          marginBottom: 20,
      },
      title: {
          fontSize: 20,
          fontWeight: '500',
          marginLeft: 20,
      },
      list: {
          paddingHorizontal: 20,
          paddingBottom: 20,
      },
      card: {
          flexDirection: 'row',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#d9d9d9',
      },
      image: {
          width: 60,
          height: 60,
          borderRadius: 10,
      },
      info: {
          flex: 1,
          marginLeft: 15,
      },
      name: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
      },
      description: {
          fontSize: 14,
          color: '#555',
          marginBottom: 5,
      },
      expire: {
          fontSize: 12,
          color: 'red',
      },
});

export default NotificationScreen