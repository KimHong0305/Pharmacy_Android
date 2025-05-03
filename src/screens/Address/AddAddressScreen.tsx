import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { useNavigation } from '@react-navigation/native';
import { getProvinces, getDistricts, getVillages } from '../../lib/redux/reducers/location.reducer';
import { Picker } from '@react-native-picker/picker';
import { addAddress } from '../../lib/redux/reducers/address.reducer';

const AddAddressScreen = () => {
    const navigation = useNavigation();
    const dispatch: AppDispatch = useDispatch();
    const { provinces, districts, villages, loading } = useSelector((state: RootState) => state.location);

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
    const [selectedVillage, setSelectedVillage] = useState<string | undefined>(undefined);
    const [addressType, setAddressType] = useState('Nhà riêng');
    const [isDefault, setIsDefault] = useState(false);
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        dispatch(getProvinces());
    }, [dispatch]);

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
           Alert. alert("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
            return;
        }

        const newAddress = {
            fullname,
            phone,
            address,
            province: selectedProvince,
            district: selectedDistrict,
            village: selectedVillage,
            addressCategory: addressType === "Nhà riêng" ? "HOUSE" : "COMPANY",
            addressDefault: isDefault,
        };

        console.log('new', newAddress);

        try {
            await dispatch(addAddress(newAddress)).unwrap();
            Alert. alert("Địa chỉ đã được thêm thành công!");
            navigation.goBack();
        } catch (error) {
            Alert. alert("Lỗi")
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Thêm </Text>
            </View>

            <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 20 }}>
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
                />

                <Text style={styles.label}>Tỉnh/Thành phố</Text>
                <Picker
                    selectedValue={selectedProvince}
                    onValueChange={handleProvinceChange}
                    style={styles.picker}
                >
                    <Picker.Item style={{fontSize: 14}} label="Chọn Tỉnh/Thành phố" value={undefined} />
                    {provinces.map((province) => (
                        <Picker.Item style={{fontSize: 14}} key={province.id} label={province.full_name} value={province.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Quận/Huyện</Text>
                <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={handleDistrictChange}
                    style={styles.picker}
                    enabled={!!selectedProvince}
                >
                    <Picker.Item style={{fontSize: 14}} label="Chọn Quận/Huyện" value={undefined} />
                    {districts.map((district) => (
                        <Picker.Item style={{fontSize: 14}} key={district.id} label={district.full_name} value={district.id} />
                    ))}
                </Picker>

                <Text style={styles.label}>Phường/Xã</Text>
                <Picker
                    selectedValue={selectedVillage}
                    onValueChange={setSelectedVillage}
                    style={styles.picker}
                    enabled={!!selectedDistrict}
                >
                    <Picker.Item style={{fontSize: 14}} label="Chọn Phường/Xã" value={undefined} />
                    {villages.map((village) => (
                        <Picker.Item style={{fontSize: 14}} key={village.id} label={village.full_name} value={village.id} />
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
                    <Text style={[styles.label, {marginRight: 60}]}>Loại địa chỉ </Text>
                    <TouchableOpacity
                        style={[
                            styles.addressTypeButton,
                            addressType === 'Nhà riêng' ? styles.selected : styles.default,
                        ]}
                        onPress={() => setAddressType('Nhà riêng')}
                    >
                        <Text
                            style={[
                                addressType === 'Nhà riêng' ? styles.selectedText : {},
                            ]}
                        >
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
                        <Text
                            style={[
                                addressType === 'Văn phòng' ? styles.selectedText : {},
                            ]}
                        >
                            Văn phòng
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.defaultContainer}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>
                            Đặt làm địa chỉ mặc định
                        </Text>
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
                
                <Button title="Thêm" onPress={handleSubmit} color="#4CAF50" />
            
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
    formContainer: {
        paddingHorizontal: 20
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
});


export default AddAddressScreen;