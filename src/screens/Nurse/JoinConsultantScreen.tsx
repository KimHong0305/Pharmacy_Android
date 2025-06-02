import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {TextComponent} from '../../components';
import {appColors} from '../../constants/appColors';
import {chooseRoomVacant, getRoomVacant} from '../../lib/redux/reducers/nurse.reducer';
import {RootState} from '../../lib/redux/rootReducer';
import {AppDispatch} from '../../lib/redux/store';
import {ChatRoomNurse, ChooseRoomVacant} from '../../lib/schemas/nurse.schemea';
import {NavigationProp} from '../../navigators';
import dayjs from 'dayjs';

const JoinConsultantScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const {chatRoomVacant, latestMessage} = useSelector(
    (state: RootState) => state.nurse,
  );

  useEffect(() => {
    dispatch(getRoomVacant());
  }, [latestMessage]);

  const sortedChatRooms = useMemo(() => {
    if (!chatRoomVacant?.result) return [];

    return [...chatRoomVacant.result].sort((a, b) => {
      const aTime = dayjs(a.lastTime).valueOf();
      const bTime = dayjs(b.lastTime).valueOf();
      return bTime - aTime;
    });
  }, [chatRoomVacant]);

  const handleChooseRoomVacant = async (room: {
    roomId: string;
    senderId: string;
  }) => {
    const resultAction = await dispatch(
      chooseRoomVacant({roomId: room.roomId}),
    );

    if (chooseRoomVacant.fulfilled.match(resultAction)) {
      dispatch(getRoomVacant());
      navigation.navigate('ConsultantScreen', {
        roomId: room.roomId,
        senderId: room.senderId,
      });
    } else {
      console.error(
        'Chọn phòng thất bại:',
        resultAction.payload || resultAction.error,
      );
    }
  };  

  const renderItem = ({item}: {item: ChatRoomNurse}) => (
    <View style={styles.item}>
      <View style={styles.leftSection}>
        <Image source={{uri: item.senderImage}} style={styles.avatar} />
      </View>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.name}>{item.senderName}</Text>
        <Text style={styles.message}>{item.lastMessage}</Text>
        <Text style={{color: appColors.gray}}>
          {dayjs(item.lastTime).format('HH:mm DD/MM/YYYY')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.rightSection}
        onPress={() =>
          handleChooseRoomVacant({roomId: item.roomId, senderId: item.senderId})
        }>
        <TextComponent text="Tư Vấn" size={15} color={appColors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedChatRooms}
        renderItem={renderItem}
        keyExtractor={item => item.roomId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: appColors.black,
    marginTop: 2,
  },
  rightSection: {
    height: 30,
    width: 90,
    borderRadius: 30,
    backgroundColor: appColors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JoinConsultantScreen;
