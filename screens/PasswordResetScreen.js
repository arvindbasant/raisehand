import React, {useState} from "react";
import {View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView} from "react-native";
import AuthContext from "../context/authContext";
import {InputField, ButtonField} from '../components/FormElements';
import Logo from '../components/Logo';
import Colors from '../constants/Colors';
import {validateEmail} from "../utils";
import ValidationMessageBox from "../components/ValidationMessageBox";
import log from "../apis/logApi";


function PasswordResetScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [showRequired, setShowRequired] = useState({email: false});
  const [error, setError] = useState('');

  const {passwordReset} = React.useContext(AuthContext);

  const resetPassword = async () => {
    setShowRequired({
      ...showRequired,
      email: email === '',
    });
    if (email.trim() === '') {
      setError('');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter valid email address.');
      return;
    } else {
      setError('');
    }
    try {
      await passwordReset(email);
      setEmail('');
      navigation.navigate('SignIn');
      Alert.alert('Password reset mail sent successfully');
      await log({email, msg: 'password successfully reset'});
    } catch (error) {

    }
  };

  return (
    <KeyboardAvoidingView {...(Platform.OS === 'ios' && {behavior: 'padding'})} enabled style=
      {{flexGrow: 1, height: '100%'}}>
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Logo/>
          <ValidationMessageBox error={error}/>
          <InputField
            onChange={setEmail}
            value={email}
            showRequired={showRequired.email}
            onBlur={() => setShowRequired({...showRequired, email: email.trim() === ''})}
            placeholder="Email"
            icon="ios-mail"/>
          <ButtonField onPress={resetPassword} text="Reset Password"/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
})

export default PasswordResetScreen;