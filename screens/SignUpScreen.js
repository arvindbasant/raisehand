import React, {useState} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import AuthContext from "../context/authContext";
import {InputField, ButtonField} from '../components/FormElements';
import Logo from '../components/Logo';
import Colors from '../constants/Colors';
import ValidationMessageBox from "../components/ValidationMessageBox";
import {validateEmail, validatePassword, isEmpty} from "../utils";

function SignUpScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [showRequired, setShowRequired] = useState({username: false, password: false, confirmPassword: false});
  const [error, setError] = useState('');

  const {signUp} = React.useContext(AuthContext);

  const createAccount = () => {
    setShowRequired({
      ...showRequired,
      username: isEmpty(username),
      password: isEmpty(password),
      confirmPassword: isEmpty(confirmPassword),
    });
    if (isEmpty(username) && isEmpty(password) && isEmpty(confirmPassword)) {
      setError('');
      return;
    }
    if (!validateEmail(username)) {
      setError('Enter valid email address.');
      return;
    } else {
      setError('');
    }
    if (password.length !== 0 && password !== confirmPassword) {
      setError('Password did not match');
      return;
    } else {
      setError('');
    }
    if (!validatePassword(password)) {
      setError('Invalid Password- should be 6-16 characters & at least one special character and a number');
      return;
    } else {
      setError('')
    }
    signUp(username, password);
  };

  return (
    <KeyboardAvoidingView {...(Platform.OS === 'ios' && {behavior: 'padding'})} enabled style=
      {{flexGrow: 1, height: '100%'}}>
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Logo/>
          <ValidationMessageBox error={error}/>
          <InputField
            onChange={setUsername}
            value={username}
            showRequired={showRequired.username}
            onBlur={() => setShowRequired({...showRequired, username: username.trim() === ''})}
            placeholder="Email" icon="ios-mail"/>
          <InputField
            onChange={setPassword}
            value={password}
            showRequired={showRequired.password}
            onBlur={() => setShowRequired({...showRequired, password: password.trim() === ''})}
            placeholder="Password" icon="ios-lock"
            secureTextEntry={true}/>
          <InputField
            onChange={setConfirmPassword}
            showRequired={showRequired.confirmPassword}
            onBlur={() => setShowRequired({...showRequired, confirmPassword: confirmPassword.trim() === ''})}
            value={confirmPassword} placeholder="Confirm Password" icon="ios-lock"
          />
          <ButtonField onPress={createAccount} text="Register" icon="ios-arrow-round-forward"/>
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

export default SignUpScreen;