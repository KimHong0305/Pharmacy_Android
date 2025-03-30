import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import TextComponent from '../TextComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

interface ReviewProps {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  productId: string;
  productName: string;
  feedback: string;
  createDate: string;
  onReply?: () => void;
}

export const ReviewItem = ({ avatar, username, createDate, feedback, onReply }: ReviewProps) => {
  // console.log(avatar)
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.reviewHeader}>
        <Image source={avatar ? { uri: avatar } : require('../../assets/images/avatar.jpg')} style={styles.avatar} />
        <View style={styles.userInfo}>
          <TextComponent text={username} styles={styles.name} />
          <TextComponent text={createDate} color={appColors.gray} size={12} />
        </View>
      </View>

      {/* Nội dung phản hồi */}
      <TextComponent text={feedback} styles={styles.content} />

      {/* Nút phản hồi */}
      <TouchableOpacity onPress={onReply} style={styles.replyButton}>
        <TextComponent text="Phản hồi" color={appColors.blue} size={12} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: appColors.gray2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamilies.Medium,
    marginBottom: 2,
  },
  content: {
    marginBottom: 10,
  },
  replyButton: {
    alignSelf: 'flex-start',
  },
});

export default ReviewItem;
