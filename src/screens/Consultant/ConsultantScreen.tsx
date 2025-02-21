import { View, Text } from 'react-native'
import React from 'react'
import { TextComponent } from '../../components'

const ConsultantScreen = () => {
  return (
    <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TextComponent text='ConsultantScreen' size={30}/>
    </View>
  )
}

export default ConsultantScreen