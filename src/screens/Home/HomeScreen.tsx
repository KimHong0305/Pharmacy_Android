import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { getHome } from '../../lib/redux/reducers/home.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { Notification } from '../../lib/schemas/notification.schema';
import type { NavigationProp } from '../../navigators/index';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const {categories, bestSellers, newProducts, topCompanies} = useSelector(
    (state: RootState) => state.home,
  );
  const {token} = useSelector((state: RootState) => state.auth);
  const [notificationCount, setNotificationCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  //Lay du lieu cho cac slider
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getHome())
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [dispatch]);
  
  //Ket noi websocket
  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket('ws://10.0.2.2:8080/api/v1/pharmacy/ws-notifications');

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = event => {
      console.log('📨 Raw message:', event); // 👈 Log toàn bộ event
      console.log('📨 Data:', event.data); // 👈 Log dữ liệu nhận được
      try {
        const notification : Notification = JSON.parse(event.data);
        setNotificationCount(prev => prev + 1);
        setLatestNotification(notification);
        setModalVisible(true);

         // Tự động tắt modal sau 3 giây
        setTimeout(() => {
          setModalVisible(false);
        }, 3000);
      } catch (error) {
        console.error('❌ Error parsing message', error);
      }
    };

    socket.onerror = error => {
      console.error('❌ WebSocket error', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);
      
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/avata_1.png')} 
        style={styles.avatar}/>

        {/* Thanh search */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
            <TextInput
              placeholder="Tìm kiếm / Tra cứu"
              style={styles.input}
              placeholderTextColor="#999"
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.navigate('SearchScreen')}>
            <Icon name="search" size={23} color={appColors.black} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (token) {
              navigation.navigate('NotificationScreen');
              setNotificationCount(0);
            } else {
              navigation.navigate('BottomTab', {
                screen: 'Tài khoản',
                params: {},
              });
            }
          }}
          style={{marginTop: 8, marginLeft: 8, position: 'relative'}}>
          <View style={{position: 'relative'}}>
            <Icon name="bell" size={22} color={appColors.black} />

            {notificationCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  minWidth: 15,
                  height: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {/* Body */}
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.slider}>
            <Swiper
              activeDotColor={appColors.white}
              autoplay={true}
              autoplayTimeout={3}>
              <Image
                source={require('../../assets/images/Banner1.jpg')}
                style={styles.banner}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/images/Banner2.jpg')}
                style={styles.banner}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/images/Banner3.jpg')}
                style={styles.banner}
                resizeMode="cover"
              />
            </Swiper>
          </View>
          {/* List Category */}
          <Text style={styles.categoryTitle}>Danh mục sản phẩm</Text>
          <View style={styles.categoryContainer}>
            {categories.map(item => (
              <TouchableOpacity key={item.id} style={styles.categoryItem}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </View>

                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Top 10 Product */}
          <Text style={styles.topProductTitle}>Sản phẩm nổi bật</Text>
          <FlatList
            data={bestSellers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() =>
                  navigation.navigate('ProductDetailScreen', {
                    productId: item.id,
                  })
                }>
                <Image source={{uri: item.image}} style={styles.productImage} />
                <Text style={styles.productText}>
                  {truncateText(item.name, 20)}
                </Text>
                <Text style={styles.priceText}>
                  {item.prices[0]?.price.toLocaleString('vi-VN')}đ/
                  {item.prices[0]?.unit.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          {/* New Product */}
          <Text style={styles.newProductTitle}>Sản phẩm mới</Text>
          <FlatList
            data={newProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() =>
                  navigation.navigate('ProductDetailScreen', {
                    productId: item.id,
                  })
                }>
                <Image source={{uri: item.image}} style={styles.productImage} />
                <Text style={styles.productText}>
                  {truncateText(item.name, 20)}
                </Text>
                <Text style={styles.priceText}>
                  {item.prices[0]?.price.toLocaleString('vi-VN')}đ/
                  {item.prices[0]?.unit.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          {/* Top Company */}
          <Text style={styles.topCompanyTitle}>Công ty nổi bật</Text>
          <FlatList
            data={topCompanies}
            horizontal
            showsHorizontalScrollIndicator={true}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.companyItem}>
                <Image source={{uri: item.image}} style={styles.companyImage} />
                <Text style={styles.companyText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
      {latestNotification && (
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {latestNotification.image && (
                  <Image
                    source={{uri: latestNotification.image}}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.modalTitle}>
                    {latestNotification.title}
                  </Text>
                  <Text style={styles.modalDate}>
                    {latestNotification.createDate}
                  </Text>
                </View>
              </View>
              <Text style={styles.modalText}>{latestNotification.content}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Header
  header: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    backgroundColor: '#FFF',
    marginTop: 40,
    justifyContent: 'center',
    alignContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 230,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontFamily: fontFamilies.Medium,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    textAlign: 'left',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderColor: '#00BFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Body
  body: {
    flex: 1,
    alignItems: 'center',
  },
  //Banner
  slider: {
    width: '90%',
    height: 150,
    backgroundColor: '#EBEB13',
    borderRadius: 25,
    marginTop: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  // List Category
  categoryTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 20,
    left: -40,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  //Top Product
  topProductTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 10,
    left: -60,
  },
  productItem: {
    width: 100,
    margin: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    height: 40,
    width: '100%',
  },
  priceText: {
    marginTop: 5,
    fontSize: 13,
    color: appColors.black,
    fontFamily: fontFamilies.Medium,
    fontWeight: 'bold',
  },
  //New Product
  newProductTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 10,
    left: -80,
  },
  //Top Company
  topCompanyTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 10,
    left: -75,
  },
  companyItem: {
    width: 100,
    margin: 10,
    alignItems: 'center',
  },
  companyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  companyText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
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

export default HomeScreen;
