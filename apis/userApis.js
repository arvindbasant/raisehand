import {firestore} from '../utils/firebase';
import {HTTP_RESPOSE} from "../utils";
import log from "./logApi";
import {User} from "../context/types";

const userRef = firestore.collection('users');

const addUser = async (userId, user) => {
  try {
    await userRef.doc(userId).set(user);
  } catch (error) {
    await log({error, user: {...user}, 'msg': 'addProfile'});
  }
};

const updateUser = async (userId, fields) => {
  try {
    await userRef.doc(userId).set(fields, {merge: true});
    return HTTP_RESPOSE.SUCCESS;
  } catch (error) {
    await log({error, userId, fields, 'msg': 'updateUser'});
    return HTTP_RESPOSE.FAILED;
  }
};

const getUser = async (userId) => {
  try {
    const doc = await userRef.doc(userId).get();
    if (doc.exists) {
      return doc.data();
    }
    return new User();
  } catch (error) {
    await log({error, userId, key, 'msg': 'getProfileForUser'});
    return HTTP_RESPOSE.FAILED;
  }
};

export {addUser, updateUser, getUser};
