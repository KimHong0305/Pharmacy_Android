import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getListAddress } from '../../lib/redux/reducers/address.reducer';

const AddressUserScreen = () => {

    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();

    const { listAddress } = useSelector((state: RootState) => state.address);
    const { token } = useSelector((state: RootState) => state.auth);

    useFocusEffect(
        React.useCallback(() => {
            if (token) {
                dispatch(getListAddress());
            }
        }, [dispatch, token])
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('BottomTab', {screen: 'Tài khoản', params: {}})}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Địa chỉ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {listAddress.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.addressItem} onPress={() => navigation.navigate('EditAddressScreen', {address: item })}>
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
                                        {item.WardName + ", " + item.DistrictName + ", " + item.ProvinceName}
                                    </Text>
                                </View>
                            </View>

                            {item.addressDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultBadgeText}>Mặc định</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => navigation.navigate('AddAddressScreen')}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',
                        borderTopColor: '#d9d9d9', borderTopWidth: 1, paddingTop: 10}}>
                        <Icon name="plus-circle" size={18} color="#388E3C"/>
                        <Text style={{fontSize: 15, marginLeft: 5, color: '#388E3C', fontWeight:'500'}}>
                            Thêm địa chỉ
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
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
});

export default AddressUserScreen;
