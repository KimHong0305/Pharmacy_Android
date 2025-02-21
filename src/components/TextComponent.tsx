import { View, Text } from 'react-native'
import React from 'react'
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props{
    text: string,
    color? : string,
    size? : number,
    flex? : number,
    font? : string
}
const TextComponent = (props : Props) => {
  const {text, size, flex,  font, color} = props;
  return (
    <Text style = {{
        color: color ?? appColors.text,
        flex: flex ?? 0,
        fontSize: size ?? 14,
        fontFamily: fontFamilies.Medium
    }}>{text}</Text>
  )
}

export default TextComponent