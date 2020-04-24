import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Text, G, Use, TSpan, Defs } from 'react-native-svg';
import Colors from '../constants/Colors';

const StatusBanner = ({ label, color }) => (
  <View style={[StyleSheet.absoluteFill, {
    alignItems: 'center', justifyContent: 'center', shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 20,
    height: 0,
    width: 0,
  }]}>
    <Svg width="88" height="38" viewBox="0 0 88 38">
      <Defs>
        <Path id="b" d="M18.667 0H80v30H0z" fill={Colors.tintColor} />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G transform="translate(4 2)">
          <Use fill={Colors.dark} filter="url(#a)" xlinkHref="#b" />
          <Use fill={Colors.tintColor} xlinkHref="#b" />
        </G>
        <Text fill={Colors.textLight} fontSize="12" transform="translate(-1 2)">
          <TSpan x="22.52" y="21">{label}</TSpan>
        </Text>
      </G>
    </Svg>
  </View>
);

export default StatusBanner;
