import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { appColors } from '../../constants/appColors'
import { appInfo } from '../../constants/appInfos'
import { useNavigation } from '@react-navigation/native'
import { TextComponent } from '../../components'

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <Swiper loop={false} activeDotColor={appColors.black} index={index} onIndexChanged={num => setIndex(num)}>
        <View style={styles.swiper}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.image}
          />
          <Text style={styles.text}>Welcome to Pharmacy!</Text>
        </View>
        <View style={styles.swiper}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.image}
          />
          <Text style={styles.text}>Buy Now!</Text>
        </View>
        <View style={styles.swiper}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.image}
          />
          <Text style={styles.text}>Payment Now!</Text>
        </View>
      </Swiper>
      <View style={styles.skip_next}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTab')}>
          <TextComponent text='Skip'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => index < 2 ? setIndex(index + 1) : navigation.navigate('BottomTab')}>
          <TextComponent text='Next'/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  swiper: {
    alignItems: 'center',
  },
  image: {
    marginTop: 100,
  },
  text: {
    marginTop: 50,
    fontSize: 25,
    fontFamily: 'Montserrat-Medium',
  },
  skip_next: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OnboardingScreen