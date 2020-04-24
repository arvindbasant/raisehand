import React from 'react';
import TicketCardList from '../components/TicketCardList';
import * as Animatable from "react-native-animatable";


const HelpStatusScreenTab = ({isStatusTab}) => {
  return (
    <Animatable.View
      animation='slideInLeft'
      duration={400}
      delay={100}
      useNativeDriver
      style={{flex: 1}}
    >
      {
        isStatusTab && <TicketCardList statusArr={[]} screen={'HELP_STATUS'}/>
      }
    </Animatable.View>
  );
};

HelpStatusScreenTab.navigationOptions = {
  header: null,
};

export default HelpStatusScreenTab;