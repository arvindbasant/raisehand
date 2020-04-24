import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {renderIf} from "../utils/renderIf";
import {Icon} from "react-native-elements";
import {LatoText} from "./StyledText";
import React, {useEffect, useState} from "react";
import log from "../apis/logApi";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Constants from "expo-constants";

const LocationInputField = ({onChange, location, triggerFetch = false, style = undefined, ...rest}) => {

  const [triggerFetchLocation, setTriggerFetchLocation] = useState(triggerFetch);
  const [showRequired, setShowRequired] = useState(false);

  const onChangeText = (text) => {
    onChange({...location, enteredLocation: text});
    if (text.trim() === '') {
      setShowRequired(true);
    } else {
      setShowRequired(false);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    const fetchLocation = async () => {
      try {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          onChange({
            ...location,
            fetchedLocation: {...location.fetchedLocation, error: 'Permission to access location was denied'}
          });
        }else {
          let currentLocation = await Location.getCurrentPositionAsync({});
          const url = `${Constants.manifest.extra.locationIQ.endPoint}/v1/reverse.php?key=${Constants.manifest.extra.locationIQ.apiKey}&lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&format=json`;
          const response = await fetch(url, {signal: abortController.signal});
          const data = await response.json();
          if (data) {
            onChange({
              ...location,
              enteredLocation: data.display_name,
              fetchedLocation: {
                location: {
                  address: data.address,
                  addressLine: data.display_name,
                  latitude: data.lat,
                  longitude: data.lon,
                },
                error: ''
              }
            });
          }
          setTriggerFetchLocation(false);
          setShowRequired(false);
        }
      } catch (error) {
        // dispatch(setFetching(false));
        await log({error, msg: 'err in fetchLocation'});
      }
    };

    if (triggerFetchLocation)
      fetchLocation();

    return () => abortController.abort();

  }, [triggerFetchLocation]);

  return (
    <View style={[styles.inputTextWrapper, styles.shadow, {flexDirection: 'column'}]}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 25}}>
          <Ionicons name={'md-map'} size={22} color={Colors.brand}/>
        </View>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <TextInput
            style={[styles.inputText, style, {backgroundColor: 'white'}]}
            placeholder={'Address'}
            value={location.enteredLocation}
            onChangeText={text => onChangeText(text)}
            {...rest}
          />
        </View>

        {renderIf(showRequired, () => (
            <View style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 10
            }}>
              <Text style={styles.asterisk}>*</Text>
            </View>
          )
        )}
      </View>
      {renderIf(showRequired, () => (
        <View style={{borderTopColor: Colors.border, borderTopWidth: 1, marginRight: 10}}>
          <TouchableOpacity onPress={() => setTriggerFetchLocation(true)}
                            style={{flexDirection: 'row', flex: 1, paddingTop: 15, paddingBottom: 15}}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 25}}>
              <Icon name='location' type='evilicon' color={Colors.textDark} size={16}/>
            </View>
            <LatoText style={{fontSize: 12, color:Colors.tintColor}}>Get current location</LatoText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({

  inputTextWrapper: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: 55,
    height: 'auto',
    borderRadius: 5,
    borderWidth: 0,
    borderColor: Colors.border,
    backgroundColor: Colors.textLight,
    marginBottom: 10,
    paddingLeft: 10,
  },
  inputText: {
    flex: 1,
    fontFamily: 'lato',
    backgroundColor: Colors.textLight,
    paddingLeft: 5,
    color: Colors.textDark,
    height: 55,
    fontSize: 16,
    marginRight: 15,
  },
  shadow: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8
  },
  asterisk: {
    fontFamily: 'lato',
    fontSize: 24,
    color: 'red',
    paddingRight: 5
  }
});

export default LocationInputField;