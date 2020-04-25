

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Logo = ({style}) => (
  <View style={[{
    marginTop: hp('8%'),
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }, style]}>
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: wp('2.5%')}}>
      <Ionicons name="ios-hand" size={wp('12.5%')} color="#e91e63" />
    </View>
    <Text style={{
      color: '#e91e63',
      fontSize: wp('6.2%'),
      fontFamily: 'lato'
    }}>raisehand</Text>
  </View>
);

export default Logo;