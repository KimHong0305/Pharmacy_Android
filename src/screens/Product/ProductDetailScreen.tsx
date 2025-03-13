import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../lib/redux/store'
import { RootState } from '../../lib/redux/rootReducer'
import { getProductDetail, clearProductDetail } from '../../lib/redux/reducers/product.reducer'
import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  BenefitsTab,
  IngredientsTab,
  ContraindicationsTab,
  UsageTab,
  InstructionsTab,
  StorageTab,
  NotesTab,
  CompanyTab,
  CategoryTab,
} from '../../components/Product/ProductTabs'
import { fontFamilies } from '../../constants/fontFamilies'
import { ReviewItem } from '../../components/Product/ReviewItem'
import { ProductDetailItem, ProductDetailResponse, } from '../../lib/schemas/product.schema'
import type {NavigationProp} from '../../navigators/index';
import { Price } from '../../lib/schemas/price.schema';
import { addCartGuest, addCartUser, getCartGuest, getCartUser } from '../../lib/redux/reducers/cart.reducer';

const Tab = createMaterialTopTabNavigator()

const reviews = [
  {
    avatar: require('../../assets/images/logo.png'),
    name: 'Nguyễn Văn A',
    time: '2 giờ trước',
    content: 'Sản phẩm rất tốt, đã mua nhiều lần.',
    replies: [
      {
        avatar: require('../../assets/images/logo.png'),
        name: 'Admin',
        time: '1 giờ trước',
        content: 'Cảm ơn bạn đã tin tưởng sản phẩm!',
      }
    ]
  },
  // Thêm các review khác...
];


const ProductDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const dispatch: AppDispatch = useDispatch();

  const [selectedUnit, setSelectedUnit] = useState<Price | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { productDetail, loading, error } = useSelector((state: RootState) => state.product);
  const {token} = useSelector((state : RootState) => state.auth);
  const {cart} = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetail(productId));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetail?.result[0]) {
      setSelectedUnit(productDetail.result[0].price);
    }
  }, [productDetail]);

  const handleAddToCart = () => {
    if (!selectedUnit?.id) {
      console.error('Error: priceId is undefined');
      return;
    }

    const newItem = {
      priceId: selectedUnit?.id,
      quantity
    };

    if(token){
      dispatch(addCartUser(newItem))
        .then(() => Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công'))
        .then(() => dispatch(getCartUser()));
    } else {
      dispatch(addCartGuest(newItem))
        .then(() => Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công'))
        .then(response => {
          console.log('Add to cart response:', response);

          dispatch(getCartGuest())
            .then(cartResponse => {
              console.log('Get cart response:', cartResponse);
            })
            .catch(error => {
              console.error('Error getting cart:', error);
            });
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
        });
    }
  };

  const handleOrderGuest = () => {
    if (!selectedUnit?.id) {
      console.error('Error: priceId is undefined');
      return;
    }

    const newItem = {
      priceId: selectedUnit?.id,
      quantity,
    };

    dispatch(addCartGuest(newItem))
      .then(() => dispatch(getCartGuest()))
      .then(() => navigation.navigate('OrderScreen', {cart: cart}))
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('BottomTab')}>
        <Icon
          name="reply"
          size={23}
          color={appColors.blue}
          style={{marginLeft: 10}}
        />
      </TouchableOpacity>
      <TextComponent text={productDetail?.result[0].name || 'Chi tiết sản phẩm'} size={20} />
    </View>
  );

  if (loading || !productDetail) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={[styles.container, styles.centerContent]}>
          <TextComponent text="Đang tải..." />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={[styles.container, styles.centerContent]}>
          <TextComponent text={`Lỗi: ${error}`} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView}>
        <View style={styles.slider}>
          <Swiper activeDotColor={appColors.blue}>
            {productDetail.result[0].images.map(
              (image: string, index: number) => (
                <View key={index}>
                  <Image source={{uri: image}} style={styles.image} />
                </View>
              ),
            )}
          </Swiper>
        </View>

        <View style={styles.productInfo}>
          <TextComponent
            text={productDetail.result[0].name}
            size={24}
            styles={styles.productName}
          />

          <View style={styles.unitsContainer}>
            {productDetail.result.map((item: ProductDetailItem) => (
              <TouchableOpacity
                key={item.price.id}
                style={[
                  styles.unitButton,
                  selectedUnit?.id === item.price.id && styles.selectedUnit,
                ]}
                onPress={() => setSelectedUnit(item.price)}>
                <TextComponent
                  text={item.price.unit.name}
                  color={
                    selectedUnit?.id === item.price.id
                      ? appColors.white
                      : appColors.text
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          {selectedUnit && (
            <TextComponent
              text={`${selectedUnit.price.toLocaleString()}đ/${
                selectedUnit.unit.name
              }`}
              size={20}
              color={appColors.blue}
              styles={styles.price}
            />
          )}
        </View>

        <View style={styles.tabContainer}>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: styles.tabLabel,
              tabBarIndicatorStyle: {backgroundColor: appColors.blue},
              tabBarStyle: {
                elevation: 0,
                borderBottomWidth: 1,
                borderBottomColor: appColors.gray2,
              },
            }}>
            <Tab.Screen
              name="Lợi ích"
              children={() => (
                <BenefitsTab benefits={productDetail.result[0].benefits} />
              )}
            />
            <Tab.Screen
              name="Thành phần"
              children={() => (
                <IngredientsTab
                  ingredients={productDetail.result[0].ingredients}
                />
              )}
            />
            <Tab.Screen
              name="Chống chỉ định"
              children={() => (
                <ContraindicationsTab
                  contraindication={productDetail.result[0].constraindication}
                />
              )}
            />
            <Tab.Screen
              name="Đối tượng SD"
              children={() => (
                <UsageTab objectUse={productDetail.result[0].object_use} />
              )}
            />
            <Tab.Screen
              name="Hướng dẫn SD"
              children={() => (
                <InstructionsTab
                  instruction={productDetail.result[0].instruction}
                />
              )}
            />
            <Tab.Screen
              name="Bảo quản"
              children={() => (
                <StorageTab preserve={productDetail.result[0].preserve} />
              )}
            />
            <Tab.Screen
              name="Lưu ý"
              children={() => <NotesTab note={productDetail.result[0].note} />}
            />
            <Tab.Screen
              name="Công ty"
              children={() => (
                <CompanyTab company={productDetail.result[0].company} />
              )}
            />
            <Tab.Screen
              name="Danh mục"
              children={() => (
                <CategoryTab category={productDetail.result[0].category} />
              )}
            />
          </Tab.Navigator>
        </View>

        <View style={styles.reviewsSection}>
          <TextComponent
            text="Đánh giá sản phẩm"
            size={18}
            styles={styles.sectionTitle}
          />
          {reviews.map((review, index) => (
            <ReviewItem key={index} {...review} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.addToCartButton]}
          onPress={handleAddToCart}>
          <TextComponent text="Thêm vào giỏ" color={appColors.blue} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buyNowButton]}
          onPress={handleOrderGuest}>
          <TextComponent text="Mua ngay" color={appColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white
  },
  header:{
    height: 30,
    marginTop: 30,
    flexDirection: 'row',
    gap: 20
    //backgroundColor: appColors.black
  },
  slider:{
    height: 200,
    marginHorizontal: 20,
    borderWidth: 1
  },
  image:{
    height: '100%',
    width: '100%',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  unitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  unitButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.gray2,
  },
  selectedUnit: {
    backgroundColor: appColors.blue,
    borderColor: appColors.blue,
  },
  price: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  tabContainer: {
    flex: 1,
    height: 250
  },
  tabLabel: {
    fontFamily: fontFamilies.Medium,
    textTransform: 'none',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  reviewsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 50
  },
  sectionTitle: {
    fontFamily: fontFamilies.Medium,
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: appColors.white,
    borderTopWidth: 1,
    borderTopColor: appColors.gray2,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderColor: appColors.blue,
  },
  buyNowButton: {
    backgroundColor: appColors.blue,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProductDetailScreen