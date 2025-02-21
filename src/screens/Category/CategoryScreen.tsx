import { View, Text } from 'react-native'
import React from 'react'
import { TextComponent } from '../../components';

const CategoryScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TextComponent text="CategoryScreen" size={30} />
    </View>
  );
}

export default CategoryScreen