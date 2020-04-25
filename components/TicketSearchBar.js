import React, {useState, useEffect, useContext} from 'react';
import {SearchBar} from 'react-native-elements';
import {searchTickets} from '../apis/ticketApi';
import {searchAddressIndexFromAlgolia} from '../apis/algoliaApi';
import {useStore} from '../context';
import {setSearching, setSearchTickets} from '../context/actions';
import Colors from '../constants/Colors';
import AuthContext from "../context/authContext";
import _ from 'lodash';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const TicketSearchBar = () => {
  const [search, setSearch] = useState('');
  const {dispatch} = useStore();
  const {userId} = useContext(AuthContext);

  useEffect(() => {
    async function searchAddress() {
      try {
        dispatch(setSearchTickets([]));
        const {hits} = await searchAddressIndexFromAlgolia(search);
        let ticketsIds = hits.map(hit => hit.objectID);
        const randomSample = _.sampleSize(ticketsIds, 10);
        if (ticketsIds.length > 0) {
          const result = await searchTickets(randomSample, userId);
          if (result) {
            dispatch(setSearchTickets(result));
          }
        }
      } catch (error) {
      }
    }

    if (search.length > 4) {
      searchAddress();
    } else {
      dispatch(setSearchTickets([]));
    }
  }, [search]);

  return (
    <SearchBar
      platform="ios"
      placeholder="Type area, district, city, pincode.."
      onChangeText={setSearch}
      value={search}
      round="true"
      showCancel={true}
      onCancel={() => dispatch(setSearching(false))}
      onFocus={() => dispatch(setSearching(true))}
      containerStyle={{
        backgroundColor: Colors.background,
        padding: widthPercentageToDP('0.75%'),
      }}
      inputStyle={{
        height: widthPercentageToDP('8%'),
        fontSize: widthPercentageToDP('3.5%'),
        fontFamily: 'lato',
        color: Colors.textDark
      }}
      cancelButtonProps={{
        buttonTextStyle:{
          fontSize: widthPercentageToDP('3.5%'),
          fontFamily: 'lato-bold'
        }
      }}
      searchIcon={{
        iconStyle:{
          fontSize: widthPercentageToDP('4.5%')
        }
      }}
    />
  );
};

export default TicketSearchBar;