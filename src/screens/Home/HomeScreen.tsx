import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';
import { Image } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { appColors } from '../../constants/appColors';

const categories = [
  {
    id: 1,
    name: 'Thuốc',
    image: require('../../assets/images/category/thuoc.png'),
  },
  {
    id: 2,
    name: 'Thực phẩm chức năng',
    image: require('../../assets/images/category/thucphamchucnang.jpg'),
  },
  {
    id: 3,
    name: 'Thiết bị y tế',
    image: require('../../assets/images/category/thietbiyte.jpg'),
  },
  {
    id: 4,
    name: 'Chăm sóc cá nhân',
    image: require('../../assets/images/category/chamsoccanhan.jpg'),
  },
  {
    id: 5,
    name: 'Chăm sóc sắc đẹp',
    image: require('../../assets/images/category/chamsocsacdep.jpg'),
  },
  {
    id: 6, 
    name: 'Mẹ và bé', 
    image: require('../../assets/images/category/mevabe.jpg')
  },
];

const newProducts = [
  {
    id: 1,
    name: 'Dung dịch uống Enterogermina',
    image: require('../../assets/images/topproduct/product1.jpg'),
  },
  {
    id: 2,
    name: 'Khẩu trang mềm mại',
    image: require('../../assets/images/topproduct/product2.jpg'),
  },
  {
    id: 3,
    name: 'Siro Prospan',
    image: require('../../assets/images/topproduct/product3.jpg'),
  },
  {
    id: 4,
    name: 'Men vi sinh BioGaia',
    image: require('../../assets/images/topproduct/product4.jpg'),
  },
  {
    id: 5,
    name: 'Gen hỗ trợ làm giảm sẹo',
    image: require('../../assets/images/topproduct/product5.jpg'),
  },
  {
    id: 6,
    name: 'Dung dịch LIVESPO Clausy',
    image: require('../../assets/images/topproduct/product6.jpg'),
  },
  {
    id: 7,
    name: 'Xịt keo ong xanh vị bạc',
    image: require('../../assets/images/topproduct/product7.jpg'),
  },
  {
    id: 8,
    name: 'Viên uống OPTIBAC Intimate Flora',
    image: require('../../assets/images/topproduct/product8.jpg'),
  },
  {
    id: 9,
    name: 'Khẩu trang y tế Pharmacy',
    image: require('../../assets/images/topproduct/product9.jpg'),
  },
  {
    id: 10,
    name: 'Khẩu trang y tế 3 lớp màu trắng',
    image: require('../../assets/images/topproduct/product10.jpg'),
  },
];

const topProducts = [
  {
    id: 1,
    name: 'Dung dịch uống Enterogermina',
    image: require('../../assets/images/topproduct/product1.jpg'),
  },
  {
    id: 2,
    name: 'Khẩu trang mềm mại',
    image: require('../../assets/images/topproduct/product2.jpg'),
  },
  {
    id: 3,
    name: 'Siro Prospan',
    image: require('../../assets/images/topproduct/product3.jpg'),
  },
  {
    id: 4,
    name: 'Men vi sinh BioGaia',
    image: require('../../assets/images/topproduct/product4.jpg'),
  },
  {
    id: 5,
    name: 'Gen hỗ trợ làm giảm sẹo',
    image: require('../../assets/images/topproduct/product5.jpg'),
  },
  {
    id: 6,
    name: 'Dung dịch LIVESPO Clausy',
    image: require('../../assets/images/topproduct/product6.jpg'),
  },
  {
    id: 7,
    name: 'Xịt keo ong xanh vị bạc',
    image: require('../../assets/images/topproduct/product7.jpg'),
  },
  {
    id: 8,
    name: 'Viên uống OPTIBAC Intimate Flora',
    image: require('../../assets/images/topproduct/product8.jpg'),
  },
  {
    id: 9,
    name: 'Khẩu trang y tế Pharmacy',
    image: require('../../assets/images/topproduct/product9.jpg'),
  },
  {
    id: 10,
    name: 'Khẩu trang y tế 3 lớp màu trắng',
    image: require('../../assets/images/topproduct/product10.jpg'),
  },
];

const topCompanies = [
  {
    id: 1,
    name: 'Swisse',
    image: require('../../assets/images/topcompany/company1.jpg'),
  },
  {
    id: 2,
    name: 'Remos',
    image: require('../../assets/images/topcompany/company2.jpg'),
  },
  {
    id: 3,
    name: 'Sanofi',
    image: require('../../assets/images/topcompany/company3.jpg'),
  },
  {
    id: 4,
    name: 'Abbott',
    image: require('../../assets/images/topcompany/company4.jpg'),
  },
  {
    id: 5,
    name: 'Rohto',
    image: require('../../assets/images/topcompany/company5.jpg'),
  },
  {
    id: 6,
    name: 'ImexPharm',
    image: require('../../assets/images/topcompany/company6.jpg'),
  },
  {
    id: 7,
    name: 'Efferalgan',
    image: require('../../assets/images/topcompany/company7.jpg'),
  },
  {
    id: 8,
    name: 'JohnSon',
    image: require('../../assets/images/topcompany/company8.jpg'),
  },
  {
    id: 9,
    name: 'EnfaGrow',
    image: require('../../assets/images/topcompany/company9.jpg'),
  },
  {
    id: 10,
    name: 'Kotex',
    image: require('../../assets/images/topcompany/company10.jpg'),
  },
];

const HomeScreen = ({hasToken}: {hasToken: boolean}) => {
  const navigation = useNavigation();
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextComponent text="Pharmacy" size={25} />

        {/* Thanh search */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
            <TextInput
              placeholder="Search"
              style={styles.input}
              placeholderTextColor="#999"
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.icon} 
            onPress={() => navigation.navigate('SearchScreen')}
          >
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
            <Swiper activeDotColor={appColors.white}>
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
              <View key={item.id} style={styles.categoryItem}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </View>
            ))}
          </View>
          {/* Top 10 Product */}
          <Text style={styles.topProductTitle}>Sản phẩm nổi bật</Text>
          <FlatList
            data={topProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.productItem}>
                <Image source={item.image} style={styles.productImage} />
                <Text style={styles.productText}>{item.name}</Text>
              </View>
            )}
          />
          {/* New Product */}
          <Text style={styles.newProductTitle}>Sản phẩm mới</Text>
          <FlatList
            data={topProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.productItem}>
                <Image source={item.image} style={styles.productImage} />
                <Text style={styles.productText}>{item.name}</Text>
              </View>
            )}
          />
          {/* Top 10 Company */}
          <Text style={styles.topCompanyTitle}>Công ty nổi bật</Text>
          <FlatList
            data={topCompanies}
            horizontal
            showsHorizontalScrollIndicator={true}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.companyItem}>
                <Image source={item.image} style={styles.companyImage} />
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
    textAlign: 'center'
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
    textAlign: 'center'
  },
});

export default HomeScreen;
