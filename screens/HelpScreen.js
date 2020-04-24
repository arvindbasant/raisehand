import React, {useState} from 'react';
import HelpScreenTab from './HelpScreenTab';
import HelpStatusScreenTab from './HelpStatusScreenTab';
import SegmentedControlTab from "react-native-segmented-control-tab";
import {View, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {useStore} from "../context";
import {setTabIndex} from "../context/actions";
import {renderIfElse} from "../utils/renderIf";

const HelpScreen = ({route, navigation}) => {
  const {state, dispatch} = useStore();
  const {tabIndex} = state;

  return (
    <View style={styles.container}>
      <View style={{
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
      }}>
        <SegmentedControlTab
          values={["Help", "Status"]}
          selectedIndex={tabIndex}
          onTabPress={(index) => dispatch(setTabIndex(index))}
          tabsContainerStyle={{
            backgroundColor: Colors.tintColor,
            borderRadius:
              5, height: 30,
            shadowColor: Colors.shadow,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 8
          }}
          tabStyle={{backgroundColor: Colors.textDark, borderWidth: 0, borderColor: 'transparent'}}
          activeTabStyle={{backgroundColor: Colors.tintColor, margin: 1, borderRadius: 5}}
          tabTextStyle={{color: Colors.border, fontFamily: 'lato'}}
          activeTabTextStyle={{color: Colors.textLight, fontFamily: 'lato'}}
        />
      </View>
      {
        renderIfElse(tabIndex,
          () => <HelpStatusScreenTab route={route} navigation={navigation} isStatusTab={true}/>)
          .elseRender(() => <HelpScreenTab route={route} navigation={navigation}/>)
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