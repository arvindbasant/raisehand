import {Text, View} from "react-native";
import React from "react";

const ValidationMessageBox = ({error}) => {
  return(
    <View>
      <Text
        style={{
          color: 'red',
          fontFamily: 'lato',
          fontSize: 12,
          padding:10,
          paddingBottom:10
        }}
      >{error}</Text>
    </View>
  )
}

export default ValidationMessageBox;