import React from 'react';
import {Icon, Divider} from 'react-native-elements';
import {View, Text, TouchableOpacity, StyleSheet, Linking, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {formatDateTime} from '../utils';
import {TICKET_STATUS} from "../context/types";
import Screens from "../constants/Screens";
import StatusBanner from "./StatusBanner";
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';
import {renderIf, renderIfElse} from '../utils/renderIf';
import _ from 'lodash';
import {CardView} from "./FormElements";

const NameField = ({name}) => {
  return (
    <View style={{display: 'flex', alignItems: 'center', paddingTop: 5}}>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
};

const MobileField = ({mobile}) => {
  return (
    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 6,
        paddingRight: 6
      }}>
        <Ionicons name="md-call" size={14} color={Colors.textLight}/>
      </View>
      <Text style={[styles.mobileText]}>{mobile}</Text>
    </View>
  );
};

const IconBadge = ({children, text}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        width: 'auto',
        borderRadius: 12.5,
        borderColor: Colors.textLight,
        borderWidth: 1,
        backgroundColor: '#009fc7',
        margin: 4
      }}
    >
      {children}
      <Text style={{
        fontSize: 10,
        color: 'white',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 3,
        paddingLeft: 3
      }}>{text}</Text>
    </View>
  );
};

const AdultsChildren = ({adults, children}) => {
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    }}>
      <IconBadge text={`${adults} ADULTS`}>
        <Icon iconStyle={{fontSize: 14}} name={'users'} type='font-awesome' color='white'/>
      </IconBadge>
      {renderIf(children > 0, () => (
        <IconBadge text={`${children} CHILDREN`}>
          <Icon iconStyle={{fontSize: 14}} name={'child'} type='font-awesome' color='white'/>
        </IconBadge>
      ))}
    </View>
  )
};

const ItemsList = ({items}) => {
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
                size={14}
                color='white'
              />
            </IconBadge>
          </View>
        )
      })}
    </View>
  )
}

const UserLocation = ({location}) => {
  const handlePressDirections = async () => {
    try {
      if (location.fetchedLocation.error === '' && location.fetchedLocation.location !== '') {
        const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
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
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5
    }}>
      <TouchableOpacity style={{
        display: 'flex',
        height: 28,
        width: 28,
        borderRadius: 14,
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
        margin: 2,
      }} onPress={handlePressDirections}>
        <Icon name='location' type='evilicon' color={Colors.textLight} size={26}/>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '400',
          display: 'flex',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}
      >
        {location.enteredLocation}
      </Text>
    </View>
  )
}

const DateTimeLabel = ({date}) => (<View
  style={{position: 'absolute'}}>
  <Text
    style={{
      fontSize: 10,
      color: Colors.border,
      fontFamily: 'lato-bold',
      padding: 10
    }}>{formatDateTime(date)}</Text>
</View>);

const Appreciation = ({message, icon}) => (
  <View
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }}
  >
    <Ionicons style={{paddingRight: 20}} name={icon} color={Colors.textLight} size={24}/>
    <Text style={{
      color: 'white',
      fontSize: 16,
      fontFamily: 'lato'
    }}>{message}</Text>
  </View>
);

const ShowAppreciations = ({screen, status}) => {
  return (
    <View>
      {renderIfElse(screen === Screens.SERVICE, () => (
        <Appreciation message={'Thanks for your service!!'} icon={'md-thumbs-up'}/>
      )).elseRender(() => (renderIfElse(status === TICKET_STATUS.CANCELLED,
        () => <Appreciation message={'Request cancelled.'} icon={'ios-notifications'}/>)
        .elseRender(() => <Appreciation message={'Thanks for using raisehand!!'} icon={'md-happy'}/>)))}
    </View>
  )
};

const CardFooter = ({actions, ticket, screen, onPress}) => (<View style={styles.buttonContainer}>{
  actions.length ? actions.map((action, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(ticket, `${screen.toUpperCase()}_${action}`)}>
      <View style={index ? styles.outlinedButton : styles.filledButton}>
        <Text style={styles.buttonText}>{action}</Text>
      </View>
    </TouchableOpacity>
  )) : <ShowAppreciations screen={screen} status={ticket.info.status}/>
}</View>);

const getTicketStatusLabel = (screen, status) => {
  if (screen === Screens.HELP_STATUS && (status === TICKET_STATUS.SHORTLISTED || status === TICKET_STATUS.SHORTLISTED_REMOVED || status === TICKET_STATUS.SERVICE_CANCELLED))
    return TICKET_STATUS.ACTIVE;
  return status;
}

const TicketCard = ({ticket, onPress, getActions, screen}) => {
  const {status, createdDate, name, mobile, adults, items, location, children} = ticket.info;
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
        <DateTimeLabel date={createdDate}/>
        <View
          style={{
            right: 0,
            position: 'absolute',
            paddingRight: 36,
            top: 25
          }}
        >
          <StatusBanner label={statusLabel}/>
        </View>
        <NameField name={name}/>
        <MobileField mobile={mobile}/>
        <AdultsChildren adults={adults} children={children}/>
        <ItemsList items={items}/>
        <UserLocation location={location}/>
        <Divider style={{backgroundColor: 'gray', marginTop: 10, marginBottom: 2}}/>
        <CardFooter actions={actions} ticket={ticket} screen={screen} onPress={onPress}/>
      </CardView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5,
    marginTop: 10
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: Colors.textLight,
    backgroundColor: 'transparent',
    height: 32,
    width: 100,
    borderRadius: 16,
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledButton: {
    borderWidth: 1,
    borderColor: Colors.tintColor,
    backgroundColor: Colors.tintColor,
    height: 32,
    width: 100,
    borderRadius: 16,
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: '600'
  },
  container: {
    backgroundColor: Colors.dark,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5
  },
  nameText: {
    color: Colors.textLight,
    fontSize: 18,
    fontFamily: 'lato-bold',
    textAlign: 'center',
    width: 175,
    paddingBottom: 5
  },
  mobileText: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: 'lato-bold',
    paddingBottom: 10,
  }
});

export {TicketCard};