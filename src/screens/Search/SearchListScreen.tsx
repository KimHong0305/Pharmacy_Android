import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProduct } from '../../lib/redux/reducers/product.reducer';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2;

const SearchListScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const route = useRoute();
    const { products } = useSelector((state: RootState) => state.product);

    const searchQuery = (route.params as { query?: string })?.query || '';
    const [query, setQuery] = useState<string>(searchQuery);
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    useEffect(() => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter((item) =>
                    item.name.toLowerCase().includes(trimmedQuery)
                )
            );
        }
    }, [query, products]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nhập từ khóa tìm kiếm..."
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
            />

            {filteredProducts.length > 0 ? (
                <ScrollView>
                    <View style={styles.gridContainer}>
                        {filteredProducts.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.productItem}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                                <Text style={styles.productText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
        marginTop: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productItem: {
        width: itemWidth,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default SearchListScreen;
