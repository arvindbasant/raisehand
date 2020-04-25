import React from 'react';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ServiceScreen from '../screens/ServiceScreen';
import Screens from "../constants/Screens";
import Colors from '../constants/Colors';
import HelpScreen from '../screens/HelpScreen';
import UserProfile from '../screens/UserProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp , heightPercentageToDP as hp} from 'react-native-responsive-screen';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = Screens.HOME;

export default function BottomTabNavigator({ navigation, route }) {

  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeBackgroundColor: Colors.background,
        inactiveBackgroundColor: Colors.background,
        activeTintColor: Colors.tintColor,
        style:{
          height: hp('8%'),
        }
      }}
    >
      <BottomTab.Screen
        name={Screens.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-home" />,
        }}
      />
      <BottomTab.Screen
        name={Screens.REQUEST}
        component={HelpScreen}
        options={{
          title: 'Help',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-hand" />,
        }}
      />
      <BottomTab.Screen
        name={Screens.SERVICE}
        component={ServiceScreen}
        options={{
          title: 'Serve',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-happy" />,
        }}
      />

      <BottomTab.Screen
        name={Screens.USER_PROFILE}
        component={UserProfile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {
    case Screens.HOME:
      return 'About raisehand!!';
    case Screens.REQUEST:
      return 'Request for help';
    case Screens.SERVICE:
      return 'Service';
    case Screens.USER_PROFILE:
      return 'My Details';
  }
}
