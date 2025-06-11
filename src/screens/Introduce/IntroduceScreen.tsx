import { View, Text, Image, ImageBackground, ActivityIndicator } from 'react-native'

import React, { useEffect, useState } from 'react'
import { SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

const IntroduceScreen = () => {
  const fullText = 'PHARMACY';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  
   //Set chữ xuất hiện sau logo 1s và xuất hiện lần lượt từng chữ
   useEffect(() => {
     if (imageLoaded) {
       const timer = setTimeout(() => {
         setDisplayedText(fullText[0]);
         let index = 0;
         const interval = setInterval(() => {
           setDisplayedText(prev => prev + fullText[index]);
           index++;
           if (index === fullText.length) clearInterval(interval); 
         }, 100);
       }, 1000);
       return () => clearTimeout(timer);
     }
   }, [imageLoaded]);
  
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
          source={require('../../assets/images/logo.png')}
          style={{
            width: 150,
            height: 300,
            resizeMode: 'contain',
          }}
          onLoad={() => setImageLoaded(true)}
        />
        <Text
          style={{
            fontSize: 30,
            color: appColors.blue,
            marginLeft: 10,
            fontFamily: fontFamilies.SemiBold,
          }}>
          {displayedText}
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