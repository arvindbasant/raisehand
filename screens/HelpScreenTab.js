import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {InputField, CheckBoxField, CardView, ButtonField} from '../components/FormElements';
import {Icon} from 'react-native-elements';
import {addTicket} from '../apis/ticketApi';
import {saveAddressIndexInAlgolia} from '../apis/algoliaApi';
import {useStore} from '../context';
import {setTicket, setFetching, setTabIndex} from '../context/actions';
import {Counter} from '../components/Couter';
import {getCurrentDate, isEmpty, validateMobile} from "../utils";
import {Ticket, TICKET_STATUS} from "../context/types";
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';
import {renderIf, renderIfElse} from "../utils/renderIf";
import ValidationMessageBox from "../components/ValidationMessageBox";
import AuthContext from "../context/authContext";
import log from '../apis/logApi';
import Loader from "../components/Loader";
import LocationInputField from "../components/LocationInputField";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HelpScreenTab = () => {
  const {state, dispatch} = useStore();
  const {ticket, fetching} = state;
  const [showRequired, setShowRequired] = useState({name: false, mobile: false, items: false});
  const [error, setError] = useState('');
  const {userId} = useContext(AuthContext);

  const setValue = (type, value) => {
    if (type === 'items') {
      let {items} = ticket;
      if (items.includes(value))
        items = items.filter(item => item !== value)
      else
        items.push(value)

      value = items;
    }
    dispatch(setTicket({...ticket, [type]: value}));
  }

  const getTicketRequest = (userId) => {
    return {...ticket, createdDate: getCurrentDate(), userId, status: TICKET_STATUS.ACTIVE};
  }

  const isFormValid = () => {
    setShowRequired({
      ...showRequired,
      name: isEmpty(ticket.name),
      mobile: isEmpty(ticket.mobile),
      location: isEmpty(ticket.location.enteredLocation),
    });
    if (isEmpty(ticket.name) && isEmpty(ticket.mobile) && isEmpty(ticket.location.enteredLocation) && ticket.items.length === 0) {
      setError('');
      return false;
    }
    if (validateMobile(ticket.mobile)) {
      setError('');
    } else {
      if (!isEmpty(ticket.mobile))
        setError('Enter valid mobile number of 10 digits.');
      return false;
    }
    if (ticket.items.length === 0) {
      setError('At least one item should be selected.');
      return false;
    } else {
      setError('');
    }
    if (!isEmpty(ticket.name) && !isEmpty(ticket.mobile) && !isEmpty(ticket.location.enteredLocation) && ticket.items.length > 0) {
      return true
    }
  };

  const createTicket = async () => {
    try {
      dispatch(setFetching(true));
      const ticketId = await addTicket(getTicketRequest(userId));
      const objectId = await saveAddressIndexInAlgolia(ticketId, ticket.location.enteredLocation);
      await log({ticketId, objectId, msg: 'ticket created'});
      dispatch(setFetching(false));
      dispatch(setTicket(new Ticket()));
      dispatch(setTabIndex(1));
    } catch (error) {
      await log({error, msg: 'error in creating ticket'});
    }
  };

  const buttonPressed = () => {
    if (isFormValid()) {
      createTicket()
    }
  }


  return (
    <Animatable.View
      animation='fadeIn'
      duration={200}
      useNativeDriver
      style={{flex: 1}}
    >{renderIfElse(fetching, () => <Loader/>).elseRender(() => (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          {renderIf(error !== '', () => <ValidationMessageBox error={error}/>)}
          <InputField
            placeholder="Full Name"
            value={ticket.name}
            onChange={(text) => setValue('name', text)}
            showRequired={showRequired.name}
            onBlur={() => setShowRequired({...showRequired, name: ticket.name.trim() === ''})}
            icon="md-person"/>
          <InputField
            placeholder="Mobile Number"
            value={ticket.mobile}
            onChange={(text) => setValue('mobile', text)}
            maxLength={10}
            showRequired={showRequired.mobile}
            onBlur={() => setShowRequired({...showRequired, mobile: ticket.mobile.trim() === ''})}
            icon="md-call"/>
          <LocationInputField placeholder="Address"
                              location={ticket.location}
                              onChange={location => setValue('location', location)}
                              triggerFetch={ticket.location.enteredLocation === ''}/>
          <CardView>
            <View style={styles.counterWrapper}>
              <Icon iconStyle={{fontSize: wp('7%')}} name="user" type='font-awesome' color={Colors.brand}/>
              <Text style={styles.counterLabel}>Adults</Text>
              <Counter start={ticket.adults} min={1} max={10} onChange={count => setValue('adults', count)}/>
            </View>
            <View style={styles.counterWrapper}>
              <Icon iconStyle={{fontSize: wp('7%')}} name="child" type='font-awesome' color={Colors.brand}/>
              <Text style={styles.counterLabel}>Children</Text>
              <Counter start={ticket.children} min={0} max={5} onChange={count => setValue('children', count)}/>
            </View>
          </CardView>
          <CardView>
            <CheckBoxField title="Food" checked={ticket.items.includes('food')}
                           onPress={() => setValue('items', 'food')}/>
            <CheckBoxField title="Medical Support" checked={ticket.items.includes('medical')}
                           onPress={() => setValue('items', 'medical')}/>
            <CheckBoxField title="Shelter" checked={ticket.items.includes('shelter')}
                           onPress={() => setValue('items', 'shelter')}/>
          </CardView>
          <View style={styles.buttonContainer}>
            <ButtonField onPress={buttonPressed} text="Submit Request"/>
          </View>
        </View>
      </ScrollView>
    ))}
    </Animatable.View>
  );
};

HelpScreenTab.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: wp('5.5%'),
    paddingTop: hp('1%'),
    backgroundColor: Colors.background
  },
  checkboxWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonContainer: {
    marginTop: hp('2%'),
  },
  counterWrapper: {
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('1.5%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  counterLabel: {
    fontFamily: 'lato-bold',
    fontSize: wp('2.75%'),
    color: Colors.brand,
    fontWeight: '600',
    textTransform: 'capitalize'
  }

});


export default HelpScreenTab;