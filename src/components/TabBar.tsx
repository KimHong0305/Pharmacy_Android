import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBar = () => {
    const navigation = useNavigation();
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setHasToken(!!token);
        } catch (error) {
            console.error('Lỗi khi lấy token:', error);
        }
        };

        checkToken();
    }, []);

    return (
        <View style={styles.footer}>
        <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={styles.footerButtonText}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Danh mục</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Tư vấn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Đơn hàng</Text>
        </TouchableOpacity>

        {/* Chuyển hướng dựa trên token */}
        <TouchableOpacity
            style={styles.footerButton}
            onPress={() =>
            hasToken
                ? navigation.navigate('ProfileScreen')
                : navigation.navigate('AccountScreen')
            }>
            <Text style={styles.footerButtonText}>Tài khoản</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 16,
        color: '#6200EE',
    },
});

export default TabBar;
