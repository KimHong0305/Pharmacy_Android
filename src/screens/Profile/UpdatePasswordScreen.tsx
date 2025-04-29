import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { NavigationProp } from '../../navigators';
import { AppDispatch } from '../../lib/redux/store';
import { updatePassword } from '../../lib/redux/reducers/user.reducer';

const UpdatePasswordScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkNewPassword, setCheckNewPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = () => {
        if (!oldPassword || !newPassword || !checkNewPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        return;
        }

        if (newPassword !== checkNewPassword) {
        Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp');
        return;
        }

        dispatch(updatePassword({ oldPassword, newPassword, checkNewPassword }))
        .unwrap()
        .then((res) => {
            Alert.alert('Thành công', res.result|| 'Đổi mật khẩu thành công');
            navigation.goBack();
        })
        .catch((error) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Đổi mật khẩu thất bại';
            Alert.alert('Thất bại', errorMessage);
        });
    };
      

    return (
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} />
            </TouchableOpacity>
            <Text style={styles.title}>Đổi mật khẩu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
            {/* Old password */}
            <Text style={styles.label}>Mật khẩu cũ</Text>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Nhập mật khẩu cũ"
                style={styles.input}
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowOldPassword(!showOldPassword)}>
                <Icon name={showOldPassword ? 'eye-off' : 'eye'} size={20} />
            </TouchableOpacity>
            </View>

            {/* New password */}
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Nhập mật khẩu mới"
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowNewPassword(!showNewPassword)}>
                <Icon name={showNewPassword ? 'eye-off' : 'eye'} size={20} />
            </TouchableOpacity>
            </View>

            {/* Confirm password */}
            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Nhập lại mật khẩu mới"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={checkNewPassword}
                onChangeText={setCheckNewPassword}
            />
            <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} />
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
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
    form: {
        paddingHorizontal: 20,
        gap: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
    },
    input: {
        flex: 1,
    },
    icon: {
        paddingLeft: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default UpdatePasswordScreen;