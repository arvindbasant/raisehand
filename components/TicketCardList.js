import React, {useContext, useEffect} from 'react';
import {getTicketsForUser, updateTicket} from '../apis/ticketApi';
import {SafeAreaView, FlatList, Image, View} from 'react-native';
import {TicketCard} from './TicketCard';
import {getCurrentDate} from '../utils';
import {useStore} from '../context';
import {
  setHelpTickets,
  setFetching,
  setServiceTickets,
  setRefreshing,
  updateHelpTicket,
  updateServiceTicket, updateSearchTicket
} from '../context/actions';
import {TICKET_STATUS} from '../context/types';
import Screens from "../constants/Screens";
import Colors from '../constants/Colors';
import {firebase} from '../utils/firebase';
import AuthContext from "../context/authContext";
import {renderIf, renderIfElse} from "../utils/renderIf";
import Loader from "./Loader";
import {deleteAlgoliaObject} from "../apis/algoliaApi";
import log from "../apis/logApi";

const TicketCardList = ({statusArr, screen, children}) => {
  const {state, dispatch} = useStore();
  const {refreshing, fetching, searching, helpTickets, serviceTickets, searchTickets} = state;
  const key = screen === Screens.HELP || screen === Screens.HELP_STATUS ? 'userId' : 'serviceUserId';
  const {userId} = useContext(AuthContext);

  useEffect(() => {
    async function getUserRequests() {
      dispatch(setFetching(true));
      const tickets = await getTicketsForUser(key, userId, statusArr);
      screen === Screens.HELP_STATUS ? dispatch(setHelpTickets(tickets)) : dispatch(setServiceTickets(tickets));
      dispatch(setFetching(false));
    }

    if (!searching || !searching && screen === Screens.SERVICE)
      getUserRequests();
  }, [searching, screen]);

  const handleRefresh = async () => {
    if (!searching) {
      dispatch(setRefreshing(true));
      dispatch(setFetching(true));
      const tickets = await getTicketsForUser(key, userId, statusArr);
      screen === Screens.HELP_STATUS ? dispatch(setHelpTickets(tickets)) : dispatch(setServiceTickets(tickets));
      dispatch(setRefreshing(false));
      dispatch(setFetching(false));
    }
  };

  const onPress = async (ticket, action) => {
    try {
      const now = getCurrentDate();
      const {docId} = ticket;
      let res = '';
      switch (action) {
        case 'HELP_STATUS_CANCEL': {
          res = await updateTicket(docId, {status: TICKET_STATUS.CANCELLED, cancelledDate: now});
          await deleteAlgoliaObject(docId);
          if (res === 'success')
            dispatch(updateHelpTicket({docId, info: {status: TICKET_STATUS.CANCELLED, cancelledDate: now}}));
          break;
        }
        case 'SERVICE_COMPLETE': {
          const res = await updateTicket(docId, {status: TICKET_STATUS.COMPLETED, completedDate: now});
          await deleteAlgoliaObject(docId);
          if (res === 'success')
            dispatch(updateServiceTicket({docId, info: {status: TICKET_STATUS.COMPLETED, cancelledDate: now}}));
          break;
        }
        case 'DECLINED':
          await updateTicket(docId, {status: TICKET_STATUS.DECLINED, declinedDate: now});
          break;
        case 'SERVICE_PROCESS':
          res = await updateTicket(docId, {
            status: TICKET_STATUS.PROCESSING,
            processStartDate: now,
            serviceUserId: userId
          });
          if (res === 'success') {
            if (searching) {
              dispatch(updateSearchTicket({
                docId,
                info: {status: TICKET_STATUS.PROCESSING, processStartDate: now, serviceUserId: userId}
              }));
            } else {
              dispatch(updateServiceTicket({
                docId,
                info: {status: TICKET_STATUS.PROCESSING, processStartDate: now, serviceUserId: userId}
              }));
            }
          }
          break;
        case 'SERVICE_CANCEL':
          res = await updateTicket(docId, {
            status: TICKET_STATUS.ACTIVE,
            processStartDate: '',
            serviceUserId: '',
            rollbacks: firebase.firestore.FieldValue.arrayUnion({
              userId,
              date: now,
              type: TICKET_STATUS.SERVICE_CANCELLED
            })
          });
          if (res === 'success') {
            if (searching) {
              dispatch(updateSearchTicket({
                docId,
                info: {status: TICKET_STATUS.ACTIVE, processStartDate: '', serviceUserId: ''}
              }));

            } else {
              dispatch(updateServiceTicket({
                docId,
                info: {status: TICKET_STATUS.ACTIVE, processStartDate: '', serviceUserId: ''}
              }));
            }
          }

          break;
        case 'SERVICE_SHORTLIST':
          res = await updateTicket(docId, {
            status: TICKET_STATUS.SHORTLISTED,
            processStartDate: now,
            serviceUserId: userId
          });
          if (res === 'success')
            if (searching) {
              dispatch(updateSearchTicket({
                docId, info: {
                  status: TICKET_STATUS.SHORTLISTED,
                  processStartDate: now,
                  serviceUserId: userId
                }
              }));
            } else {
              dispatch(updateServiceTicket({
                docId, info: {
                  status: TICKET_STATUS.SHORTLISTED,
                  processStartDate: now,
                  serviceUserId: userId
                }
              }));
            }
          break;
        case 'SERVICE_REMOVE':
          res = await updateTicket(docId, {
            status: TICKET_STATUS.ACTIVE,
            processStartDate: '',
            serviceUserId: '',
            rollbacks: firebase.firestore.FieldValue.arrayUnion({
              userId,
              date: now,
              type: TICKET_STATUS.SHORTLISTED_REMOVED
            })
          });
          if (res === 'success') {
            if (searching) {
              dispatch(updateSearchTicket({
                docId, info: {
                  status: TICKET_STATUS.ACTIVE,
                  processStartDate: '',
                  serviceUserId: ''
                }
              }));
            } else {
              dispatch(updateServiceTicket({
                docId, info: {
                  status: TICKET_STATUS.ACTIVE,
                  processStartDate: '',
                  serviceUserId: ''
                }
              }));
            }
          }
          break;
        case 'HELP_STATUS_UPDATE': {

        }
      }
    } catch (error) {
      await log({error, action, docId: ticket.docId});
    }
  }

  const getActions = (status) => {
    if (screen === Screens.HELP_STATUS && status === TICKET_STATUS.ACTIVE)
      return ['CANCEL']; // add update later
    if (screen === Screens.SERVICE) {
      if (status === TICKET_STATUS.ACTIVE)
        return ['PROCESS', 'SHORTLIST'];
      if (status === TICKET_STATUS.SHORTLISTED)
        return ['PROCESS', 'REMOVE'];
      if (status === TICKET_STATUS.PROCESSING)
        return ['COMPLETE', 'CANCEL'];
    }
    return [];
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
      {children}
      {
        renderIfElse((fetching || refreshing) && !searching, () => <Loader/>).elseRender(() => (
          <View style={{
            marginBottom: searching ? 100 : 0
          }}>
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              extraData={searching ? serviceTickets : (screen === Screens.HELP_STATUS ? helpTickets : serviceTickets)}
              data={screen === Screens.HELP_STATUS ? helpTickets : (searching ? searchTickets : serviceTickets)}
              renderItem={({item}) =>
                <TicketCard
                  onPress={onPress}
                  ticket={item}
                  getActions={() => getActions(item.info.status)}
                  screen={screen}
                />}
              keyExtractor={item => item.docId}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
            {
              renderIf(searching, () => (
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  paddingBottom: 20,
                  backgroundColor: 'transparent'
                }}>
                  <Image source={require('../assets/images/search-by-algolia-light-background.png')}/>
                </View>
              ))
            }
          </View>
        ))
      }
    </SafeAreaView>
  )
};

export default TicketCardList;