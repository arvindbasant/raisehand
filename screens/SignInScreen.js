import React, {useState} from "react";
import {View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import AuthContext from "../context/authContext";
import {Text} from 'react-native';
import Logo from '../components/Logo';
import {ButtonField, FacebookButton, GoogleButton, InputField, InputLink} from '../components/FormElements';
import Colors from '../constants/Colors';
import {validateEmail} from "../utils";
import ValidationMessageBox from "../components/ValidationMessageBox";
import {renderIf} from "../utils/renderIf";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function SignInScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showRequired, setShowRequired] = useState({username: false, password: false});
  const [error, setError] = useState('');
  const {signIn, socialSignIn} = React.useContext(AuthContext);

  const createAccount = () => {
    navigation.navigate('SignUp');
  };

  const resetPassword = () => {
    navigation.navigate('PasswordReset');
  };

  const onSignInPress = () => {
    if (!validateEmail(username)) {
      setError('Enter valid email address.');
    } else {
      setError('');
    }
    if (username.length > 0 && password.length > 0 && error === '') {
      signIn(username, password);
    }
  }

  return (
    <KeyboardAvoidingView {...(Platform.OS === 'ios' && {behavior: 'padding'})} enabled style=
      {{flexGrow: 1, height: '100%'}}>
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Logo style={{marginBottom: wp('5%')}}/>
          <GoogleButton onPress={() => socialSignIn('google')} text="Sign in with Google"
                        icon="ios-arrow-round-forward"/>
          <FacebookButton onPress={() => socialSignIn('facebook')} text="Continue with Facebook"
                          icon="ios-arrow-round-forward"/>
          <View style={{alignItems: 'center', paddingVertical: wp('3%')}}>
            <Text style={{color: Colors.border, fontSize: wp('3%')}}>──────── OR ────────</Text>
          </View>
          {renderIf(error !== '', () => <ValidationMessageBox error={error}/>)}
          <InputField
            onChange={setUsername}
            value={username}
            showRequired={showRequired.username}
            onBlur={() => setShowRequired({...showRequired, username: username.trim() === ''})}
            placeholder="Email"
            icon="ios-mail"
          />
          <InputField
            onChange={setPassword}
            value={password}
            showRequired={showRequired.password}
            onBlur={() => setShowRequired({...showRequired, password: password.trim() === ''})}
            placeholder="Password"
            icon="ios-lock"
            secureTextEntry={true}/>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 15
          }}>
            <InputLink onPress={resetPassword} text="Forgot Password?"/>
          </View>
          <ButtonField onPress={onSignInPress} text="Login" icon="ios-arrow-round-forward"/>
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerLinkLabel}>
              Don't have an account?
            </Text>
            <InputLink onPress={createAccount} text="Register"/>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: wp('80%'),
    paddingTop: wp('4%'),
    
  },

  registerLinkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp('4%'),
    marginBottom: wp('10%'),
  },
  registerLinkLabel: {
    fontSize: wp('2.75%'),
    fontWeight: '600',
    fontFamily: 'lato-bold',
    color: Colors.textDark,
  }
});

export default SignInScreen;