

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Logo = () => (
  <View style={{
    height: 100,
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: 10}}>
      <Ionicons name="ios-hand" size={64} color="#e91e63" />
    </View>
    <Text style={{
      color: '#e91e63',
      fontSize: 32,
      fontFamily: 'lato'
    }}>raisehand</Text>
  </View>
);

export default Logo;