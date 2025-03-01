import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { getBestSellers, getCategories, getNewProducts, getTopCompanies } from '../../lib/redux/reducers/home.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import type { NavigationProp } from '../../navigators/index';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const HomeScreen = ({hasToken}: {hasToken: boolean}) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const {categories, bestSellers, newProducts, topCompanies} = useSelector(
    (state: RootState) => state.home,
  );

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBestSellers());
    dispatch(getNewProducts());
    dispatch(getTopCompanies());
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextComponent text="Pharmacy" size={25} />
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="search" size={23} color={appColors.black} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (hasToken) {
              navigation.navigate('ProfileScreen');
            } else {
              navigation.navigate('BottomTab', {screen: 'Tài khoản'});
            }
          }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
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
            {(
              categories.map(item => (
                <TouchableOpacity key={item.id} style={styles.categoryItem}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.categoryImage}
                  />
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))
            )}
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
                onPress={() => navigation.navigate('ProductDetailScreen', {productId: item.id})}>
                <Image 
                  source={{uri: item.image}} 
                  style={styles.productImage} 
                />
                <Text style={styles.productText}>
                  {truncateText(item.name, 20)}
                </Text>
                <Text style={styles.priceText}>
                  {item.prices[0]?.price.toLocaleString('vi-VN')}đ/{item.prices[0]?.unit.name}
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
                onPress={() => navigation.navigate('ProductDetailScreen', {productId: item.id})}>
                <Image 
                  source={{uri: item.image}} 
                  style={styles.productImage} 
                />
                <Text style={styles.productText}>
                  {truncateText(item.name, 20)}
                </Text>
                <Text style={styles.priceText}>
                  {item.prices[0]?.price.toLocaleString('vi-VN')}đ/{item.prices[0]?.unit.name}
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
                <Image 
                  source={{uri: item.image}} 
                  style={styles.companyImage} 
                />
                <Text style={styles.companyText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: '#ccc',
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
    left: -50,
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
    left: -70,
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
    color: appColors.primary,
    fontFamily: fontFamilies.Medium,
  },
  //New Product
  newProductTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 10,
    left: -90,
  },
  //Top Company
  topCompanyTitle: {
    fontFamily: fontFamilies.SemiBold,
    fontSize: 23,
    marginTop: 10,
    left: -85,
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
});

export default HomeScreen;
