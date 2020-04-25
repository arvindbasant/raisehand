import * as React from 'react';
import {StatusBar, StyleSheet, View, Alert, Easing} from 'react-native';
import {SplashScreen} from 'expo';
import * as Font from 'expo-font';
import {Ionicons} from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets, CardStyleInterpolators} from '@react-navigation/stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import {ThemeProvider} from 'react-native-elements';
import {StoreProvider} from './context';
import SignInScreen from "./screens/SignInScreen";
import {useReducer} from "react";
import AuthContext from "./context/authContext";
import SignUpScreen from "./screens/SignUpScreen";
import {firebase} from './utils/firebase';
import Colors from './constants/Colors';
import PasswordResetScreen from "./screens/PasswordResetScreen";
import log from './apis/logApi';
import {addUser} from "./apis/userApis";
import ErrorBoundary from "./components/ErrorBoundary";
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import Constants from "expo-constants";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Stack = createStackNavigator();

const theme = {
  Button: {
    raised: true,
  },
  colors: {
    primary: Colors.brand,
  },
};

const ScreenOptions = {
  headerStyle: {
    backgroundColor: Colors.tintColor,
    height: hp('10%')
  },
  headerTintColor: Colors.textLight,
  headerTitleStyle: {
    fontFamily: 'lato-bold',
    fontSize: wp('3%'),
  },
};

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const {getInitialState} = useLinking(containerRef);
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            isLoading: false,
            userId: action.payload,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            isLoading: false
          };
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userId: null,
    }
  );

  React.useEffect(() => {
    console.disableYellowBox = true;
    const onAuthStateChanged = async () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          dispatch({
            type: 'SIGN_IN',
            payload: user.uid,
          });
        } else {
          dispatch({type: 'SIGN_OUT'});
        }
      });
    };
    onAuthStateChanged();
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (email, password) => {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        let errorCode = error.code;
        await log({errorCode, email});
        Alert.alert('Login failed, wrong email or password.')
      }
    },
    socialSignIn: async (provider) => {
      let resType, token, credential;
      try {
        if (provider === 'facebook') {
          await Facebook.initializeAsync(Constants.manifest.extra.facebook.appId);
          const res = await Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile']});
          resType = res.type;
          token = res.token;
          credential = firebase.auth.FacebookAuthProvider.credential(token);
        } else {
          await GoogleSignIn.askForPlayServicesAsync();
          const res = await GoogleSignIn.signInAsync();
          resType = res.type;
          token = res.user.auth.idToken;
          credential = firebase.auth.GoogleAuthProvider.credential(token);
        }
        if (resType === 'success') {
          try {
            const res = await firebase.auth().signInWithCredential(credential);
            if (res.additionalUserInfo.isNewUser)
              await addUser(res.user.uid, {
                fullName: res.user.displayName ? res.user.displayName : '',
                email: res.user.email ? res.user.email : '',
                mobile: res.user.phoneNumber ? res.user.phoneNumber : '',
                photoURL: res.user.photoURL ? res.user.photoURL : '',
                emailVerified: res.user.emailVerified
              });
          } catch (error) {
            Alert.alert(error.code);
          }
        } else {
          Alert.alert('Login failed');
        }
      } catch ({message}) {
      }
    },
    signOut: async () => {
      await firebase.auth().signOut();
    },
    signUp: async (email, password) => {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), password);
        await addUser(res.user.uid, {userId: res.user.uid, email: res.user.email});
      } catch (error) {
        await log({'signUp': error});
        Alert.alert('Oops! error while creating user.');
      }
    },
    passwordReset: async (email) => {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
      } catch (error) {
        await log({'passwordReset': error});
        Alert.alert('Oops! error while resetting password.');
      }
    },
  }), []);


  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        setInitialNavigationState(await getInitialState());
        await Font.loadAsync({
          ...Ionicons.font,
          'lato': require('./assets/fonts/Lato-Regular.ttf'),
          'lato-bold': require('./assets/fonts/Lato-Bold.ttf'),
          'lora-italic': require('./assets/fonts/Lora-SemiBoldItalic.ttf'),
          'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
        });
      } catch (e) {
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete || state.isLoading) {
    return null;
  } else {

    return (
      <ErrorBoundary>
        <AuthContext.Provider value={{...authContext, userId: state.userId}}>
          <StoreProvider>
            <ThemeProvider theme={theme}>
              <React.Fragment>
                <View style={styles.container}>
                  {<StatusBar translucent backgroundColor={Colors.brand} />}
                  <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
                    <Stack.Navigator
                      screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                        ...TransitionPresets.SlideFromRightIOS
                      }}
                      headerMode="float"
                      animation="fade"
                    >
                      {state.isSignOut ? (
                        <>
                          <Stack.Screen
                            name="SignIn"
                            component={SignInScreen}
                            options={{
                              title: 'Sign in',
                              ...ScreenOptions,
                              animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
                            }}
                          />
                          <Stack.Screen
                            name={'SignUp'}
                            component={SignUpScreen}
                            options={{
                              title: 'Register to raisehand',
                              ...ScreenOptions,
                              animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
                            }}
                          />
                          <Stack.Screen
                            name={'PasswordReset'}
                            component={PasswordResetScreen}
                            options={{
                              title: 'Reset Password',
                              ...ScreenOptions,
                              animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
                            }}
                          />
                        </>
                      ) : (<Stack.Screen
                          name="raisehand"
                          options={{...ScreenOptions}}
                          component={BottomTabNavigator}/>
                      )}
                    </Stack.Navigator>
                  </NavigationContainer>
                </View>
              </React.Fragment>
            </ThemeProvider>
          </StoreProvider>
        </AuthContext.Provider>
      </ErrorBoundary>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
});
