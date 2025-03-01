import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props{
    text: string,
    color? : string,
    size? : number,
    flex? : number,
    font? : string,
    styles? : StyleProp<TextStyle>
}
const TextComponent = (props : Props) => {
  const {text, size, flex,  font, color, styles} = props;
  return (
    <Text style = {[{
        color: color ?? appColors.text,
        flex: flex ?? 0,
        fontSize: size ?? 14,
        fontFamily: fontFamilies.Medium,
    },
    styles
  ]}>{text}</Text>
  )
}

export default TextComponent