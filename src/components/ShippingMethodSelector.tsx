import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import TextComponent from './TextComponent';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { getService, getServiceFee, resetFee } from '../lib/redux/reducers/delivery.reducer';
import { AppDispatch } from '../lib/redux/store';
import { RootState } from '../lib/redux/rootReducer';

export type ShippingMethod = 'standard' | 'express';

interface Props {
    selected: ShippingMethod;
    onSelect: (method: ShippingMethod) => void;
    district: string;
    village: string;
}

const ShippingMethodSelector: React.FC<Props> = ({
    selected,
    onSelect,
    district,
    village,
}) => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const { service, fee } = useSelector((state: RootState) => state.delivery);

    useEffect(() => {
        const fetchServices = async () => {
            if (district && village) {
                try {
                const result = await dispatch(getService(district)).unwrap();
                if (Array.isArray(result) && result.length > 0 && result[0].service_id) {
                    const info = {
                        service_id: result[0].service_id,
                        to_district_id: district,
                        to_ward_code: String(village),
                        insurance_value: 0,
                    };
                    await dispatch(getServiceFee(info)).unwrap();
                } else {
                    console.warn("Không tìm thấy service_id hợp lệ trong kết quả getService.");
                }
                } catch (error) {
                    console.error("Lỗi khi lấy dịch vụ giao hàng:", error);
                }
            } else {
                dispatch(resetFee());
            }
        };

        fetchServices();
    }, [district, village, dispatch]);


    return (
        <View style={styles.container}>
        <TextComponent
            text="Phương thức vận chuyển"
            size={15}
            color={appColors.black}
            styles={{
            marginBottom: 10,
            fontFamily: fontFamilies.SemiBold,
            }}
        />

        <TouchableOpacity
            style={[
            styles.option,
            selected === 'standard' && styles.selectedOption,
            ]}
            onPress={() => onSelect('standard')}
        >
            <Text style={selected === 'standard' ? styles.selectedText : styles.optionText}>
                Giao hàng nhanh
            </Text>
            <TextComponent
                text={
                    fee?.total !== undefined
                    ? `${fee.total.toLocaleString('vi-VN')}đ`
                    : 'Đang tính phí...'
                }
                styles={{ fontWeight: '700' }}
            />
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.option,
                selected === 'express' && styles.selectedOption,
            ]}
            disabled={true}
            onPress={() => {}}
        >
            <Text style={selected === 'express' ? styles.selectedText : styles.optionText}>
            Giao hàng hỏa tốc
            </Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: appColors.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 10,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    option: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedOption: {
        borderColor: '#007BFF',
        backgroundColor: '#E6F0FF',
    },
    optionText: {
        fontSize: 15,
        color: '#ccc',
    },
    selectedText: {
        fontSize: 15,
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default ShippingMethodSelector;
