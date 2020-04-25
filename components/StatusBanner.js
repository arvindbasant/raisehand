import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Text, G, Use, TSpan, Defs } from 'react-native-svg';
import Colors from '../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const StatusBanner = ({ label, color }) => (
  <View style={[{
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 20,
  }]}>
    <Svg width={wp('20%')} height={wp('8%')} viewBox={`0 0 ${wp('20%')} ${wp('8%')}`}>
      <Defs>
        <Path id="b" d={`M18.667 0H${wp('20%')}v${wp('7%')}H0z`} fill={Colors.tintColor} />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G transform="translate(4 2)">
          <Use fill={Colors.dark} filter="url(#a)" xlinkHref="#b" />
          <Use fill={Colors.tintColor} xlinkHref="#b" />
        </G>
        <Text fill={Colors.textLight} fontSize={wp('3%')} transform="translate(-1 2)">
          <TSpan x={wp('5%')} y={wp('5%')}>{label}</TSpan>
        </Text>
      </G>
    </Svg>
  </View>
);

export default StatusBanner;
