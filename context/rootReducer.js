import {
  SET_FETCHING,
  SET_HELP_TICKETS,
  UPDATE_HELP_TICKET,
  SET_SERVICE_TICKETS,
  UPDATE_SERVICE_TICKET,
  DEFAULT_APPLICATION_STATE,
  SET_REFRESHING,
  SET_SEARCHING,
  SET_SEARCH_TICKETS,
  SET_TICKET, UPDATE_SEARCH_TICKET,
  SET_PROFILE,
  SIGN_IN,
  SIGN_OUT, SET_TAB_INDEX, CLEAR_STATE, TICKET_STATUS, SET_USER,
} from './types';

export function RootReducer(state = DEFAULT_APPLICATION_STATE, action) {
  let key, index;
  switch (action.type) {
    case SET_REFRESHING:
      return {...state, refreshing: action.refreshing};
    case SET_SEARCHING:
      return {...state, searching: action.searching};
    case SET_FETCHING:
      return {...state, fetching: action.fetching};
    case SET_HELP_TICKETS:
      return {...state, helpTickets: action.tickets};
    case SET_SERVICE_TICKETS:
      return {...state, serviceTickets: action.tickets};
    case SET_SEARCH_TICKETS:
      return {...state, searchTickets: action.tickets}
    case UPDATE_HELP_TICKET: {
      key = 'helpTickets';
      index = state[key].findIndex(ticket => ticket.docId === action.ticket.docId);
      return {
        ...state,
        [key]: [
          ...state[key].slice(0, index),
          {
            ...state[key][index],
            info: {...state[key][index].info, ...action.ticket.info}
          },
          ...state[key].slice(index + 1)
        ]
      };
    }
    case UPDATE_SERVICE_TICKET: {
      key = 'serviceTickets';
      index = state[key].findIndex(ticket => ticket.docId === action.ticket.docId);
      if (action.ticket.info.status === TICKET_STATUS.ACTIVE) {
        return {
          ...state,
          [key]: [
            ...state[key].slice(0, index),
            ...state[key].slice(index + 1)
          ]
        };
      } else {
        return {
          ...state,
          [key]: [
            ...state[key].slice(0, index),
            {
              ...state[key][index],
              info: {...state[key][index].info, ...action.ticket.info}
            },
            ...state[key].slice(index + 1)
          ]
        };
      }
    }
    case UPDATE_SEARCH_TICKET: {
      key = 'searchTickets';
      index = state[key].findIndex(ticket => ticket.docId === action.ticket.docId);
      let updatedState;
      if (action.ticket.info.status === TICKET_STATUS.PROCESSING) { // pop from search ticket
        updatedState = {
          ...state,
          [key]: [
            ...state[key].slice(0, index),
            ...state[key].slice(index + 1)
          ]
        };
      }
        else { // just update
          updatedState = {
            ...state,
            [key]: [
              ...state[key].slice(0, index),
              {
                ...state[key][index],
                info: {...state[key][index].info, ...action.ticket.info}
              },
              ...state[key].slice(index + 1)
            ]
          };
        }
      // make a copy in service tickets
      // else if (action.ticket.info.status === TICKET_STATUS.ACTIVE || action.ticket.info.status === TICKET_STATUS.SHORTLISTED) {
      //   return {
      //     ...state,
      //     [key]: [
      //       ...state[key].slice(0, index),
      //       {
      //         ...state[key][index],
      //         info: {...state[key][index].info, ...action.ticket.info}
      //       },
      //       ...state[key].slice(index + 1)
      //     ],
      //     serviceTickets: [...state.serviceTickets, {
      //       ...action.ticket,
      //       info: {...state[key][index].info, ...action.ticket.info}
      //     }]
      //   };
        // updatedState = {
        //   ...updatedState,
        //   serviceTickets: [...updatedState.serviceTickets, updatedState.searchTickets[index]]
        // };
      // } else if (action.ticket.info.status === TICKET_STATUS.SERVICE_CANCELLED || action.ticket.info.status === TICKET_STATUS.SHORTLISTED_REMOVED) {
      //   let key2 = 'serviceTickets';
      //   let index2 = state[key].findIndex(ticket => ticket.docId === action.ticket.docId);
      //   return {
      //     ...state,
      //     [key]: [
      //       ...state[key].slice(0, index),
      //       {
      //         ...state[key][index],
      //         info: {...state[key][index].info, ...action.ticket.info}
      //       },
      //       ...state[key].slice(index + 1)
      //     ],
      //     [key2]: [
      //       ...state[key2].slice(0, index2),
      //       ...state[key2].slice(index2 + 1)
      //     ]
      //   }
      // }
      //
      return updatedState;
    }
    case SET_TICKET:
      return {
        ...state,
        ticket: action.form
      }
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      }
    case SET_USER:
      return {
        ...state,
        user: action.user
      }
    case SET_TAB_INDEX:
      return {
        ...state,
        tabIndex: action.tabIndex,
      }
    case CLEAR_STATE:
      return {
        ...state,
        ...DEFAULT_APPLICATION_STATE,
      }
    default:
      return state;
  }
}

// const updateTicketCollection = (state, key, action) => {
//   let index = state[key].findIndex(ticket => ticket.docId === action.ticket.docId);
//   let shouldPopTicket = false;
//   let updatedState;
//
//   if (key === 'serviceTickets') {
//     if (action.ticket.info.status === TICKET_STATUS.ACTIVE) {
//       shouldPopTicket = true;
//     }
//   }
//   if (key === 'searchTickets') {
//     if (action.ticket.info.status === TICKET_STATUS.PROCESSING) {
//       shouldPopTicket = true;
//     }
//   }
//   if (shouldPopTicket) {
//     updatedState = {
//       ...state,
//       [key]: [
//         ...state[key].slice(0, index),
//         ...state[key].slice(index + 1)
//       ]
//     };
//   } else {
//     updatedState = {
//       ...state,
//       [key]: [
//         ...state[key].slice(0, index),
//         {
//           ...state[key][index],
//           info: {...state[key][index].info, ...action.ticket.info}
//         },
//         ...state[key].slice(index + 1)
//       ]
//     };
//   }
//
//   if (key === 'searchTickets') {
//     return {
//       ...updatedState,
//       serviceTickets: [...updatedState.serviceTickets, updatedState.searchTickets[index]]
//     };
//   }
//   return updatedState;
// }