import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Colors from '../constants/Colors';
import {
  InputField,
  ButtonField,
  CardView,
  CheckBoxField,
  InputLink,
} from '../components/FormElements';
import {useStore} from '../context';
import AuthContext from '../context/authContext';
import {renderIfElse} from "../utils/renderIf";
import {HTTP_RESPOSE, isEmpty, validateMobile} from "../utils";
import {Avatar} from "react-native-elements";
import {clearState, setFetching, setUser} from "../context/actions";
import ValidationMessageBox from "../components/ValidationMessageBox";
import log from "../apis/logApi";
import Loader from "../components/Loader";
import LocationInputField from "../components/LocationInputField";
import * as WebBrowser from 'expo-web-browser';
import {getUser, updateUser} from "../apis/userApis";
import {User} from "../context/types";

const UserProfile = () => {

  const {state, dispatch} = useStore();
  const {user, fetching} = state;
  const {signOut, userId} = React.useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [required, setRequired] = useState({email: false, fullName: false, mobile: false});
  const [error, setError] = useState('');
  const [userLocal, setUserLocal] = useState(new User());

  useEffect(() => {
    async function fetchUser() {
      try {
        dispatch(setFetching(true));
        const res = await getUser(userId);
        if (res.fullName === '') {
          setEditing(true);
        } else {
          dispatch(setUser({...state.user, ...res}));
          setUserLocal({...userLocal, ...res});
          setEditing(false);
        }
        dispatch(setFetching(false));
      } catch (error) {
        dispatch(setFetching(false));
        await log({error, msg: 'fetchUser'});
      }
    }

    fetchUser();
  }, []);

  const setValue = (type, value) => {
    setUserLocal({...userLocal, [type]: value});
    if (type === 'location' && value.location && value.location.enteredLocation.trim() !== '')
      setRequired({...required, location: false});
  };
  const isUserFormValid = () => {
    setRequired({
      ...required,
      fullName: isEmpty(userLocal.fullName),
      email: isEmpty(userLocal.email),
      mobile: isEmpty(userLocal.mobile),
      location: isEmpty(userLocal.location.enteredLocation),
    });
    if (isEmpty(userLocal.fullName) && isEmpty(userLocal.email) && isEmpty(userLocal.mobile) && isEmpty(userLocal.location.enteredLocation)) {
      setError('');
      return false;
    }
    if (validateMobile(userLocal.mobile)) {
      setError('');
    } else {
      if (!isEmpty(userLocal.mobile))
        setError('Enter valid mobile number of 10 digits.');
      return false;
    }
    if (!isEmpty(userLocal.fullName) && !isEmpty(userLocal.mobile) && !isEmpty(userLocal.location.enteredLocation)) {
      return true
    }
  };
  const callApiToUpdateUser = async () => {
    try {
      const res = await updateUser(userId, {...userLocal});
      if (res === HTTP_RESPOSE.SUCCESS) {
        dispatch(setUser({...userLocal}));
        setEditing(false);
      }
    } catch (error) {
      await log({error, msg: 'callApiToUpdateUser', userId})
    }
  }

  const updateUserData = () => {
    if (isUserFormValid()) {
      callApiToUpdateUser();
    }
  }

  const clearStateAndSignOut = async () => {
    await signOut();
    dispatch(clearState());
  };

  const SignOutLink = () => {
    return (
      <View style={{
        display: "flex",
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 50
      }}>
        <InputLink onPress={clearStateAndSignOut} text={'Sign out!'} style={{fontSize: 22}}/>
      </View>
    );
  }

  const PrivacyLink = () => (
    <View style={{
      paddingTop: 50,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <InputLink
        text={'Privacy'}
        onPress={() => WebBrowser.openBrowserAsync('https://programdesignlab.com/raisehand_privacy_document')}/>
    </View>
  );

  const editingData = () => {
    setUserLocal(user);
    setEditing(true);
  }

  const UserCard = () => {

    const getAvatarText = () => {
      const nameParts = user.fullName.split(' ');
      let avatarText = '';
      nameParts.forEach((part, index) => {
        if (part.trim() !== '') {
          if (index > 1)
            return;
          avatarText += part.trim()[0].toUpperCase();
        }
      })
      return avatarText;
    }

    return (
      <View style={styles.userCard}>
        {
          renderIfElse(user.photoURL,
            () => <Avatar source={{uri: `${user.photoURL}?type=large`}} rounded size={'xlarge'}/>)
            .elseRender(() => (
                <Avatar rounded title={getAvatarText()} size={'xlarge'}/>
              )
            )
        }
        <Text style={styles.nameText}>{user.fullName}</Text>
        <Text style={styles.addressText}>{user.location.enteredLocation}</Text>
        <Text style={styles.mobileText}>{user.mobile}</Text>
        <InputLink onPress={editingData} text={'Edit User'}/>
        <SignOutLink/>
        <PrivacyLink/>
      </View>
    )
  }

  const cancelEdit = () => {
    setUserLocal(null);
    setEditing(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {
            renderIfElse(fetching, () => <Loader/>).elseRender(() =>

              renderIfElse(!editing, () => <UserCard/>).elseRender(
                () => (
                  <View>
                    <ValidationMessageBox error={error}/>
                    <InputField
                      placeholder="Full Name"
                      value={userLocal.fullName}
                      onChange={(text) => setValue('fullName', text)}
                      showRequired={required.fullName}
                      onBlur={() => setRequired({
                        ...required,
                        fullName: userLocal.fullName.trim() === ''
                      })}
                      icon="md-person"/>
                    <InputField
                      placeholder="Email"
                      value={userLocal.email}
                      onChange={(text) => setValue('email', text)}
                      showRequired={required.email}
                      onBlur={() => setRequired({
                        ...required,
                        email: userLocal.email.trim() === ''
                      })}
                      icon="ios-mail"/>
                    <InputField
                      placeholder="Mobile Number"
                      value={userLocal.mobile}
                      onChange={(text) => setValue('mobile', text)}
                      maxLength={10}
                      showRequired={required.mobile}
                      onBlur={() => setRequired({
                        ...required,
                        mobile: userLocal.mobile.trim() === ''
                      })}
                      icon="md-call"/>
                    <LocationInputField
                      location={userLocal.location}
                      onChange={location => setValue('location', location)}
                      triggerFetch={user.location.enteredLocation === ''}
                    />
                    <CardView style={{paddingTop: 10, paddingBottom: 10}}>
                      <CheckBoxField
                        title="Are you a volunteer or associated with any NGO?"
                        checked={userLocal.isServiceUser}
                        onPress={() => setValue('isServiceUser', !userLocal.isServiceUser)}/>
                    </CardView>
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingTop: 10,
                        paddingBottom: 20
                      }}
                    >
                      <InputLink onPress={cancelEdit} text={'Cancel'} style={{fontSize: 16, paddingTop: 10}}/>
                    </View>
                    <View style={{
                      paddingLeft: 40,
                      paddingRight: 40,
                    }}>
                      <ButtonField onPress={updateUserData} text="Update"/>
                    </View>
                    <SignOutLink/>
                    <PrivacyLink/>
                  </View>
                )))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    padding: 20,
  },
  userCard: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'lato-bold',
    fontSize: 22,
    color: Colors.textDark,
    lineHeight: 40,
    marginTop: 20
  },
  addressText: {
    fontFamily: 'lato',
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    textAlign: 'center'
  },
  mobileText: {
    fontFamily: 'lato-bold',
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
  }
});

export default UserProfile;