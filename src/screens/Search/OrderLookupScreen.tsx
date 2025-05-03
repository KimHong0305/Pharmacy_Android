import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { appColors } from '../../constants/appColors';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigators';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { getOrder, resetOrder } from '../../lib/redux/reducers/order.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import Icon5 from 'react-native-vector-icons/FontAwesome6';
import { getVillageName } from '../../lib/redux/reducers/location.reducer';

const OrderLookupScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const { orderGuest } = useSelector((state: RootState) => state.order);
    const [orderCode, setOrderCode] = useState('');
    const { villageName } = useSelector((state: RootState) => state.location);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        dispatch(resetOrder());
    }, []);

    const handleLookup = async () => {
        setNotFound(false);
        const resultAction = await dispatch(getOrder(orderCode));
        if (getOrder.fulfilled.match(resultAction)) {
        if (!resultAction.payload?.result) {
            setNotFound(true);
        }
        } else {
            setNotFound(true);
        }
    };

    useEffect(() => {
        if (orderGuest) {
            dispatch(getVillageName(orderGuest.address.village));
        }
    }, [orderGuest]);    

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { label: 'Chờ thanh toán', color: '#f0ad4e' };
            case 'SUCCESS':
                return { label: 'Đã thanh toán', color: '#5cb85c' };
            case 'FAILED':
                return { label: 'Thanh toán thất bại', color: '#d9534f' };
            case 'CANCELLED':
                return { label: 'Đã hủy', color: '#777' };
            default:
                return { label: 'Không xác định', color: '#ccc' };
        }
    };
      
    return (
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() =>
                navigation.navigate('BottomTab', { screen: 'Trang chủ', params: {} })
            }>
            <Icon name="arrow-left" size={25} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <Text style={styles.title}>Tra cứu đơn hàng</Text>
        </View>

        <View style={styles.inputContainer}>
            <TextInput
            placeholder="Nhập mã đơn hàng"
            placeholderTextColor="#999"
            style={styles.input}
            value={orderCode}
            onChangeText={setOrderCode}
            />
            <TouchableOpacity style={styles.button} onPress={handleLookup}>
            <Icon name="search" size={25} color="#fff" />
            </TouchableOpacity>
        </View>

        {notFound && (
            <Text style={styles.notFoundText}>Đơn hàng không tồn tại</Text>
        )}

        {orderGuest && !notFound && (
            <View style={styles.orderContainer}>
                <View style={styles.statusBadge}>
                    <Text
                        style={{
                            color: orderGuest.isConfirm === false ? '#ed7532' : '#1E90FF',
                            fontWeight: '500',
                            fontSize: 16,
                        }}
                    >
                        {orderGuest.isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                    </Text>
                </View>

                <View style={{borderBottomWidth: 1, borderBlockColor: '#ccc'}}>
                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Mã đơn:</Text>
                        <Text style={styles.value}>{orderGuest.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Ngày đặt:</Text>
                        <Text style={styles.value}>{orderGuest.orderDate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phương thức thanh toán:</Text>
                        <Text style={styles.value}>{orderGuest.paymentMethod}</Text>
                    </View>
                </View>
            <View style={{borderBottomWidth: 1, borderBlockColor: '#ccc', paddingBottom: 5}}>
                <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                <View style={styles.address}>
                    <Icon5 name='location-dot' size={20} color={'#ed7532'} />
                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }}>
                        <View style={{ flex: 1, gap: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 13, fontWeight: '500' }}>
                                    {orderGuest.address.fullname}
                                </Text>
                                <Text style={{ marginLeft: 13, color: 'gray' }}>
                                    (+84) {orderGuest.address.phone}
                                </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={{ fontSize: 13 }}>
                                    {orderGuest.address.address}
                                    </Text>
                                    <Text style={{ fontSize: 13 }}>
                                    {villageName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
            {orderGuest.orderItemResponses.map((item) => (
                <View key={item.id} style={styles.productItem}>
                    <View style={styles.productRow}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text>
                        {item.quantity} x {item.price.toLocaleString()} đ
                        </Text>
                    </View>
                    </View>
                </View>
            ))}
            <Text style={{textAlign:'right'}}>
                Tổng tiền:{' '}
                <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>
                    {orderGuest.totalPrice.toLocaleString()} đ
                </Text>
            </Text>

            <View style={[styles.statusBox, { backgroundColor: getStatusDisplay(orderGuest.status).color }]}>
                <Text style={styles.statusText}>
                    {getStatusDisplay(orderGuest.status).label}
                </Text>
            </View>

            </View>
        )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.white,
    },
    header: {
        height: 30,
        marginTop: 30,
        flexDirection: 'row',
        gap: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 20,
    },
    inputContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        flex: 1,
        height: 50,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        height: 50,
    },
    notFoundText: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
        fontWeight: '500',
    },
    orderContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        marginTop: 10,
        color: '#333',
    },
    productItem: {
        marginBottom: 10,
        paddingVertical: 4,
    },
    productName: {
        fontWeight: '500',
        marginBottom: 2,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    address: {
        flexDirection: 'row',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        flex: 1,
    },
    value: {
        color: '#000',
        textAlign: 'right',
    },
    statusBox: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusBadge: {
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center'
    },
});

export default OrderLookupScreen;
