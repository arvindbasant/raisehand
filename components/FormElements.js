import React from 'react';
import {CheckBox} from 'react-native-elements';
import {View, StyleSheet, TouchableOpacity, TextInput, Text, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {renderIf} from "../utils/renderIf";
import GoogleIcon from "./GoogleIcon";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const CheckBoxField = ({title, checked, onPress}) => {
  return (
    <CheckBox
      containerStyle={styles.formElemContainerStyle}
      size={wp('4.5%')}
      title={title}
      checked={checked}
      onPress={onPress}
      textStyle={{
        color: Colors.textDark,
        fontFamily: 'lato-bold',
        fontSize: wp('2.75%')
      }}
    />
  );
};

const CardView = ({children, style}) => {
  return (
    <View style={[styles.card, styles.shadow, style]}>
      {children}
    </View>
  );
};

const InputLink = ({onPress, text, style}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[{
        color: Colors.brand,
        fontFamily: 'lato-bold',
        fontSize: wp('2.75%'),
        padding: wp('1.5%'),
      }, style]}>{text}</Text>
    </TouchableOpacity>
  );
};

const InputField = ({onChange, value, placeholder, icon, showRequired, style, ...rest}) => {
  return (
    <View style={[styles.inputTextWrapper, styles.shadow]}>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: wp('5.5%')}}>
        <Ionicons name={icon} size={wp('5.5%')} color={Colors.brand}/>
      </View>
      <TextInput
        style={[styles.inputText, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        {...rest}
      />
      {renderIf(showRequired === true, () => (
          <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={styles.asterisk}>*</Text>
          </View>
        )
      )}
    </View>
  );
};

const ButtonField = ({onPress, text, icon, style}) => {
  return (
    <TouchableOpacity style={[styles.buttonField, style]} onPress={onPress}>
      <Text style={{
        fontFamily: 'lato-bold',
        fontSize: wp('3%'),
        color: Colors.textLight,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {text}
      </Text>
      {icon && <View style={{
        padding: wp('1%'),
      }}>
        <Ionicons name={icon} size={wp('7%')} color={Colors.textLight}/>
      </View>}
    </TouchableOpacity>

  )
}

const GoogleButton = ({onPress, text}) => {
  return (
    <TouchableOpacity style={[styles.buttonField, {
      backgroundColor: 'white',
      justifyContent: 'center',
    }]} onPress={onPress}>
      <GoogleIcon/>
      <Text style={{
        fontFamily: 'roboto-medium',
        fontSize: wp('3%'),
        paddingLeft: wp('6%'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgba(0,0,0,0.54)'
      }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const FacebookButton = ({onPress, text}) => {
  return (
    <TouchableOpacity style={[styles.buttonField, {backgroundColor: '#4267B2'}]} onPress={onPress}>
      <Image source={require('../assets/images/f_logo_RGB-White_72.png')} style={{width: wp('6%'), height: wp('6%')}}/>
      <Text style={{
        fontFamily: 'roboto-medium',
        fontSize: wp('3%'),
        paddingLeft: wp('6%'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  formElemContainerStyle: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    margin: 0,
    padding: 0,
    flex: 1,
    height: wp('6.5%'),
    justifyContent: 'center'
  },
  buttonField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    paddingLeft: wp('3%'),
    paddingRight: wp('3%'),
    marginBottom: wp('2%'),
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: Colors.brand

  },
  inputTextWrapper: {
    flexDirection: 'row',
    borderRadius: wp('1%'),
    borderWidth: 0,
    borderColor: Colors.border,
    backgroundColor: Colors.textLight,
    marginBottom: hp('1%'),
    paddingLeft: wp('2%'),
  },
  inputText: {
    flex: 1,
    fontFamily: 'lato',
    backgroundColor: Colors.textLight,
    paddingLeft: wp('1%'),
    color: Colors.textDark,
    height: wp('12%'),
    fontSize: wp('3%'),
    marginRight: wp('3%'),
  },
  card: {
    display: 'flex',
    borderRadius: wp('1%'),
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: Colors.textLight,
    marginBottom: hp('1%'),
    padding: wp('1%'),
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
    fontSize: wp('5%'),
    color: 'red',
    paddingRight: wp('1%')
  }
});


export {InputField, CheckBoxField, CardView, ButtonField, GoogleButton, FacebookButton, InputLink};