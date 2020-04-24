import React from 'react';
import {CheckBox} from 'react-native-elements';
import {View, StyleSheet, TouchableOpacity, TextInput, Text, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {renderIf} from "../utils/renderIf";
import GoogleIcon from "./GoogleIcon";

const CheckBoxField = ({title, checked, onPress}) => {
  return (
    <CheckBox
      containerStyle={styles.formElemContainerStyle}
      title={title}
      checked={checked}
      onPress={onPress}
      textStyle={{
        color: Colors.textDark,
        fontFamily: 'lato',
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
        fontSize: 14,
        padding: 5
      }, style]}>{text}</Text>
    </TouchableOpacity>
  );
};

const InputField = ({onChange, value, placeholder, icon, showRequired, style, ...rest}) => {
  return (
    <View style={[styles.inputTextWrapper, styles.shadow]}>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 25}}>
        <Ionicons name={icon} size={22} color={Colors.brand}/>
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

const ButtonField = ({onPress, text, icon}) => {
  return (
    <TouchableOpacity style={styles.buttonField} onPress={onPress}>
      <Text style={{
        fontFamily: 'lato',
        fontSize: 16,
        color: Colors.textLight,
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {text}
      </Text>
      {icon && <View style={{
        padding: 8,
      }}>
        <Ionicons name={icon} size={32} color={Colors.textLight}/>
      </View>}
    </TouchableOpacity>

  )
}

const GoogleButton = ({onPress, text}) => {
  return (
    <TouchableOpacity style={[styles.buttonField, {
      backgroundColor: 'white',
      justifyContent: 'center',
      height: 50,
    }]} onPress={onPress}>
      <GoogleIcon/>
      <Text style={{
        fontFamily: 'roboto-medium',
        fontSize: 14,
        paddingLeft: 32,
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
      <Image source={require('../assets/images/f_logo_RGB-White_72.png')} style={{width: 28, height: 28}}/>
      <Text style={{
        fontFamily: 'roboto-medium',
        fontSize: 14,
        paddingLeft: 32,
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
    height: 35,
    justifyContent: 'center'
  },
  buttonField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: Colors.brand

  },
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
  card: {
    display: 'flex',
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: Colors.textLight,
    marginBottom: 10,
    padding: 5,
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


export {InputField, CheckBoxField, CardView, ButtonField, GoogleButton, FacebookButton, InputLink};