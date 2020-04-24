import {firebase} from "./firebase";

const getCurrentDate = () => {
  return firebase.firestore.Timestamp.fromDate(new Date()).toDate();
}

const formatDateTime = (date) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  let d = date.toDate();
  return `${d.getDate()} ${months[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
};

const HTTP_RESPOSE = {
  'SUCCESS': 'SUCCESS',
  'FAILED': 'FAILED',
};

const validateEmail = email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const validateMobile = mobile => /^\d{10}$/.test(mobile);

const validatePassword = password => /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);

const isEmpty = (text) => text.trim() === '';

export {
  getCurrentDate,
  formatDateTime,
  validateEmail,
  validateMobile,
  validatePassword,
  isEmpty,
  HTTP_RESPOSE
};