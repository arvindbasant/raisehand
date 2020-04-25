import React, { useState } from 'react';
import HelpScreenTab from './HelpScreenTab';
import HelpStatusScreenTab from './HelpStatusScreenTab';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { useStore } from "../context";
import { setTabIndex } from "../context/actions";
import { renderIfElse } from "../utils/renderIf";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HelpScreen = ({ route, navigation }) => {
  const { state, dispatch } = useStore();
  const { tabIndex } = state;

  return (
    <View style={styles.container}>
      <View style={{
        paddingHorizontal: wp('20%'),
        paddingVertical: hp('2.5%'),
        backgroundColor: 'transparent',
      }}>
        <SegmentedControlTab
          values={["Help", "Status"]}
          selectedIndex={tabIndex}
          onTabPress={(index) => dispatch(setTabIndex(index))}
          tabsContainerStyle={{
            backgroundColor: Colors.tintColor,
            borderRadius: wp('1%'),
            height: wp('6.75%'),
            shadowColor: Colors.shadow,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: wp('1.5%'),
            elevation: 8
          }}
          tabStyle={{ backgroundColor: Colors.textDark, borderWidth: 0, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}
          activeTabStyle={{ backgroundColor: Colors.tintColor, borderRadius: wp('1%') }}
          tabTextStyle={{ color: Colors.border, fontFamily: 'lato', fontSize: wp('3%') }}
          activeTabTextStyle={{ color: Colors.textLight, fontFamily: 'lato' }}
        />
      </View>
      {
        renderIfElse(tabIndex,
          () => <HelpStatusScreenTab route={route} navigation={navigation} isStatusTab={true} />)
          .elseRender(() => <HelpScreenTab route={route} navigation={navigation} />)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  }
});

export default HelpScreen;