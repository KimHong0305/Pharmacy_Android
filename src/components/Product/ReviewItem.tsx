import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import TextComponent from '../TextComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

interface FeedBack {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  createDate: string;
  feedback: string;
  onReply?: () => void;
}

interface Replies {
  replies? : FeedBack[]
}

export const ReviewItem = ({
  id,
  userId,
  username,
  avatar,
  createDate,
  feedback,
  onReply,
  replies = [],
}: FeedBack & Replies) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.reviewHeader}>
        <Image
          source={
            avatar ? {uri: avatar} : require('../../assets/images/avatar.jpg')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <TextComponent text={username} styles={styles.name} />
          <TextComponent text={createDate} color={appColors.gray} size={12} />
        </View>
      </View>

      <TextComponent text={feedback} styles={styles.content} />

      <TouchableOpacity onPress={onReply} style={styles.replyButton}>
        <TextComponent text="Phản hồi" color={appColors.blue} size={12} />
      </TouchableOpacity>

      {replies && replies.length > 0 && (
        <View style={styles.reviewHeader}>
          {replies.map((reply, index) => (
            <ReviewItem
              key={index}
              id={reply.id}
              userId={reply.userId}
              avatar={reply.avatar}
              username={reply.username}
              createDate={reply.createDate}
              feedback={reply.feedback}
            />
          ))}
        </View>
      )}
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
