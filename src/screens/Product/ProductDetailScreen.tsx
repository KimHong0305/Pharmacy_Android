import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { TextComponent } from '../../components';
import {
  BenefitsTab,
  CategoryTab,
  CompanyTab,
  ContraindicationsTab,
  IngredientsTab,
  InstructionsTab,
  NotesTab,
  StorageTab,
  UsageTab,
} from '../../components/Product/ProductTabs';
import { ReviewItem } from '../../components/Product/ReviewItem';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { addCartGuest, addCartUser, getCartGuest, getCartUser } from '../../lib/redux/reducers/cart.reducer';
import { getProductDetail } from '../../lib/redux/reducers/product.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { Price } from '../../lib/schemas/price.schema';
import { ProductDetailItem } from '../../lib/schemas/product.schema';
import type { NavigationProp } from '../../navigators/index';
import { getReplayListFeedBackByProductId, getRootListFeedBackByProductId } from '../../lib/redux/reducers/feedback.reducer';
import { addWhistlist } from '../../lib/redux/reducers/whistlist.reducer';

const Tab = createMaterialTopTabNavigator()

const ProductDetailScreen = () => {
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const dispatch: AppDispatch = useDispatch();
  const [selectedUnit, setSelectedUnit] = useState<Price | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { productDetail, loading, error } = useSelector((state: RootState) => state.product);
  const {token} = useSelector((state : RootState) => state.auth);
  const {listRootFeedBackByProductId, listReplayFeedBackByProductId} = useSelector((state : RootState) => state.feedback);
  const [whistlist, setWhistlist] = useState<string | null>(null);

  //Get Product Detail
  useEffect(() => {
    dispatch(getProductDetail(productId));
  }, [dispatch, productId]);


  //console.log(feedbacks)
  
  //Get First Price
  useEffect(() => {
    if (productDetail?.result[0]) {
      setSelectedUnit(productDetail.result[0].price);
    }
  }, [productDetail]);

  //Get Root Feedback 
  useEffect(() => {
    dispatch(getRootListFeedBackByProductId(productId))
  }, [productId])

  //Get Reply Feedback
  useEffect(() => {
    if ((listRootFeedBackByProductId?.result ?? []).length > 0) {
      listRootFeedBackByProductId?.result.forEach(item => {
        dispatch(getReplayListFeedBackByProductId(item.id))
      });
    }
  }, [listRootFeedBackByProductId]);


  //Add to Cart
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
        .then(() => dispatch(getCartGuest()))
    }
  };

  //Order
  const handleOrder = async () => {
    if (!selectedUnit?.id) {
      console.error('Error: priceId is undefined');
      return;
    }

    const priceId = selectedUnit?.id
    const product = productDetail?.result.find(item => item.price.id == priceId)

    if (!product) {
      console.error('Error: product is undefined');
      return;
    }
    
    navigation.navigate('OrderHomeScreen', {product});
  };

  const handleAddWhistlist = async () => {
    if(token){
      dispatch(addWhistlist(productId))
        .then(() => Alert.alert('Thông báo', 'Thêm vào yêu thích thành công'))
        .then(() => setWhistlist('have'))
    } else {
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm yêu thích')
    }
  }

  if (loading || !productDetail) {
    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.centerContent]}>
          <TextComponent text="Đang tải..." />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.centerContent]}>
          <TextComponent text={`Lỗi: ${error}`} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTab', {screen: 'Trang chủ'})}>
          <Icon2 name="arrow-left" size={25} style={{marginLeft: 20}}/>
        </TouchableOpacity>
        {/* <TextComponent text={productDetail?.result[0].name || 'Chi tiết sản phẩm'} size={20} /> */}
      </View>
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
          {(listRootFeedBackByProductId?.result ?? []).length > 0 ? (
            <>
              {listRootFeedBackByProductId?.result.map(item => {
                const replies = listReplayFeedBackByProductId?.result?.filter(
                    reply => reply.parent?.id === item.id,
                  ) || [];
                return <ReviewItem key={item.id} {...item} replies={replies} />;
              })}
            </>
          ) : (
            <>
              <TextComponent
                text="Chưa có đánh giá nào"
                size={15}
                color="red"
                styles={{marginBottom: 30}}
              />
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.addToWhistList]}
        onPress={handleAddWhistlist}>
          {whistlist? (
          <>
            <Icon name="heart" size={25} color={'#FF4C4C'}/>
          </>
          ):(
          <Icon name="heart-o" size={25} color={'#FF4C4C'}/>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button2, styles.addToCartButton]}
          onPress={handleAddToCart}>
          <TextComponent text="Thêm vào giỏ" color={appColors.blue} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button2, styles.buyNowButton]}
          onPress={handleOrder}>
          <TextComponent text="Mua ngay" color={appColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingBottom: 20,
  },
  header:{
    height: 30,
    marginTop: 30,
    flexDirection: 'row',
    gap: 20
    //backgroundColor: appColors.black
  },
  slider:{
    height: 400,
    marginHorizontal: 20
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
    justifyContent: 'center',
    padding: 15,
    backgroundColor: appColors.white,
    borderTopWidth: 1,
    borderTopColor: appColors.gray2,
    gap: 10,
  },
  button: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 'auto',
  },
  addToWhistList: {
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderColor: appColors.blue,
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
  button2: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
})

export default ProductDetailScreen