import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {getBio, updateBio} from '../../lib/redux/reducers/user.reducer';
import {RootState} from '../../lib/redux/rootReducer';
import {AppDispatch} from '../../lib/redux/store';
import type {NavigationProp} from '../../navigators/index';
import { logout } from '../../lib/redux/reducers/auth.reducer';

const AccountNurseScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const {bio, loading, error} = useSelector((state: RootState) => state.user);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getBio());
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    console.log('Đã đăng xuất');
    navigation.navigate('BottomTab', {screen: 'Tài khoản', params: {}});
  };

  const handleEditAvatar = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('Hủy chọn ảnh');
      } else if (response.errorCode) {
        console.log('Lỗi:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets?.[0]?.uri;
        if (imageUri) {
          console.log('Ảnh đã chọn:', imageUri);
          setSelectedImage(imageUri);
        } else {
          console.log('Không tìm thấy ảnh nào');
        }
      } else {
        console.log('Không tìm thấy ảnh nào');
      }
    });
  };

  const handleUpdateProfile = () => {
    if (!bio) return;

    const formData = new FormData();
    formData.append('updateUser', JSON.stringify({id: bio.id}));

    if (selectedImage) {
      const newImageUri = selectedImage.startsWith('file://')
        ? selectedImage
        : `file://${selectedImage}`;

      formData.append('file', {
        uri: newImageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
    }

    dispatch(updateBio({updateUser: {id: bio.id}, image: selectedImage}))
      .unwrap()
      .then(() => {
        Alert.alert('Cập nhật thành công');
        dispatch(getBio());
      })
      .catch(() => {
        console.log('Cập nhật thất bại');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông tin cá nhân</Text>
      </View>

      {/* Hiển thị loading */}
      {loading && <ActivityIndicator size="large" color="#6200EE" />}

      {/* Hiển thị lỗi nếu có */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Hiển thị thông tin người dùng nếu có dữ liệu */}
      {bio && (
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                selectedImage
                  ? require('../../assets/images/avatar.jpg')
                  : {uri: bio.image}
              }
              style={styles.avatar}
            />

            <TouchableOpacity
              style={styles.editIcon}
              onPress={handleEditAvatar}>
              <Icon2 name="pencil" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{bio.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateEmailScreen')}>
              <Text
                style={[
                  styles.value,
                  {color: 'blue', textDecorationLine: 'underline'},
                ]}>
                {bio.email}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{bio.phone_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày sinh:</Text>
            <Text style={styles.value}>{bio.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Điểm:</Text>
            <Text style={styles.value}>{bio.point}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cấp bậc:</Text>
            <Text style={styles.value}>{bio.level}</Text>
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  profileContainer: {
    marginBottom: 20,
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 90,
    alignSelf: 'center',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.75,
    borderRadius: 50,
    padding: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 7,
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AccountNurseScreen;
