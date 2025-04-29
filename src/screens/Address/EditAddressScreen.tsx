import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, RootStackParamList } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { getProvinces, getDistricts, getVillages } from '../../lib/redux/reducers/location.reducer';
import { Picker } from '@react-native-picker/picker';
import { deleteAddress, updateAddress } from '../../lib/redux/reducers/address.reducer';

const EditAddressScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const route = useRoute<RouteProp<RootStackParamList, 'EditAddressScreen'>>();
    const { provinces, districts, villages, loading } = useSelector((state: RootState) => state.location);

    const { address: addressData } = route.params;

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(addressData.province);
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(addressData.district);
    const [selectedVillage, setSelectedVillage] = useState<string | undefined>(addressData.village);
    const [addressType, setAddressType] = useState(addressData.addressCategory === 'HOUSE' ? 'Nhà riêng' : 'Văn phòng');
    const [isDefault, setIsDefault] = useState(addressData.addressDefault);
    const [fullname, setFullname] = useState(addressData.fullname);
    const [phone, setPhone] = useState(addressData.phone.toString());
    const [address, setAddress] = useState(addressData.address);

    useEffect(() => {
        dispatch(getProvinces()).then(() => {
            if (addressData.province) {
                dispatch(getDistricts(addressData.province));
            }
        });
    }, [dispatch, addressData.province]);

    useEffect(() => {
        if (addressData.district) {
            dispatch(getVillages(addressData.district));
        }
    }, [dispatch, addressData.district]);

    const handleProvinceChange = async (provinceId: string) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict(undefined);
        setSelectedVillage(undefined);
        if (provinceId) {
            await dispatch(getDistricts(provinceId));
        }
    };

    const handleDistrictChange = async (districtId: string) => {
        setSelectedDistrict(districtId);
        setSelectedVillage(undefined);
        if (districtId) {
            await dispatch(getVillages(districtId));
        }
    };

    const handleSubmit = async () => {
        if (loading) {
            Alert.alert("Đang tải dữ liệu, vui lòng đợi...");
            return;
        }
    
        if (!fullname || !phone || !selectedProvince || !selectedDistrict || !selectedVillage || !address) {
            Alert.alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
    
        const phoneRegex = /^(?:\+84|0)[3-9]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
            return;
        }

        const updated = {
            id: addressData.id,
            fullname,
            phone,
            address,
            province: selectedProvince,
            district: selectedDistrict,
            village: selectedVillage,
            addressCategory: addressType === "Nhà riêng" ? "HOUSE" : "COMPANY",
            addressDefault: isDefault,
        };

        console.log('updatedAddress', updated);

        try {
            await dispatch(updateAddress(updated)).unwrap();
            Alert.alert("Cập nhật địa chỉ thành công!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Cập nhật địa chỉ thất bại!");
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa địa chỉ này không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xóa", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await dispatch(deleteAddress(id)).unwrap();
                            Alert.alert("Xóa địa chỉ thành công!");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Lỗi khi xóa địa chỉ");
                        }
                    }
                }
            ]
        );
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Sửa địa chỉ</Text>
            </View>

            <ScrollView>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                    placeholder="Nhập họ và tên"
                    value={fullname}
                    onChangeText={setFullname}
                    style={styles.input}
                />
                
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Tỉnh/Thành phố</Text>
                <Picker
                    selectedValue={selectedProvince}
                    onValueChange={handleProvinceChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Chọn Tỉnh/Thành phố" value={undefined} />
                    {provinces.map((province) => (
                        <Picker.Item key={province.id} label={province.full_name} value={province.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Quận/Huyện</Text>
                <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={handleDistrictChange}
                    style={styles.picker}
                    enabled={!!selectedProvince}
                >
                    <Picker.Item label="Chọn Quận/Huyện" value={undefined} />
                    {districts.map((district) => (
                        <Picker.Item key={district.id} label={district.full_name} value={district.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Phường/Xã</Text>
                <Picker
                    selectedValue={selectedVillage}
                    onValueChange={setSelectedVillage}
                    style={styles.picker}
                    enabled={!!selectedDistrict}
                >
                    <Picker.Item label="Chọn Phường/Xã" value={undefined} />
                    {villages.map((village) => (
                        <Picker.Item key={village.id} label={village.full_name} value={village.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                    placeholder="Nhập địa chỉ"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />

                <View style={styles.addressTypeContainer}>
                    <Text style={[styles.label, {marginRight: 60}]}>Loại địa chỉ</Text>
                    <TouchableOpacity
                        style={[
                            styles.addressTypeButton,
                            addressType === 'Nhà riêng' ? styles.selected : styles.default,
                        ]}
                        onPress={() => setAddressType('Nhà riêng')}
                    >
                        <Text style={addressType === 'Nhà riêng' ? styles.selectedText : {}}>
                            Nhà riêng
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.addressTypeButton,
                            addressType === 'Văn phòng' ? styles.selected : styles.default,
                        ]}
                        onPress={() => setAddressType('Văn phòng')}
                    >
                        <Text style={addressType === 'Văn phòng' ? styles.selectedText : {}}>
                            Văn phòng
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.defaultContainer}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
                        <TouchableOpacity
                            style={[
                                styles.switchWrapper,
                                isDefault ? styles.switchOn : styles.switchOff,
                            ]}
                            onPress={() => setIsDefault(!isDefault)}
                        >
                            <View
                                style={[
                                    styles.switchCircle,
                                    isDefault ? styles.circleOn : styles.circleOff,
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#4CAF50' }]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Cập nhật</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#FF5252' }]}
                        onPress={() => handleDelete(addressData.id)}
                    >
                        <Text style={styles.buttonText}>Xóa địa chỉ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    // copy toàn bộ styles giống AddAddressScreen bạn gửi nhé, khỏi cần sửa
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
    formContainer: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        fontSize: 14,
    },
    picker: {
        height: 55,
        marginBottom: 15,
        backgroundColor: '#f1f1f1',
    },
    addressTypeContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    addressTypeButton: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    selected: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#38b6ff'
    },
    default: {
        backgroundColor: '#dedbdb',
    },
    selectedText: {
        color: '#38b6ff',
        fontWeight: '500',
    },
    defaultContainer: {
        marginBottom: 15,
        paddingVertical: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchWrapper: {
        width: 60,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#ccc',
        padding: 2,
        position: 'relative',
    },
    switchOn: {
        backgroundColor: '#4CAF50',
    },
    switchOff: {
        backgroundColor: '#ccc',
    },
    switchCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 3,
    },
    circleOn: {
        transform: [{ translateX: 30 }],
    },
    circleOff: {
        transform: [{ translateX: 5 }],
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
      
});

export default EditAddressScreen;