import React from 'react';
import { Icon, Divider } from 'react-native-elements';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '../utils';
import { TICKET_STATUS } from "../context/types";
import Screens from "../constants/Screens";
import StatusBanner from "./StatusBanner";
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';
import { renderIf, renderIfElse } from '../utils/renderIf';
import _ from 'lodash';
import { CardView } from "./FormElements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NameField = ({ name }) => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', paddingTop: 5 }}>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
};

const MobileField = ({ mobile }) => {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: wp('1.5%') }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('1%')
      }}>
        <Ionicons name="md-call" size={wp('3%')} color={Colors.border} />
      </View>
      <Text style={[styles.mobileText]}>{mobile}</Text>
    </View>
  );
};

const IconBadge = ({ children, text }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('1%'),
        width: 'auto',
        borderRadius: wp('3%'),
        borderColor: Colors.textLight,
        borderWidth: 1,
        backgroundColor: '#009fc7',
        margin: wp('1%'),
      }}
    >
      {children}
      <Text style={{
        fontSize: wp('2.5%'),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('0.75%'),
        textTransform: 'uppercase'
      }}>{text}</Text>
    </View>
  );
};

const AdultsChildren = ({ adults, children }) => {
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      fontFamily: 'lato-bold'
    }}>
      <IconBadge text={`${adults} ADULTS`}>
        <Icon iconStyle={{ fontSize: wp('3%') }} name={'users'} type='font-awesome' color='white' />
      </IconBadge>
      {renderIf(children > 0, () => (
        <IconBadge text={`${children} CHILDREN`}>
          <Icon iconStyle={{ fontSize: wp('3%') }} name={'child'} type='font-awesome' color='white' />
        </IconBadge>
      ))}
    </View>
  )
};

const ItemsList = ({ items }) => {
  let icon;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
      {items.map((item, index) => {
        icon = item === 'food' ? 'ios-basket' : (item === 'medical' ? 'ios-medical' : 'ios-business');
        return (
          <View key={index}>
            <IconBadge text={item}>
              <Ionicons
                name={icon}
                size={wp('3%')}
                color='white'
              />
            </IconBadge>
          </View>
        )
      })}
    </View>
  )
}

const UserLocation = ({ location }) => {
  const handlePressDirections = async () => {
    try {
      if (location.fetchedLocation.error === '' && location.fetchedLocation.location !== '') {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${location.fetchedLocation.location.latitude},${location.fetchedLocation.location.longitude}`;
        const label = 'Custom Label';
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
        await Linking.openURL(url);
      }
    } catch (error) {
    }
  };
  return (
    <View style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      paddingVertical: wp('2%'),
      paddingHorizontal: wp('1%'),
    }}>
      <TouchableOpacity style={{
        display: 'flex',
        height: wp('6%'),
        width: wp('6%'),
        borderRadius: wp('3%'),
        backgroundColor: Colors.tintColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.textLight,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
        margin: wp('0.75%')
      }} onPress={handlePressDirections}>
        <Icon name='location' type='evilicon' color={Colors.textLight} size={wp('5%')} />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: wp('2.5%'),
          color: Colors.border,
          fontFamily: 'lato',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {location.enteredLocation}
      </Text>
    </View>
  )
}

const DateTimeLabel = ({ date }) => (<View>
  <Text
    style={{
      fontSize: wp('2%'),
      color: Colors.border,
      fontFamily: 'lato-bold',
      padding: wp('2%'),
    }}>{formatDateTime(date)}</Text>
</View>);

const Appreciation = ({ message, icon }) => (
  <View
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }}
  >
    <Ionicons style={{ paddingRight: 20 }} name={icon} color={Colors.textLight} size={24} />
    <Text style={{
      color: 'white',
      fontSize: wp('3%'),
      fontFamily: 'lato'
    }}>{message}</Text>
  </View>
);

const ShowAppreciations = ({ screen, status }) => {
  return (
    <View>
      {renderIfElse(screen === Screens.SERVICE, () => (
        <Appreciation message={'Thanks for your service!!'} icon={'md-thumbs-up'} />
      )).elseRender(() => (renderIfElse(status === TICKET_STATUS.CANCELLED,
        () => <Appreciation message={'Request cancelled.'} icon={'ios-notifications'} />)
        .elseRender(() => <Appreciation message={'Thanks for using raisehand!!'} icon={'md-happy'} />)))}
    </View>
  )
};

const CardFooter = ({ actions, ticket, screen, onPress }) => (<View style={styles.buttonContainer}>{
  actions.length ? actions.map((action, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(ticket, `${screen.toUpperCase()}_${action}`)}>
      <View style={index ? styles.outlinedButton : styles.filledButton}>
        <Text style={styles.buttonText}>{action}</Text>
      </View>
    </TouchableOpacity>
  )) : <ShowAppreciations screen={screen} status={ticket.info.status} />
}</View>);

const getTicketStatusLabel = (screen, status) => {
  if (screen === Screens.HELP_STATUS && (status === TICKET_STATUS.SHORTLISTED || status === TICKET_STATUS.SHORTLISTED_REMOVED || status === TICKET_STATUS.SERVICE_CANCELLED))
    return TICKET_STATUS.ACTIVE;
  return status;
}

const TicketCard = ({ ticket, onPress, getActions, screen }) => {
  const { status, createdDate, name, mobile, adults, items, location, children } = ticket.info;
  let statusLabel = getTicketStatusLabel(screen, status);
  _.debounce(onPress);
  const actions = getActions();
  return (
    <Animatable.View
      animation='fadeIn'
      duration={400}
      delay={100}
      useNativeDriver={true}
    >

      <CardView style={styles.container}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <DateTimeLabel date={createdDate} />
          <NameField name={name} />
          <StatusBanner label={statusLabel} />
        </View>
        <MobileField mobile={mobile} />
        <AdultsChildren adults={adults} children={children} />
        <ItemsList items={items} />
        <UserLocation location={location} />
        <Divider style={{ backgroundColor: 'gray', marginTop: wp('2%'), marginBottom: wp('0.5%') }} />
        <CardFooter actions={actions} ticket={ticket} screen={screen} onPress={onPress} />
      </CardView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: wp('1%'),
    marginTop: wp('2%'),
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: Colors.textLight,
    backgroundColor: 'transparent',
    height: wp('7%'),
    width: wp('20%'),
    borderRadius: wp('3.5%'),
    padding: wp('1.5%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledButton: {
    borderWidth: 1,
    borderColor: Colors.tintColor,
    backgroundColor: Colors.tintColor,
    height: wp('8%'),
    width: wp('30%'),
    borderRadius: wp('4%'),
    padding: wp('1.5%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: wp('2.5%'),
    fontFamily: 'lato-bold'
  },
  container: {
    backgroundColor: Colors.dark,
    borderRadius: wp('1%'),
    borderWidth: wp('0.25%'),
    borderColor: 'transparent',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    marginHorizontal: wp('5%'),
    marginTop: wp('1%'),
  },
  nameText: {
    color: Colors.textLight,
    fontSize: wp('4%'),
    fontFamily: 'lato-bold',
    textAlign: 'center',
    width: wp('35%'),
    paddingBottom: wp('1%'),
  },
  mobileText: {
    color: Colors.border,
    fontSize: wp('2.75%'),
    fontFamily: 'lato-bold',
  }
});

export { TicketCard };