import * as React from 'react';
import {Text} from 'react-native';
import Colors from "../constants/Colors";

export function LatoText(props) {
  return <Text {...props} style={[{color: Colors.textDark, fontSize: 16}, props.style, {fontFamily: 'lato'}]}/>;
}
