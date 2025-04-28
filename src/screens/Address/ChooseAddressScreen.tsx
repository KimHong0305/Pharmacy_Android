import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { fetchAddressWithLocationNames, getListAddress } from '../../lib/redux/reducers/address.reducer';
import { Coupon } from '../../lib/schemas/coupon.schema';
import { ProductDetailItem } from '../../lib/schemas/product.schema';

const ChooseAddressScreen = () => {

    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const route = useRoute();
    const { selectedCoupon, home, product } = route.params as { 
        selectedCoupon : Coupon;
        home: boolean;
        product: ProductDetailItem;
    };

    const { listAddress } = useSelector((state: RootState) => state.address);
    const { token } = useSelector((state: RootState) => state.auth);

    const [updatedListAddress, setUpdatedListAddress] = useState(listAddress);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(getListAddress());
        }
    }, [dispatch, token]);

    useFocusEffect(
        React.useCallback(() => {
            if (token) {
                dispatch(getListAddress());
            }
        }, [dispatch, token])
    );

    useEffect(() => {
        if (listAddress && listAddress.length > 0) {
            const fetchData = async () => {
                const updatedAddresses = await Promise.all(
                    listAddress.map(async (address) => {
                        const updatedAddress = await dispatch(fetchAddressWithLocationNames(address)).unwrap();
                        return updatedAddress;
                    })
                );
                setUpdatedListAddress(updatedAddresses);

                const defaultAddress = updatedAddresses.find(address => address.addressDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id);
                }
            };
            fetchData();
        }
    }, [listAddress, dispatch]);

    const handleSelectAddress = (id: string) => {
        if (selectedAddress === id) {
            setSelectedAddress(null);
        } else {
            setSelectedAddress(id);
        }
    };

    const handleConfirmSelection = () => {
        const selected = updatedListAddress.find(item => item.id === selectedAddress);
        if (selected) {
            if(home === false){
                navigation.navigate('OrderCartScreen', { selectedCoupon: selectedCoupon, selectedAddress: selected });
            }else if (home === true){
                navigation.navigate('OrderHomeScreen', { product: product, selectedCoupon: selectedCoupon, selectedAddress: selected });
            }
        }else{
            console.warn("Required parameters are missing!");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Chọn địa chỉ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {updatedListAddress.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.addressItem} 
                        onPress={() => handleSelectAddress(item.id)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableOpacity 
                                style={styles.selectButton}
                                onPress={() => handleSelectAddress(item.id)}>
                                <Icon 
                                    name={selectedAddress === item.id ? 'check-circle' : 'circle'} 
                                    size={20} 
                                    color={selectedAddress === item.id ? 'green' : 'gray'} 
                                />
                            </TouchableOpacity>

                            {/* Address Information */}
                            <View style={{ flex: 1, gap: 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 15, fontWeight: '700' }}>
                                        {item.fullname}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: 'gray', marginLeft: 10 }}>
                                        (+84) {item.phone}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={{ fontSize: 13 }}>
                                            {item.address}
                                        </Text>
                                        <Text style={{ fontSize: 13 }}>
                                            {item.villageName || item.village}
                                        </Text>
                                    </View>
                                </View>

                                {item.addressDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultBadgeText}>Mặc định</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => navigation.navigate('AddAddressScreen')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopColor: '#d9d9d9', borderTopWidth: 1, paddingTop: 10 }}>
                        <Icon name="plus-circle" size={18} color="#388E3C" />
                        <Text style={{ fontSize: 15, marginLeft: 5, color: '#388E3C', fontWeight: '500' }}>
                            Thêm địa chỉ
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {selectedAddress && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
                        <Text style={styles.confirmButtonText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flex: 1,
    },
    addressItem: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d9d9d9',
    },
    defaultBadge: {
        marginTop: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'green',
        backgroundColor: '#e0f7e0',
        alignSelf: 'flex-start',
    },
    defaultBadgeText: {
        fontSize: 13,
        color: 'green',
        fontWeight: 'bold',
    },
    selectButton: {
        marginRight: 10,
    },
    footer: {
        padding: 20,
        paddingBottom: 10,
        justifyContent: 'flex-end',
    },
    confirmButton: {
        backgroundColor: '#388E3C',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChooseAddressScreen;
