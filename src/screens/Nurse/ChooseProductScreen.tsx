import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { NavigationProp } from '../../navigators';
import { getAllProduct } from '../../lib/redux/reducers/product.reducer';
import { AppDispatch } from '../../lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/rootReducer';
import { Product } from '../../lib/schemas/product.schema';
import { Price } from '../../lib/schemas/price.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseProductScreen = () => {
    const [query, setQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.product);
    const [listProduct, setListProduct] = useState<
        { 
            id: string; 
            name: string; 
            priceId: string; 
            unitName: string; 
            quantity: number;
            image: string;
            price: number;
        }[]
    >([]);

    useEffect(() => {
        const fetchStoredProducts = async () => {
            try {
                const stored = await AsyncStorage.getItem('listProduct');
                if (stored) {
                    setListProduct(JSON.parse(stored));
                }
            } catch (error) {
                console.log('Failed to load stored products:', error);
            }
        };

        dispatch(getAllProduct());
        fetchStoredProducts();
    }, [dispatch]);

    const addProductToList = (productToAdd: {
        id: string;
        image: string;
        name: string;
        priceId: string;
        unitName: string;
        quantity: number;
        price: number;
    }) => {
        setListProduct(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === productToAdd.id && item.priceId === productToAdd.priceId
            );

            let updatedList;
            if (existingIndex !== -1) {
                updatedList = [...prev];
                updatedList[existingIndex].quantity += productToAdd.quantity;
            } else {
                updatedList = [...prev, productToAdd];
            }

            AsyncStorage.setItem('listProduct', JSON.stringify(updatedList)).catch(err =>
                console.error('Failed to save product list:', err)
            );

            return updatedList;
        });
    };

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return [];
        return products.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, products]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('BottomTabNurse', { screen: 'Tạo đơn hàng', params: {}})}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Chọn sản phẩm</Text>
            </View>

            <View style={{ paddingHorizontal: 15 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên sản phẩm..."
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            <ScrollView style={{paddingHorizontal: 10}}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.productItem}
                        onPress={() => {
                            setSelectedProduct(item);
                            setQuantity(1);
                            setShowModal(true);
                            setSelectedPrice(item.prices[0]);
                        }}
                        >
                        <Image source={{uri: item.image}} style={styles.productImage} />
                        <Text style={styles.productText} numberOfLines={1} ellipsizeMode="tail">
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Không có sản phẩm nào!</Text>
                )}
            </ScrollView>
            {selectedProduct && (
            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Icon2 name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                        <Text style={styles.modalName}>{selectedProduct.name}</Text>
                        <Text style={styles.modalPrice}>
                            {selectedPrice?.price?.toLocaleString('vi-VN')} / {selectedPrice?.unit?.name}
                        </Text>

                        {selectedProduct.prices.length > 1 && (
                        <View style={styles.unitList}>
                            {selectedProduct.prices.map((p, index) => (
                            <TouchableOpacity
                                key={p.id}
                                style={[
                                styles.unitItem,
                                selectedPrice?.id === p.id && styles.unitItemSelected,
                                ]}
                                onPress={() => setSelectedPrice(p)}
                            >
                                <Text
                                style={[
                                    styles.unitText,
                                    selectedPrice?.id === p.id && styles.unitTextSelected,
                                ]}
                                >
                                {p.unit.name}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}>
                                <Text style={styles.quantityButton}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)}>
                                <Text style={styles.quantityButton}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            if (selectedProduct && selectedPrice) {
                                const productToAdd = {
                                    id: selectedProduct.id,
                                    image: selectedProduct.image,
                                    name: selectedProduct.name,
                                    priceId: selectedPrice.id,
                                    unitName: selectedPrice.unit.name,
                                    quantity: quantity,
                                    price: selectedPrice.price,
                                };

                                addProductToList(productToAdd);
                                setShowModal(false);
                            }
                        }}
                        >
                        <Text style={styles.addButtonText}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            )}
        </View>
    );
};

export default ChooseProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
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
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalName: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
        textAlign: 'left',
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a51a2',
        marginVertical: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        fontSize: 20,
        paddingHorizontal: 15,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#00bf63',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    unitList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    unitItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 20,
        margin: 5,
    },
    unitItemSelected: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    unitText: {
        color: '#333',
    },
    unitTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 5,
    },
});