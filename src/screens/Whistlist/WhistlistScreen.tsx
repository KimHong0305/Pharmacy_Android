import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/rootReducer';
import { deleteWhistlist, getWhistlist } from '../../lib/redux/reducers/whistlist.reducer';

const WhistlistScreen = () => {

    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const { whistlist } = useSelector((state: RootState) => state.whistlist);

    useEffect(() => {
        dispatch(getWhistlist());
    }, [dispatch]);

    const handleRemove = async (id: string) => {
        dispatch(deleteWhistlist(id))
        .then(() => Alert.alert('Thông báo', 'Xóa sản phẩm thành công'))
        .then(() => dispatch(getWhistlist()));
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Sản phẩm yêu thích</Text>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {whistlist.map((item) => (
                <View key={item.id} style={styles.card}>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemove(item.id)}
                    >
                        <Icon name="x" size={20} color="black" />
                    </TouchableOpacity>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.info}>
                        <Text style={styles.name}
                        onPress={() =>
                            navigation.navigate('ProductDetailScreen', {
                              productId: item.productId,
                            })
                        }>
                            {item.productName}</Text>
                    </View>
                </View>
                ))}
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
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d9d9d9',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 1,
        padding: 5,
    },
});

export default WhistlistScreen;