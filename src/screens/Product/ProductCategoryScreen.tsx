import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getProductByCategory } from '../../lib/redux/reducers/product.reducer';
import { RootState } from '../../lib/redux/rootReducer';

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const ProductCategoryScreen = () => {
    const route = useRoute();
    const { categoryId } = route.params as { categoryId: string };
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const { products } = useSelector((state: RootState) => state.product);

    useEffect(() => {
        dispatch(getProductByCategory({ categoryId }));
    }, [dispatch, categoryId]);

    // console.log(products)

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id})}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{truncateText(item.name, 40)}</Text>
                <Text style={styles.productPrice}>{item.prices[0].price.toLocaleString('vi-VN')} đ/{item.prices[0].unit.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() =>
                navigation.navigate('BottomTab', { screen: 'Danh mục', params: {} })
            }>
            <Icon name="arrow-left" size={25} />
            </TouchableOpacity>
            <Text style={styles.title}>Danh sách sản phẩm</Text>
        </View>

        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop: 50,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    productCard: {
        width: '48%',
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d9d9d9',
    },
    productImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    productPrice: {
        fontSize: 15,
        color: '#004aad',
        marginTop: 4,
        fontWeight: '700',
    },
});

export default ProductCategoryScreen;