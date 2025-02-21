import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';
import { Image } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { appColors } from '../../constants/appColors';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextComponent text="Pharmacy" size={25} />
        <TextInput placeholder="Search" style={styles.input} />
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.avatar}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {/* Body */}
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.slider}>
            <Swiper activeDotColor={appColors.white}>
              <Image
                source={require('../../assets/images/Banner1.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/images/Banner2.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
              <Image
                source={require('../../assets/images/Banner3.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
            </Swiper>
            <View style={{}}>
              
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    backgroundColor: '#FFF',
    marginTop: 40,
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  body:{
    alignItems: 'center'
  },
  slider: {
    width: '90%',
    height: 150,
    backgroundColor: '#EBEB13',
    borderRadius: 25,
    marginTop: 20
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  input: {
    width: 180,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    borderCurve: 'continuous',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: fontFamilies.Medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6200EE',
  },
});

export default HomeScreen