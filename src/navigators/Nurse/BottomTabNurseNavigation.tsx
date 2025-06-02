import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {Modal, View, Image, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../lib/redux/store';
import {setLatestMessage} from '../../lib/redux/reducers/nurse.reducer';
import {ChatRoomNurse, CreateMessageResponse} from '../../lib/schemas/nurse.schemea';
import {CreateOrderScreen} from '../../screens';
import AccountNurseScreen from '../../screens/Nurse/AccountNurseScreen';
import ChatHistoryScreen from '../../screens/Nurse/ChatHistoryScreen';
import JoinConsultantScreen from '../../screens/Nurse/JoinConsultantScreen';
import {appColors} from '../../constants/appColors';
import Sound from 'react-native-sound';
import dayjs from 'dayjs';
import EventBus from '../../utils/EventBus';
import { closeWebSocket, initWebSocket } from '../../utils/WebSocketService';

const BottomTabNurseNavigation = () => {
  const BottomTab = createBottomTabNavigator();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState<string | null>('');
  const [role, setRole] = useState<string | null>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [latestRoom, setLatestRoom] = useState<ChatRoomNurse | null>(null);

  const playNotificationSound = () => {
    const sound = new Sound(
      require('../../assets/sound/ding.mp3'),
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('⚠️ Lỗi khi load âm thanh:', error);
          return;
        }
        sound.play(success => {
          if (!success) {
            console.log('⚠️ Không thể phát âm thanh');
          }
          sound.release();
        });
      },
    );
  };

  useEffect(() => {
    const setup = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');

      if (!storedUsername || !storedRole) return;

      setUsername(storedUsername);
      setRole(storedRole);
      initWebSocket(storedUsername, storedRole);

      // Khai báo rõ hàm listener để dùng lại ở `off`
      const handleChatroomNotification = (chatRoom: ChatRoomNurse) => {
        dispatch(setLatestMessage(chatRoom));
        setLatestRoom(chatRoom);
        setModalVisible(true);
        playNotificationSound();
        setTimeout(() => setModalVisible(false), 3000);
      };

      EventBus.on('chatroom-notification', handleChatroomNotification);

      // Cleanup
      return () => {
        closeWebSocket();
        EventBus.off('chatroom-notification', handleChatroomNotification);
      };
    };

    setup();
  }, [dispatch]);  
  
  return (
    <>
      <BottomTab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            color = focused ? '#007AFF' : '#8E8E93';
            size = 24;
            switch (route.name) {
              case 'Tạo đơn hàng':
                iconName = 'home';
                break;
              case 'Tư vấn':
                iconName = 'phone';
                break;
              case 'Tài khoản':
                iconName = 'user';
                break;
              case 'Lịch sử':
                iconName = 'wechat';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}>
        <BottomTab.Screen name="Tạo đơn hàng" component={CreateOrderScreen} />
        <BottomTab.Screen name="Tư vấn" component={JoinConsultantScreen} />
        <BottomTab.Screen name="Lịch sử" component={ChatHistoryScreen} />
        <BottomTab.Screen name="Tài khoản" component={AccountNurseScreen} />
      </BottomTab.Navigator>

      {/* Modal hiện thông báo tin nhắn mới từ WebSocket */}
      {latestRoom && (
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {latestRoom.senderImage && (
                  <Image
                    source={{uri: latestRoom.senderImage}}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.modalTitle}>{latestRoom.senderName}</Text>
                  <Text style={styles.modalDate}>
                      {dayjs(latestRoom.lastTime).format('HH:mm DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
              <Text style={styles.modalText}>{latestRoom.lastMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: appColors.white,
    padding: 15,
    borderRadius: 12,
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.black,
  },
  modalDate: {
    fontSize: 12,
    color: appColors.black,
  },
  modalText: {
    fontSize: 14,
    color: appColors.black,
  },
});

export default BottomTabNurseNavigation;
