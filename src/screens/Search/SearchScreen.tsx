import React, { useState, useEffect, useMemo } from 'react';
import { Image, View, TextInput, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { appColors } from '../../constants/appColors';
import { getAllProduct } from '../../lib/redux/reducers/product.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigators';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    const { products, loading, error } = useSelector((state: RootState) => state.product);

    useEffect(() => {
        dispatch(getAllProduct());
        
    }, [dispatch]);

    // console.log(products)

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return [];
        return products.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, products]);

    const handleSearch = () => {
        if (query.trim()) {
            navigation.navigate('SearchList', { query });
        }
    };

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Icon
              name="search"
              size={23}
              color={appColors.black}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.productItem}
                onPress={() =>
                  navigation.navigate('ProductDetailScreen', {
                    productId: item.id,
                  })
                }>
                <Image source={{uri: item.image}} style={styles.productImage} />
                <Text style={styles.productText}>{item.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Không có sản phẩm nào!</Text>
          )}
        </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        marginTop: 40,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    productText: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default SearchScreen;
