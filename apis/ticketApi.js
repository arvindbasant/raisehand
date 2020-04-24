import {firestore, firebase} from '../utils/firebase';

const ticketRef = firestore.collection('tickets');
import log from "./logApi";

const addTicket = async (ticket) => {
  try {
    const res = await ticketRef.add(ticket);
    return res.id;
  } catch (error) {
    await log({error, msg: `addTicket${ticket}`});
  }
};

const updateTicket = async (docId, fields) => {
  try {
    await ticketRef.doc(docId).set(fields, {merge: true});
    return 'success';
  } catch (error) {
    await log({error, msg: `updateTicket${docId}-${fields}`});
  }
};

const getTicketsForUser = async (key, userId, statusArr) => {
  try {
    let userTickets = [];
    let querySnapshot;

    if (statusArr.length > 0)
      querySnapshot = await ticketRef.where(key, '==', userId).where('status', 'in', statusArr).get();
    else
      querySnapshot = await ticketRef.where(key, '==', userId).get();

    querySnapshot.forEach(doc => {
      userTickets.push({docId: doc.id, info: doc.data()});
    });
    return userTickets;
  } catch (error) {
    await log({error, msg: `getTicketsForUser${userId}-${key}-${statusArr}`});
  }
};

const searchTickets = async (ticketsIds, userId) => {
  try {
    let userTickets = [];
    const querySnapshot = await ticketRef.where(firebase.firestore.FieldPath.documentId(), "in", [...ticketsIds])
      .where('status', '==', 'active')
      .get();
    querySnapshot.forEach(doc => {
      userTickets.push({docId: doc.id, info: doc.data()})
    });
    return userTickets.filter(ticket => ticket.info.userId !== userId);
  }catch (e) {
    await log({error, msg: `searchTickets${ticketsIds}-${userId}`});
  }
};

export {addTicket, getTicketsForUser, updateTicket, searchTickets};