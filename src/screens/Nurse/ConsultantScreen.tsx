import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {appColors} from '../../constants/appColors';
import {AppDispatch} from '../../lib/redux/store';
import {RootState} from '../../lib/redux/rootReducer';
import {
  createMessageAtRoom,
  getBioNurse,
  getListMessageAtRoom,
} from '../../lib/redux/reducers/nurse.reducer';
import {NavigationProp} from '../../navigators';
import EventBus from '../../utils/EventBus';

interface MessageDisplay {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar: string;
}

const MessageItem: React.FC<{item: MessageDisplay}> = ({item}) => (
  <View
    style={[
      styles.messageContainer,
      item.isMe ? styles.myMessage : styles.otherMessage,
    ]}>
    {!item.isMe && !!item.avatar && (
      <Image source={{uri: item.avatar}} style={styles.avatar} />
    )}
    <View style={styles.bubble}>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
    {item.isMe && !!item.avatar && (
      <Image source={{uri: item.avatar}} style={styles.avatar} />
    )}
  </View>
);

const ConsultantScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();

  const {roomId, senderId} = route.params as {
    roomId: string;
    senderId: string;
  };

  const {listMessage, bioNurse} = useSelector(
    (state: RootState) => state.nurse,
  );

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const userAvatarRef = useRef<string>(''); // giữ avatar user

  useEffect(() => {
    dispatch(getBioNurse());
    dispatch(getListMessageAtRoom(roomId));
  }, [dispatch, roomId]);

  useEffect(() => {
    if (listMessage?.result && bioNurse?.result) {
      const mappedMessages: MessageDisplay[] = listMessage.result.map(msg => {
        const isMe = msg.senderId === bioNurse.result.id;
        const avatar = msg.senderImage || '';

        // lưu avatar user cho lần sau nếu là user
        if (!isMe && avatar) {
          userAvatarRef.current = avatar;
        }

        return {
          id: msg.messageId,
          text: msg.content,
          time: new Date(msg.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe,
          avatar,
        };
      });

      setMessages(mappedMessages.reverse());
    }
  }, [listMessage, bioNurse]);

  useEffect(() => {
    const onNewMessage = (msg: any) => {
      const isFromUser =
        msg.sender === senderId && msg.receiver === bioNurse?.result?.id;
      const isToUser =
        msg.sender === bioNurse?.result?.id && msg.receiver === senderId;

      if (isFromUser || isToUser) {
        const isMe = msg.sender === bioNurse?.result?.id;
        const avatar = isMe
          ? bioNurse?.result?.image || ''
          : userAvatarRef.current;

        const newMsg: MessageDisplay = {
          id: msg.messageId,
          text: msg.content,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe,
          avatar,
        };
        setMessages(prev => [newMsg, ...prev]);
      }
    };

    EventBus.on('new-message', onNewMessage);
    return () => {
      EventBus.off('new-message', onNewMessage);
    };
  }, [bioNurse, senderId]);

  const handleSend = async () => {
    if (!inputText.trim() || !bioNurse?.result?.id) return;

    const payload = {
      roomId,
      sender: bioNurse.result.id,
      receiver: senderId,
      content: inputText.trim(),
    };

    try {
      const res = await dispatch(createMessageAtRoom(payload)).unwrap();

      const newMessage: MessageDisplay = {
        id: res.result.messageId,
        text: res.result.content,
        time: new Date(res.result.time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: true,
        avatar: bioNurse.result.image || '',
      };

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== newMessage.id);
        return [newMessage, ...filtered];
      });

      setInputText('');
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() =>
          navigation.navigate('BottomTabNurse', {
            screen: 'Lịch sử',
            params: {},
          })
        }>
        <Icon name="arrow-left" size={20} color={appColors.black} />
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => <MessageItem item={item} />}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập tin nhắn..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},
  historyButton: {marginTop: 40, marginLeft: 20},
  messagesList: {justifyContent: 'flex-end', paddingHorizontal: 10},
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  myMessage: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
  otherMessage: {justifyContent: 'flex-start', alignSelf: 'flex-start'},
  bubble: {
    maxWidth: '70%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 2,
  },
  text: {fontSize: 16},
  time: {fontSize: 12, color: 'gray', marginTop: 4, textAlign: 'right'},
  avatar: {width: 36, height: 36, borderRadius: 18},
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ConsultantScreen;
