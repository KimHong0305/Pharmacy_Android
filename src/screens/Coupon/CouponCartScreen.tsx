import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CheckBox } from 'react-native-elements';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { getCouponUser } from '../../lib/redux/reducers/coupon.reducer';
import { Coupon } from '../../lib/schemas/coupon.schema';

const CouponCartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch();
  const { coupons } = useSelector((state: RootState) => state.coupon);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const route = useRoute();
  const { totalPrice } = route.params as { totalPrice: number };
  
  useEffect(() => {
    dispatch(getCouponUser());
  }, [dispatch]);

  const handleSelectCoupon = (coupon: Coupon) => {
    if (totalPrice >= coupon.orderRequire) {
      setSelectedCoupon(coupon.id === selectedCoupon?.id ? null : coupon);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Chọn mã giảm giá</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {coupons.map((item) => {
          const isDisabled = totalPrice < item.orderRequire;

          return (
            <View key={item.id} style={[styles.card, isDisabled && styles.disabledCard]}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.expire}>HSD: {item.expireDate}</Text>
                {isDisabled && <Text style={styles.notEligible}>Không đủ điều kiện</Text>}
              </View>
              
              <CheckBox
                checked={selectedCoupon?.id === item.id}
                onPress={() => handleSelectCoupon(item)}
                checkedColor="blue"
                containerStyle={{ padding: 0, margin: 0 }}
                disabled={isDisabled}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Áp dụng"
          onPress={() => {
            navigation.navigate('BottomTab', { 
              screen: 'Giỏ hàng', 
              params: { selectedCoupon: selectedCoupon } 
            });            
          }}                
          disabled={!selectedCoupon}
          buttonStyle={styles.applyButton}
        />
      </View>
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
  disabledCard: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
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
  notEligible: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 12,
  },
});

export default CouponCartScreen;
