import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoryChatRoomNurse } from '../../lib/redux/reducers/nurse.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import { ChatRoomNurse } from '../../lib/schemas/nurse.schemea';
import { NavigationProp } from '../../navigators';
import { appColors } from '../../constants/appColors';
import dayjs from 'dayjs';

const ChatHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  
  const {chatRoomNurse} = useSelector((state: RootState) => state.nurse);

  useEffect(() => {
      dispatch(getHistoryChatRoomNurse());
  }, []);

  const sortedChatRooms = useMemo(() => {
      if (!chatRoomNurse?.result) return [];
  
      return [...chatRoomNurse.result].sort((a, b) => {
        const aTime = dayjs(a.lastTime).valueOf();
        const bTime = dayjs(b.lastTime).valueOf();
        return bTime - aTime;
      });
    }, [chatRoomNurse]); 
    
  const renderItem = ({item}: {item: ChatRoomNurse}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ConsultantScreen', {roomId: item.roomId, senderId: item.senderId})}>
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
    </TouchableOpacity>
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
  }
});

export default ChatHistoryScreen;
