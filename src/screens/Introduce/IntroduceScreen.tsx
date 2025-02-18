import { View, Text, Image, ImageBackground, ActivityIndicator } from 'react-native'

import React from 'react'
import { SpaceComponent } from '../../components';
import { appInfo } from '../../constants/appInfos';
import { appColors } from '../../constants/appColors';

const IntroduceScreen = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/IntroduceBackground.png')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('../../assets/images/logo.jpg')}
          style={{
            width: 150,
            height: 300,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            fontSize: 30,
            color: appColors.blue,
            fontWeight: 'bold',
            marginLeft: 10,
          }}>
          PHARMACY
        </Text>
      </View>
      <SpaceComponent height={20} />
      <ActivityIndicator
        color={appColors.gray}
        size={22}
        style={{alignSelf: 'center'}}
      />
    </ImageBackground>
  );
}

export default IntroduceScreen