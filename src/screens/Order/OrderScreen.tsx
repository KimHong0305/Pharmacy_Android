import { View, Text } from 'react-native'
import React from 'react'
import { TextComponent } from '../../components'

const OrderScreen = () => {
  return (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <TextComponent text='OrderScreen' size={30}/>
    </View>
  )
}

export default OrderScreen