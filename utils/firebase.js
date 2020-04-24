import firebase from 'firebase';
import '@firebase/firestore';// Should not be used elsewhere in the project
import Constants from 'expo-constants';
import {decode, encode} from 'base-64'

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}
firebase.initializeApp(Constants.manifest.extra.firebase);
const firestore = firebase.firestore();

export {firebase, firestore};