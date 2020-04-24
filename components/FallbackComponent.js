import React from "react";
import {View} from "react-native";
import Logo from "./Logo";
import {LatoText} from "./StyledText";

const FallbackComponent = () => {
  return (
    <View style={{
      flex: 1,
    }}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Logo/>
        <LatoText>Something Went wrong :(</LatoText>
        <LatoText>report to programdesignlab@gmail.com</LatoText>
      </View>

    </View>
  )
};

export default FallbackComponent;