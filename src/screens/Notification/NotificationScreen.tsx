import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextComponent } from '../../components';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { appColors } from '../../constants/appColors';

const notifications = [
  {
    id: 1,
    title: 'Khuyến mãi 30% cho đơn hàng đầu tiên',
    content:
      'Khuyến mãi khủng cho đơn hàng đầu tiên. Chỉ diễn ra từ (07/04 - 18/05/2025), Bạn đừng bỏ lỡ cơ hội nhé!',
    createDate: '11:28, Hôm nay',
    image: '../../assets/images/logo.png',
  },
  {
    id: 2,
    title: 'Khuyến mãi 50% cho đơn hàng đầu tiên',
    content:
      'Khuyến mãi khủng cho đơn hàng đầu tiên. Chỉ diễn ra từ (07/04 - 18/05/2025), Bạn đừng bỏ lỡ cơ hội nhé!',
    createDate: '06/08/2025',
    image: '../../assets/images/logo.png',
  },
  {
    id: 3,
    title: 'Khuyến mãi 70% cho đơn hàng đầu tiên',
    content:
      'Khuyến mãi khủng cho đơn hàng đầu tiên. Chỉ diễn ra từ (07/04 - 18/05/2025), Bạn đừng bỏ lỡ cơ hội nhé!',
    createDate: '10/03/2025',
    image: '../../assets/images/logo.png',
  },
  {
    id: 4,
    title: 'Khuyến mãi 70% cho đơn hàng đầu tiên',
    content:
      'Khuyến mãi khủng cho đơn hàng đầu tiên. Chỉ diễn ra từ (07/04 - 18/05/2025), Bạn đừng bỏ lỡ cơ hội nhé!',
    createDate: '10/03/2025',
    image: '../../assets/images/logo.png',
  },
];


const NotificationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{left: -90}}>
          <Icon name="arrow-left" size={25} color="#007AFF" />
        </TouchableOpacity>
        <TextComponent text="THÔNG BÁO" size={25} color="black" />
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {notifications.map(item => (
          <View key={item.id} style={styles.card}>
            <Image
              source={require('../../assets/images/notification.jpg')}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.createDate}>
                Thời gian: {item.createDate}
              </Text>
            </View>
            <TouchableOpacity style={styles.delete_button}>
              <Icon name="x" size={15} color={appColors.black} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    flex: 1
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row'
  },
  list: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  createDate: {
    fontSize: 12,
    color: 'red',
  },
  delete_button: {
    position: 'absolute',
    top: 5,
    right: 5
  }
});
export default NotificationScreen