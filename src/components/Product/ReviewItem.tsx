import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import TextComponent  from '../TextComponent';
import { appColors } from '../../constants/appColors';
import { Image } from 'react-native';
import { fontFamilies } from '../../constants/fontFamilies';

interface ReviewProps {
  avatar: any;
  name: string;
  time: string;
  content: string;
  replies?: ReviewProps[];
  onReply?: () => void;
}

export const ReviewItem = ({ avatar, name, time, content, replies, onReply }: ReviewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.reviewHeader}>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <TextComponent text={name} styles={styles.name} />
          <TextComponent text={time} color={appColors.gray} size={12} />
        </View>
      </View>
      
      <TextComponent text={content} styles={styles.content} />
      
      <TouchableOpacity onPress={onReply} style={styles.replyButton}>
        <TextComponent text="Phản hồi" color={appColors.blue} size={12} />
      </TouchableOpacity>

      {replies && replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {replies.map((reply, index) => (
            <ReviewItem
              key={index}
              avatar={reply.avatar}
              name={reply.name}
              time={reply.time}
              content={reply.content}
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
  repliesContainer: {
    marginLeft: 20,
    marginTop: 10,
  },
}); 