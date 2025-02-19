import { View, Text, Image, ImageBackground, ActivityIndicator } from 'react-native'

import React from 'react'
import { SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

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
            marginLeft: 10,
            fontFamily: fontFamilies.SemiBold,
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