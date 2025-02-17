import { View, Text, Image, ImageBackground, ActivityIndicator } from 'react-native'

import React from 'react'
import { SpaceComponent } from '../../components';
import { appInfo } from '../../constants/appInfos';
import { appColors } from '../../constants/appColors';

const IntroduceScreen = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/IntroduceBackground.png')}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      imageStyle={{flex: 1}}>
      <Image
        source={require('../../assets/images/logo.jpg')}
        style={{
          width: appInfo.sizes.WIDTH * 0.7,
          resizeMode: 'contain',
        }}
      />
      <SpaceComponent height={20} />
      <ActivityIndicator color={appColors.gray} size={22} />
    </ImageBackground>
  );
}

export default IntroduceScreen